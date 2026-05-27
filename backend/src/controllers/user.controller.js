import User from "../models/user.model.js";

import Message from "../models/message.model.js";

// =========================================
// GET ALL USERS
// =========================================
export const getUsers =
  async (req, res) => {
    try {
      const users =
        await User.find({
          _id: {
            $ne: req.user._id,
          },
        }).select("-password");

      res.status(200).json(
        users
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Error fetching users",
      });
    }
  };

// =========================================
// GET CONVERSATIONS
// =========================================
export const getConversations =
  async (req, res) => {
    try {
      const currentUserId =
        req.user._id;

      const users =
        await User.find({
          _id: {
            $ne: currentUserId,
          },
        }).select("-password");

      const conversations =
        await Promise.all(
          users.map(async (user) => {
            const lastMessage =
              await Message.findOne({
                $or: [
                  {
                    senderId:
                      currentUserId,
                    receiverId:
                      user._id,
                  },
                  {
                    senderId:
                      user._id,
                    receiverId:
                      currentUserId,
                  },
                ],
              }).sort({
                createdAt: -1,
              });

            return {
              ...user.toObject(),

              lastMessage,

              updatedAt:
                lastMessage?.createdAt ||
                user.createdAt,

              unreadCount: 0,
            };
          })
        );

      conversations.sort(
        (a, b) =>
          new Date(
            b.updatedAt
          ) -
          new Date(a.updatedAt)
      );

      res.status(200).json(
        conversations
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Error fetching conversations",
      });
    }
  };