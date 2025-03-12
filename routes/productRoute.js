const express = require('express');
const { createProduct, getAllproducts, getProductById, updateProduct, deleteProduct } = require('../controller/productController');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/createproduct', authMiddleware, isAdmin, createProduct);
router.get('/getproducts', authMiddleware, isAdmin, getAllproducts);
router.get('/getproduct/:id', authMiddleware, isAdmin, getProductById);
router.put('/updateproduct/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/deleteproduct/:id', authMiddleware, isAdmin, deleteProduct)

module.exports = router;
