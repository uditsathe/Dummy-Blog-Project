const express = require("express");
const {
  getAllBlogsController,
  getBlogByIdController,
  composeBlogController,
  updateBlogController,
  deleteBlogController,
  getUserBlogController,
  getOneBlogController,
  getEditBlogController,
  putEditBlogController,
} = require("../controllers/blogController");
const router = express.Router();

//router

//GET all blogs
router.get("/allBlogs", getAllBlogsController);

//GET || get single blog
router.get("/getBlog/:blogID", getBlogByIdController);

//POST -> blog creation
router.post("/composeBlog", composeBlogController);

//PUT || update blogs
router.put("/updateBlog/:blogID", updateBlogController);

//DELETE || deleting blog
router.delete("/deleteBlog/:blogID", deleteBlogController);

//GET || getting user blog
router.get("/userBlogs", getUserBlogController);

//GET|| getting one blog
router.get("/oneBlog/:blogID", getOneBlogController);

//GET || getting edit blog page
router.get("/editBlog/:blogID", getEditBlogController);

//PUT|| commit edits in blog
// router.put("/editBlog/:blogID", putEditBlogController);

module.exports = router;
