const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

//hash the password using bcrypt

userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
const UserModel = mongoose.model('User',userSchema);

module.exports = UserModel;