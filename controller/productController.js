const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

// Create a new product

const createProduct = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Product created successfully'
  })



})

module.exports = { createProduct };