const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    enum: ['Apple', 'Samsung', "Lenovo"]
  },
  quantity: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  images: {
    type: Array,
  },
  color: {
    type: String,
    enum: ["Black", "Brown", "Red", "Green"],
  },
  rating: [{
    star: Number,
    postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
},
  { timestamps: true });


module.exports = mongoose.model('Product', productSchema);