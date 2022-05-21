const express = require("express");

const userController = require("../controllers/user");
const router = express.Router();

router.get("/users/:userId", userController.getUser);
router.post("/users/:userId", userController.createUser);


module.exports = router;