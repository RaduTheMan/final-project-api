const express = require("express");

const postsController = require("../controllers/post");
const router = express.Router();

// router.get("/users/:userId/posts", userController.getUser);
router.post("/users/:userId/posts", postsController.createPost);
router.get("/users/:userId/posts", postsController.getPosts);
router.get("/posts", postsController.getAllPosts);
router.get("/post-translate", postsController.getTranslatedPost);
router.get("/post-audio", postsController.getAudioFromPost);

module.exports = router;