const express = require("express");

const postsController = require("../controllers/post");
const router = express.Router();

// router.get("/users/:userId/posts", userController.getUser);
router.post("/users/:userId/posts", postsController.createPost);
router.get("/users/:userId/posts", postsController.getPosts);
router.get("/posts", postsController.getAllPosts);

module.exports = router;