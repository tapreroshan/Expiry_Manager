const express = require("express");
const app = express();
const mongoose = require("mongoose");
const product=require("./Routes/product.route")
const user = require('./Routes/user.route')
// Middleware

app.use(express.json());
app.use("/",user)
app.use('/product',product);

// Connect to MongoDB
const connect =async () => {
    await  mongoose.connect("mongodb://127.0.0.1:27017/Expriy_Mangaer")
    console.log("Connected to db");
}

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
    connect();
})