const { generatetoken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utilis/validateMongodbid");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../controller/emailcontroller");
const { compare } = require("bcrypt");

//user registration
const createUser = asyncHandler(
  async (req, res) => {
    console.log(req.body);
    const email = req.body.email;

    console.log(email);
    const findUser = await User.findOne({ email });
    console.log(req.body, "from line 9")
    if (!findUser) {
      //create a new user
      const newUser = await User.create(req.body);
      res.json({

        success: true,
        message: "User created successfully",
        user: newUser
      });

    }
    else {
      //user already exists
      res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }
  }
)

//user login9
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  // Check if the user exists
  const findUser = await User.findOne({ email });
  if (findUser && await findUser.isPasswordMatched(password)) {
    const newRefreshToken = generateRefreshToken(findUser?._id);

    // Save the refresh token in the database
    await User.findByIdAndUpdate(findUser.id, {
      refreshToken: newRefreshToken,
    }, { new: true });

    // Set the  refresh token in cookies
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000 // 3 days
    });

    res.json({
      success: true,
      message: "User logged in successfully",
      token: generatetoken(findUser?._id)
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
    return;
  }
});


//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    return res.status(403).json({ success: false, message: "No refresh token in cookie" });
  }

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    return res.status(403).json({ success: false, message: "No refresh token in DB or token does not match" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    if (user.id !== decoded.id) {
      return res.status(403).json({ success: false, message: "User ID mismatch with token" });
    }

    const accessToken = generatetoken(user?._id);
    res.json({ success: true, accessToken });
  });
});

//logout function

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh Token un Cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate({ refreshToken: refreshToken }, {
    refreshToken: '',
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.json({
    success: true,
    message: "User logged out successfully"
  })
  return res.sendStatus(204);


});

//update a user

const updateUser = asyncHandler(async (req, res) => {
  // console.log(req.User);
  const { id } = req.user;
  validateMongoDbId(id);
  console.log(id);
  // console.log(req.params);
  try {

    const updateUser = await User.findByIdAndUpdate(id, {
      firstname: req.body?.firstname,
      lastname: req.body?.lastname,
      email: req.body?.email,
      mobile: req.body?.mobile,
    });
    res.json({
      success: true,
      message: "User updated successfully",
      user: updateUser
    });
  } catch (err) {
    throw new Error(err);
  }
});

//get all users

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      users: users

    })
  }
  catch (error) {
    throw new Error(error)
  }
});

//get a single user

const getUser = asyncHandler(async (req, res) => {
  // cosole.log(req.params)
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getUser = await User.findById(id);
    res.json({
      success: true,
      message: "user details",
      getUser: getUser
    });
  }
  catch (err) {
    throw new Error(err);
  }

});

//delete user

const deleteUser = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    validateMongoDbId(id);

    res.json({
      success: true,
      message: "User deleted successfully",
      deletedUser: deletedUser
    });
  } catch (err) {
    throw new Error(err);
  }
});

//block user

const blockUser = asyncHandler(async (req, res) => {
  // console.log(req.params);

  console.log(req.params);
  const { id } = req.params;
  validateMongoDbId(id);


  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      success: true,
      message: "User blocked successfully",
      blockUser: blockUser
    });
  } catch (err) {
    throw new Error(err);
  }
});

//unblock user

const unblockUser = asyncHandler(async (req, res) => {
  // console.log(req.params);
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      success: true,
      message: "User unblocked successfully",
      blockUser: unblockUser
    });
  } catch (err) {
    throw new Error(err);
  }
});

// user update password

const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const password = req.body.password;
  validateMongoDbId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json({
      success: true,
      message: "Password updated successfully",
      user: updatePassword
    });
  }
  else {
    res.json(user);
  }
});

//forgetPasswordToken

const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");

  try {
    const token = await user.createPasswordRestToken(); // FIXED
    await user.save(); // Ensure to save the token in the database

    const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10 minutes.
    <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forget Password Link",
      html: resetURL,
    };
    sendEmail(data);

    res.json({
      success: true,
      token: token,
      message: "Token sent to your email",
    });

  } catch (err) {
    throw new Error(err);
  }
});

//reset password

const resetPassword = asyncHandler(async (req, res) => {

  const {oldPassword, newPassword} = req.body;
  const email = req.body.email;
  const user = await User.findOne({email: email});
  if (!user) throw new Error("User not found with this email");
  user.password, oldPassword => bcrypt compare
  // generate new hashed password
  User.findOneAndUpdate({email: email}, {password: newHashedPassword})


  // const { password } = req.body;
  // const { token } = req.params;
  // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // const user = await User.findOne({
  //   passwordResetToken: hashedToken, passwordResetTokenExpiresAt: { $gt: Date.Now() }
  // });
  // if (!user) throw new Error("Token Expire,please try again later");
  // user.password = password;
  // user.passwordResetToken = undefined;
  // user.passwordResetTokenExpiresAt = undefined;
});

module.exports = { createUser, loginUser, updateUser, getAllUsers, getUser, deleteUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgetPasswordToken };