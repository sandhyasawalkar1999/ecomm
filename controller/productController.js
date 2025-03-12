const { request } = require('express');
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
    // Copy the query parameters
    const queryObj = { ...req.query };
    console.log("Query Object:", queryObj);

    // Exclude certain fields from filtering
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Convert query operators (gte, gt, lte, lt) to MongoDB syntax
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Execute query
    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    // check if page exists in the database
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error('This page does Not exist');
    }
    console.log(page, limit, skip);

    // Fetch products
    const getProducts = await query; // Fixed: directly using the query

    res.json({
      success: true,
      getProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
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