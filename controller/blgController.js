const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validMongoDbId = require("../utilis/validateMongodbid");


//create a new blog
const createBlog = asyncHandler(async (req, res) => {
  try {

    const newBlog = await Blog.create(req.body);
    res.json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog
    })

  } catch (err) {
    throw new Error(err);
  }

});

//update a blog

const updateBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    console.log(updateBlog);

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog: updateBlog
    })

  } catch (err) {
    throw new Error(err);
  }
});

//get a blog

const getBlogById = asyncHandler(async (req, res) => {

  try {

    const { id } = req.params;
    const findBlogById = await Blog.findById(id);

    res.json({
      success: true,
      message: "Blog find successfully",
      blog: findBlogById,
    })

  } catch (err) {
    throw new Error(err);
  }
});

//find all blogs

const getAllBlogs = asyncHandler(async (req, res) => {

  try {
    const blogs = await Blog.find({});
    res.json({
      success: true,
      message: "All blogs found successfully",
      blogs: blogs
    })

  } catch (err) {
    throw new Error(err);
  }

});


module.exports = {
  createBlog,
  updateBlog,
  getBlogById,
  getAllBlogs
}