var mongoose= require("mongoose");
var User= require("./models/user");
var Contact= require("./models/contact");

function Del()
{
    User.remove({},function(err)
    {
        if(err)
        {
            console.log("Flop");
        }
        else{
            console.log("Hit");
        }
    });

    Contact.remove({},function(err)
    {
        if(err)
        {
            console.log("Flop1");
        }
        else
        {
            console.log("Hit1");
        }
    });

}

module.exports= Del;
