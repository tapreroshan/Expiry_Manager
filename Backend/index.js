const express = require("express");
const app = express();
const mongoose = require("mongoose");
const product=require("./Routes/product.route")
const user = require('./Routes/user.route')
const cors=require("cors")
require("dotenv").config()
// Middleware

app.use(express.json());

app.use(cors())
app.use("/auth",user)
app.use('/product',product);

// Connect to MongoDB
const connect =async () => {
    await  mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to db");
}

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
    connect();
})