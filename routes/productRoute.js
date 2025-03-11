const express = require('express');
const { createProduct } = require('../controller/productController');
const router = express.Router();


router.post('/createproduct', createProduct)

module.exports = router;
