const express = require("express");

const protect = require("../middlewares/auth.middleware");

const {
  getMessages,
} = require("../controllers/message.controller");

const router = express.Router();

router.get("/:userId", protect, getMessages);

module.exports = router;