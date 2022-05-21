const express = require("express");

const imageController = require("../controllers/image");
const router = express.Router();

router.post("/images", imageController.uploadImage);

module.exports = router;