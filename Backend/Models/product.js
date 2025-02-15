const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:String,
    expiry_date :{
        type:Date,
        required:true
    },
    quantity:Number,
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const productModel = mongoose.model('Product',productSchema);

module.exports = productModel;