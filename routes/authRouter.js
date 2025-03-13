const express = require('express')
const router = express.Router();
const { createUser, loginUser, updateUser, getAllUsers, getUser, deleteUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgetPasswordToken } = require("../controller/userController.js");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware.js');


router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/allusers", getAllUsers);
router.get("/getuser/:id", authMiddleware, isAdmin, getUser);
router.delete("/delete/:id", deleteUser);
router.put("/edit-user", authMiddleware, updateUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.get("/refreshtoken", handleRefreshToken);
router.get("/logout", logout);
router.put("/password", authMiddleware, updatePassword);
router.put("/forget-password-token/:token", forgetPasswordToken)
module.exports = router;  