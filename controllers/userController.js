const userModel = require("../models/userModel");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemon = require("nodemon");
// const cookieParser = require("cookie-parser");

const app = express();
// app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
//register users
exports.registerController = async (req, res) => {
  try {
    const { lastName, firstName, email, password } = req.body;
    //validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Information in fields incomplete",
      });
    }
    //checking existing users
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(401).send({
        success: false,
        message: "A user with similar ID already exists",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10); // WHAT IS THIS FUNCTION? lookup

    //else we save new user
    const user = new userModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    return res.status(201).send({
      success: true,
      message: "new user created",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "error in register callback",
      success: false,
      error,
    });
  }
};

//get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      success: true,
      message: "All user data, total users are given",
      userCount: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all users",
      error,
    });
  }
};

//login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please provide email and password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered",
      });
    }
    //password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    const tokenVal = jwt.sign({ _id: user._id }, process.env.SECRET);

    res.cookie("token", tokenVal, {
      expires: new Date(Date.now() + 1296000 * 1000),
      httpOnly: false,
    });
    console.log(tokenVal);
    console.log("login successfull, cookie generated");

    return res.status(200).send({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login callback",
      error,
    });
  }
};

//logout
exports.logoutController = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    console.log("cookie deleted");
    return res.status(200).send({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in logout callback",
      error,
    });
  }
};

//current user
exports.getCurrentUserIDController = async (req, res) => {
  try {
    console.log(req);
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).send({
        success: true,
        message: "no token for existing user",
        null: true,
      });
    }
    const decode = jwt.verify(token, process.env.SECRET)._id;
    console.log(decode);
    return res.status(200).send({
      success: true,
      message: "Current user",
      decode,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting current user from cookies",
      error,
    });
  }
};
