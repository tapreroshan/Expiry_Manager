const usermodel = require('../Models/user');
const jwt = require('jsonwebtoken');
const SECRECT_KEY = 'SECRECT_KEY';

const bcrypt = require("bcrypt")
const jwttoken= (user)=>{
    return jwt.sign({id: user._id}, SECRECT_KEY)
}

const signup = async (req,res) => {
    try {
        const {name,email,password}=req.body
    const newUser = new usermodel({name,email,password});
    //checke email exist
    const userExist = await usermodel.findOne({email});
    if (userExist){
        console.log("Email already exists")
        return res.status(400).json({"message": 'Email already exists'})
    }
    const token =jwttoken(newUser)
    await newUser.save();
    res.json({ token, name: newUser.name}).status(201);
    } catch (error) {
        res.status(400).json({message:"something went wrong",error: error})
    }
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