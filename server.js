var express= require("express");
var mongoose=require("mongoose");
var app= express();
var bodyparser= require("body-parser");
var methodOverride= require("method-override");
var bcrypt= require("bcrypt");

var cookieParser= require("cookie-parser");
var session= require("express-session");

var User= require("./models/user")
var Contact= require("./models/contact");

app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(session({
    key: 'user_id',
    secret: 'usersss',
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");

app.get("/",function(req,res)
{ 
    res.render("homepage");
});


app.post("/",function(req,res)
{  const user= req.body.user;

 User.findOne({email:user.email}).then(userdoc =>{
        if(userdoc)
        {
            return res.redirect('/register');
        }
        return bcrypt.hash(user.password,12).then(hashedpass => {
            const userdata= new User({
                email: user.email,
                password : hashedpass,
                name: user.name,
                phoneno: user.phoneno,
                contacts: []
            });
            userdata.save();
         }).then(result => {
             res.redirect('/');
         });
       
 })
 .catch(err => {
console.log("Signup error");
 });
});

 app.post("/log", function(req,res)
 {
    var email= req.body.email;
        password= req.body.password;
        User.findOne({email: email}, function(err,curruser)
        {
            if(err)
            {  
                res.redirect("/");
            }
            else if(!curruser)
            {
               // alert("Username Not Found!");
                res.redirect("/");
            }
            else
            {if(bcrypt.compareSync(password,curruser.password))
            { 
                req.session.user= curruser;
                //res.send(req.session.user);  
                res.redirect("/contacts");
            }
            else{
            
                res.redirect("/");
            }
            }
        }) ;
 });

 app.get("/logout",function(req,res)
 {
// if(req.session.user && req.cookies.user_id)
// {
    req.session.destroy(function(err)
    { if(err)
        {
            console.log("Session not destroyed");
        }
    });
  //  console.log("NIGGAHHHH");
    res.redirect("/");
    
// }
// else{
//   res.redirect('/');
// }
 })

app.get("/register",function(req,res)
{
    res.render("register");
});




app.get("/contacts",function(req,res)
{ 
  User.findOne({_Id: req.session._Id}).populate("contacts").exec(function(err,user)
  {
      if(err)
      {
          console.log("Something went wrong");
      }
      else
      { 
        res.render("contacts",{user:user});
      }
  });
});

app.get('/contacts/new',function(req,res)
{ 
    res.render("newcontact");
})

app.post("/contacts",function(req,res)
{
    User.findOne({_Id: req.session._Id},function(err,user)
    { if(err)
        {
            res.redirect('/contacts/new');
        }
        if(user)
        {
        Contact.create(req.body.contact,function(err,newContact)
        {
           if(err)
           {
            alert("Something went wrong, try again!");
            res.redirect("/contacts/new");
           }
           else{
               user.contacts.push(newContact);
               user.save();
               res.redirect("/contacts");
           }
        });
    }
    })
    
});


app.get("/contacts/:id/edit",function(req,res)
{
    Contact.findById(req.params.id,function(err,econtact)
    {
        res.render("edit", {contact: econtact} );
    });
    
});


app.post("/contacts/:id",function(req,res)
{
Contact.findByIdAndUpdate(req.params.id,req.body.contact,function(err,updated)
{
    if(err)
    {
        res.redirect("/contacts");
    }
    else{
        res.redirect("/contacts");
    }
});
});

app.delete("/contacts/:id",function(req,res)
{ 
    


    Contact.findByIdAndDelete(req.params.id,function(err,deleted)
    {
        if(err)
        {
            res.redirect("/contacts");
        }
        else{
            res.redirect("/contacts");
        }
    });
});





mongoose.connect('mongodb://newuser:awasthy@cluster0-shard-00-00-ors3g.mongodb.net:27017,cluster0-shard-00-01-ors3g.mongodb.net:27017,cluster0-shard-00-02-ors3g.mongodb.net:27017/addressbook?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
{useNewUrlParser: true})
.then(result=>{
    app.listen(3000,function()
    {
        console.log("Server Started");
    });  
})
.catch(err=>
    {
        console.log(err);
    });
