const express = require('express');
const router = express.Router();
const { createBlog, updateBlog, getBlogById, getAllBlogs } = require('../controller/blgController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post('/createblog', authMiddleware, isAdmin, createBlog);
router.put('/updateblog/:id', authMiddleware, isAdmin, updateBlog);
router.get('/findblog/:id', authMiddleware, isAdmin, getBlogById)
router.get('/getblog', authMiddleware, isAdmin, getAllBlogs)
module.exports = router;