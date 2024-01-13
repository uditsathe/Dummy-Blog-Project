const express = require("express");
const cookieParser = require("cookie-parser");
const {
  getAllUsers,
  registerController,
  loginController,
  logoutController,
  getCurrentUserIDController,
} = require("../controllers/userController");

//router object
const router = express.Router();
router.use(cookieParser());
//GET all users
router.get("/allUsers", getAllUsers);

//create user || POST
router.post("/register", registerController);

//login ||POST
router.post("/login", loginController);

//logout|| GET
router.get("/logout", logoutController);

//get userid by token || GET
router.get("/currentUser", getCurrentUserIDController);

module.exports = router;
