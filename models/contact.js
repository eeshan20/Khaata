var mongoose= require("mongoose");

var schema= mongoose.Schema;

var contactschema= new schema({
    name: String,
    phoneno: Number,
    email: String,
    address: String,
});

module.exports = mongoose.model('Contact',contactschema);
