const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    expiry_date :{
        type:Date,
        required:true
    },
    batch_number:Number,
    quantity:Number,
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const productModel = mongoose.model('Product',productSchema);

module.exports = productModel;