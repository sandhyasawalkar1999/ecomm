const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: Array,
    default: [],
  },
  address: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  }],
  whilist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  refreshToken: {
    type: String,
    default: ''
  },
  passwordChangeAt: Date,
  passwordResettoken: String,
  passwordResetExpires: Date,


}, {
  timestamps: true,
}
);

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);

});
userSchema.methods.isPasswordMatched = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};
userSchema.methods.createPasswordRestToken = async function () {
  const resettoken = crypto.randomBytes(32).toString('hex');
  this.passwordResettoken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
}




//Export the model
module.exports = mongoose.model('User', userSchema);