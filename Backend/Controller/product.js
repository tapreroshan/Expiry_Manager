

const productModel = require('../Models/product');

// Create Product (Associate with Logged-in User)
const createProduct = async (req, res) => {
    try {
        const { name, expiry_date, batch_number, quantity } = req.body;
        const user=req.user
        if (!name || !expiry_date || !batch_number) {
            return res.status(400).json({ error: "All fields are required" });
        }

  
        const newProduct = new productModel({
            name,
            expiry_date,
            batch_number,
            quantity,
            user: user.id // Add the user ID to the product
            });
  
            

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ msg: "Failed to create product", error });
    }
};

// Get Products (Only for Logged-in User)
const getProduct = async (req, res) => {
    try {
        console.log("Fetching Products for User ID:", req.user.id);
        const products = await productModel.find({ user: req.user.id });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};
//Update product data 

const updateProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!product) {
            return res.status(404).json({ error: "Product not found or not authorized to update" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
};

// Delete Product (Only if Owned by Logged-in User)
const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete({ _id: req.params.id});

        if (!product) {
            return res.status(404).json({ error: "Product not found or not authorized to delete" });
        }

        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
};

module.exports = { createProduct, getProduct, deleteProduct,updateProduct };
