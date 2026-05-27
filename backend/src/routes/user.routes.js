const express = require("express");

const router = express.Router();

const {
  getUsers,
  getConversations,
} = require(
  "../controllers/user.controller"
);

const protectRoute = require(
  "../middlewares/protectRoute"
);

// =========================================
// GET USERS
// =========================================
router.get(
  "/",
  protectRoute,
  getUsers
);

// =========================================
// GET CONVERSATIONS
// =========================================
router.get(
  "/conversations",
  protectRoute,
  getConversations
);

module.exports = router;