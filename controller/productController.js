const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');


// Create a new product

const createProduct = asyncHandler(async (req, res) => {

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    console.log(newProduct);

    res.json({
      success: true,
      message: 'Product created successfully',
      newProduct
    })
  } catch (err) {
    throw new Error(err);
  }
});

//update a product
const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      success: true,
      message: 'Product updated successfully',
      updateProduct
    });
  } catch (err) {
    throw new Error(err);
  }
})

// Get all products

const getAllproducts = asyncHandler(async (req, res) => {
  try {
    //filtering product
    const queryObj = { ...req.query }; //filter by query
    console.log(queryObj);
    const excludeFields = ["page", "sort", "limit", "fields"];

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte| gt| lte|lt)\b/g, (match) => `$${match}`);

    const queryObj2 = excludeFields.forEach((field) => delete queryObj[field]);

    let query = Product.find(JSON.parse(queryStr));

    //sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(" "); // split the query by comma and join with blank space
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); // default sort by createdAt in descending order
    }

    const getProducts = await Product.find({ queryObj });
    res.json({
      success: true,
      getProducts
    })
  } catch (err) {
    throw new Error(err);
  }
});

//get a product by id

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const findProduct = await Product.findById(id);
    res.json({
      success: true,
      findProduct
    })

  } catch (err) {
    throw new Error(err);
  }
});

//delete product

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const deleteProduct = await Product.findById(id);
    res.json({
      success: true,
      message: 'Product deleted successfully',
      deleteProduct: deleteProduct
    })

  } catch (err) {
    throw new Error(err);
  }
})


module.exports = { createProduct, getAllproducts, getProductById, updateProduct, deleteProduct };