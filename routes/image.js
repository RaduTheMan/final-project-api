const express = require("express");

const imageController = require("../controllers/image");
const router = express.Router();

router.post("/images/:userId", imageController.uploadImage);

module.exports = router;