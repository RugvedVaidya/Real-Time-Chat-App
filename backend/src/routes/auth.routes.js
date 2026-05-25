const express = require("express");

const protect = require("../middlewares/auth.middleware");

const {
  register,
 login,
  refreshAccessToken,
  logout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refreshAccessToken);

router.post("/logout", protect, logout);

module.exports = router;