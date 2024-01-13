const mongoose = require("mongoose");
const express = require("express");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

//GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "No blogs found",
      });
    }
    return res.status(200).send({
      success: true,
      blogCount: blogs.length,
      message: "All blogs list",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all blogs",
      error,
    });
  }
};

//GET SINGLE BLOG
exports.getBlogByIdController = async (req, res) => {
  try {
    const { blogID } = req.params;
    const blog = await blogModel.findById(blogID);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "No blog found for given ID",
        error,
      });
    }
    return res.status(200).send({
      success: true,
      message: "Fetched single blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in getting blog by ID",
      error,
    });
  }
};

//CREATE BLOG
exports.composeBlogController = async (req, res) => {
  try {
    const { title, content, user } = req.body;

    //validating the recieved input
    if (!title || !content || !user) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "Unable to find user",
      });
    }
    const newBlog = new blogModel({ title, content, user });
    //IN THE FOLLOWING CODE WE START A TRANSACTION AND SAVE CHANGES IN BOTH USER AND BLOG DOCUMENTS INVOLVED IN THE NEW BLOG CREATED
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();
    await newBlog.save();

    return res.status(201).send({
      success: true,
      message: "New blog uploaded",
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while composing blog",
      error,
    });
  }
};

//UPDATE BLOG
exports.updateBlogController = async (req, res) => {
  try {
    const { blogID } = req.params;
    const { title, content } = req.body;

    const blog = await blogModel.findByIdAndUpdate(
      blogID,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Blog updated.",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: true,
      messaage: "Error while updating blogs",
      error,
    });
  }
};

//DELETE BLOG
exports.deleteBlogController = async (req, res) => {
  try {
    const { blogID } = req.params;
    const blog = await blogModel.findOneAndDelete(blogID).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "Blog delete!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while deleting blog",
      error,
    });
  }
};

//GET USER BLOG
exports.getUserBlogController = async (req, res) => {
  try {
    const token = req.query.userID;
    console.log(token);
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    const userBlogs = await userModel.findById(decoded._id).populate("blogs");
    if (!userBlogs) {
      return res.status(404).send({
        success: false,
        message: "Blogs not found with this userID",
      });
      // console.log(
      //   "the user coded userID recieved in the params is:  " + req.params.userID
      // );
    }
    return res.status(200).send({
      success: true,
      message: "Blogs for give userID found",
      userBlogs: userBlogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in getting user blog",
      error,
    });
  }
};

//GET ONE BLOG
exports.getOneBlogController = async (req, res) => {
  try {
    const blogID = req.params.blogID;
    const blog = await blogModel.findById(blogID);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).send({
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in getting blog",
      error,
    });
  }
};

//GET ONE BLOG TO EDIT
exports.getEditBlogController = async (req, res) => {};

//PUT EDITS IN ONE BLOG
// exports.putEditBlogController = async (req, res) => {};
