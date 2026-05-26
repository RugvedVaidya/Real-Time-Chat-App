const User = require("../models/user.model");

const getUsers = async (req, res) => {
  try {
    const currentUserId =
      req.user.userId;

    const users = await User.find({
      _id: {
        $ne: currentUserId,
      },
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getUsers,
};