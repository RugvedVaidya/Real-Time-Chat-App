const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const Message = require("../models/message.model");
const User = require("../models/user.model");

const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // ====================================
  // Socket Authentication Middleware
  // ====================================
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.query.token;

      if (!token) {
        return next(
          new Error("Authentication error")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
      );

      socket.userId = decoded.userId;

      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // ====================================
  // Connection Established
  // ====================================
  io.on("connection", async (socket) => {
    console.log(
      `User Connected: ${socket.userId}`
    );

    // Store Online User
    onlineUsers.set(
      socket.userId,
      socket.id
    );

    // Update User Status
    await User.findByIdAndUpdate(
      socket.userId,
      {
        status: "online",
        lastSeen: null,
      }
    );

    // Broadcast Online Status
    socket.broadcast.emit(
      "user_online",
      {
        userId: socket.userId,
      }
    );

    console.log("Online Users:");
    console.log(onlineUsers);

    // ====================================
    // Private Messaging
    // ====================================
    socket.on(
      "private_message",
      async (data) => {
        try {
          const { receiverId, content } =
            data;

          // Save Message
          const message =
            await Message.create({
              senderId: socket.userId,
              receiverId,
              content,
            });

          // Find Receiver Socket
          const receiverSocketId =
            onlineUsers.get(receiverId);

          // Send Message If Online
          if (receiverSocketId) {
            io.to(receiverSocketId).emit(
              "receive_message",
              {
                senderId: socket.userId,
                receiverId,
                content,
                createdAt:
                  message.createdAt,
              }
            );
          }

          console.log("Message Sent");
        } catch (error) {
          console.error(
            "Message Error:",
            error
          );
        }
      }
    );

    // ====================================
    // Typing Indicator
    // ====================================
    socket.on("typing", (data) => {
      try {
        const { receiverId } = data;

        const receiverSocketId =
          onlineUsers.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "user_typing",
            {
              senderId: socket.userId,
            }
          );
        }
      } catch (error) {
        console.error(
          "Typing Error:",
          error
        );
      }
    });

    // ====================================
    // Stop Typing
    // ====================================
    socket.on(
      "stop_typing",
      (data) => {
        try {
          const { receiverId } = data;

          const receiverSocketId =
            onlineUsers.get(receiverId);

          if (receiverSocketId) {
            io.to(receiverSocketId).emit(
              "user_stop_typing",
              {
                senderId: socket.userId,
              }
            );
          }
        } catch (error) {
          console.error(
            "Stop Typing Error:",
            error
          );
        }
      }
    );

    // ====================================
    // Disconnect
    // ====================================
    socket.on(
      "disconnect",
      async () => {
        console.log(
          `User Disconnected: ${socket.userId}`
        );

        // Remove From Online Users
        onlineUsers.delete(
          socket.userId
        );

        // Update User Status
        await User.findByIdAndUpdate(
          socket.userId,
          {
            status: "offline",
            lastSeen: new Date(),
          }
        );

        // Broadcast Offline Status
        socket.broadcast.emit(
          "user_offline",
          {
            userId: socket.userId,
          }
        );

        console.log("Online Users:");
        console.log(onlineUsers);
      }
    );
  });
};

module.exports = initializeSocket;