var mongoose= require("mongoose");
var Contact= require("./contact");

var schema= mongoose.Schema;

var userSchema= new schema({
    name: String,
    email: String,
    password: String,
    phoneno: Number,
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact"
        }
    ]

});



module.exports = mongoose.model('User',userSchema);
