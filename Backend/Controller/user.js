const usermodel = require('../Models/user');
const jwt = require('jsonwebtoken');
const SECRECT_KEY = 'SECRECT_KEY';

const bcrypt = require("bcrypt")
const jwttoken= (user)=>{
    return jwt.sign({id: user._id}, SECRECT_KEY)
}

const signup = async (req,res) => {
    const newUser = new usermodel(req.body);
    const token =jwttoken(user)
    await newUser.save();
    res.json({user: newUser, token}).status(201);
}

// Login 

const login = async (req,res) => {
    const user = await usermodel.findOne({email: req.body.email});
    if(!user ||!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(401).json({error: 'Invalid credentials'});
    }
    const token =jwttoken(user)
    res.json({user, token}).status(200);
}


module.exports={signup,login}