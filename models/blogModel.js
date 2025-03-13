const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {

    type: String,
    required: true,
  },
  numViews: {
    type: Number,
    default: 0,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  isDisliked: {
    type: Boolean,
    default: false,
  },
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  images: {
    type: String,
    default: "https://brandminds.ro/wp-content/uploads/2021/07/blogging-for-business-blog-articles-e1536066690505.jpghttps://brandminds.ro/wp-content/uploads/2021/07/blogging-for-business-blog-articles-e1536066690505.jpg"
  },
  author: {
    type: String,
    default: "Admin",
  },
},{
    toJSON: {
      Virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timespams: true,
  },

);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;