const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const Message = require("../models/message.model");

const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // =========================
  // Socket Authentication
  // =========================
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

  // =========================
  // Connection Established
  // =========================
  io.on("connection", (socket) => {
    console.log(
      `User Connected: ${socket.userId}`
    );

    // Store Online User
    onlineUsers.set(
      socket.userId,
      socket.id
    );

    console.log("Online Users:");
    console.log(onlineUsers);

    // =========================
    // Private Messaging
    // =========================
    socket.on(
      "private_message",
      async (data) => {
        try {
          const { receiverId, content } =
            data;

          // Save Message To DB
          const message =
            await Message.create({
              senderId: socket.userId,
              receiverId,
              content,
            });

          // Find Receiver Socket
          const receiverSocketId =
            onlineUsers.get(receiverId);

          // Send Message If Receiver Online
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

    // =========================
    // Typing Indicator
    // =========================
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

    // =========================
    // Stop Typing
    // =========================
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

    // =========================
    // Disconnect
    // =========================
    socket.on("disconnect", () => {
      console.log(
        `User Disconnected: ${socket.userId}`
      );

      onlineUsers.delete(socket.userId);

      console.log("Online Users:");
      console.log(onlineUsers);
    });
  });
};

module.exports = initializeSocket;