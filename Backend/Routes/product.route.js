const express=require('express');
const routes= express.Router();
const authmiddleware = require("../Middleware/authmiddleware")

const {createProduct,getProduct,deleteProduct,updateProduct} = require('../Controller/product');


routes.post('/add',authmiddleware,createProduct);

routes.get('/medicines',authmiddleware ,getProduct);
routes.delete('/delete/:id', authmiddleware, deleteProduct);

routes.put('/update/:id', authmiddleware, updateProduct);

module.exports = routes;