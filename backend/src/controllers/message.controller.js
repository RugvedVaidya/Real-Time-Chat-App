const Message = require("../models/message.model");

const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          senderId: currentUserId,
          receiverId: otherUserId,
        },
        {
          senderId: otherUserId,
          receiverId: currentUserId,
        },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getMessages,
};