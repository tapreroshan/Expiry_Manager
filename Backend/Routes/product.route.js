const express=require('express');
const routes= express.Router();
const authmiddleware = require("../Middleware/authmiddleware")

const {createProduct,getProduct} = require('../Controller/product');


routes.post('/add',createProduct);

routes.get('/',authmiddleware ,getProduct)
module.exports = routes;