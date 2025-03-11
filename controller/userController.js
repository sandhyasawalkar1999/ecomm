const { generatetoken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utilis/validateMongodbid");
const generateRefreshToken = require("../config/refreshToken");

// const refreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

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


})

//update a user

const updateUser = asyncHandler(async (req, res) => {
  // console.log(req.User);
  const { id } = req.User;
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
})

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
})

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

})

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
})

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
})

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
})

module.exports = { createUser, loginUser, updateUser, getAllUsers, getUser, deleteUser, blockUser, unblockUser, handleRefreshToken, logout };