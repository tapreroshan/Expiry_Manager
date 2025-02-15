const productModel = require('../Models/product');


const createProduct = async(req,res)=>{
    const newProduct = new productModel(req.body);
    await newProduct.save();
    res.json(newProduct).status(200);
    console.log(newProduct);

}

//Get all product

const getProduct = async (req,res) => {

    const products =await productModel.find();
    res.json(products);
    
}

module.exports={createProduct,getProduct}