const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function(password) {
    if(this.password != null) {
    return bcrypt.compareSync(password, this.password);
    } else {
        return false;
    }
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);