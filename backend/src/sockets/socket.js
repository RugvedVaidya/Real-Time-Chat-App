const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const { createAdapter } = require(
  "@socket.io/redis-adapter"
);

const {
  pubClient,
  subClient,
} = require("../config/redis");

const Message = require("../models/message.model");
const User = require("../models/user.model");

const getRoomId = require("../utils/getRoomId");

const rateLimiter = require(
  "../utils/rateLimiter"
);

const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // =========================================
  // Redis Adapter
  // =========================================
  io.adapter(
    createAdapter(
      pubClient,
      subClient
    )
  );

  // =========================================
  // Socket Authentication Middleware
  // =========================================
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

  // =========================================
  // Connection
  // =========================================
  io.on("connection", async (socket) => {
    console.log(
      `User Connected: ${socket.userId}`
    );

    // =========================================
    // Store Online User
    // =========================================
    onlineUsers.set(
      socket.userId,
      socket.id
    );

    // Broadcast Online Users
    io.emit(
      "online_users",
      Array.from(onlineUsers.keys())
    );

    // =========================================
    // Update User Status
    // =========================================
    await User.findByIdAndUpdate(
      socket.userId,
      {
        status: "online",
        lastSeen: null,
      }
    );

    // =========================================
    // Join Chat Room
    // =========================================
    socket.on("join_chat", (data) => {
      try {
        const { userId } = data;

        const roomId = getRoomId(
          socket.userId,
          userId
        );

        socket.join(roomId);

        console.log(
          `${socket.userId} joined room ${roomId}`
        );
      } catch (error) {
        console.error(
          "Join Room Error:",
          error
        );
      }
    });

    // =========================================
    // Private Messaging
    // =========================================
    socket.on(
      "private_message",
      async (data) => {
        try {
          const isAllowed =
            await rateLimiter(
              `messages:${socket.userId}`,
              5,
              10
            );

          if (!isAllowed) {
            return socket.emit(
              "rate_limit_exceeded",
              {
                message:
                  "Too many messages. Please slow down.",
              }
            );
          }

          const {
            receiverId,
            content,
          } = data;

          // Save Message
          const message =
            await Message.create({
              senderId: socket.userId,
              receiverId,
              content,
              status: "sent",
            });

          // Room ID
          const roomId = getRoomId(
            socket.userId,
            receiverId
          );

          // =========================================
          // Emit Message
          // =========================================
          io.to(roomId).emit(
            "receive_message",
            {
              _id: message._id,

              senderId:
                socket.userId,

              receiverId,

              content,

              status:
                "delivered",

              createdAt:
                message.createdAt,
            }
          );

          // =========================================
          // Update Delivered Status
          // =========================================
          await Message.findByIdAndUpdate(
            message._id,
            {
              status:
                "delivered",
            }
          );

          // =========================================
          // Emit Delivered Event
          // =========================================
          io.to(roomId).emit(
            "message_delivered",
            {
              messageId:
                message._id,

              status:
                "delivered",
            }
          );

          console.log(
            `Message sent in room ${roomId}`
          );
        } catch (error) {
          console.error(
            "Message Error:",
            error
          );
        }
      }
    );

    // =========================================
    // Typing Indicator
    // =========================================
    socket.on("typing", (data) => {
      try {
        const { receiverId } = data;

        const roomId = getRoomId(
          socket.userId,
          receiverId
        );

        socket.to(roomId).emit(
          "user_typing",
          {
            senderId:
              socket.userId,
          }
        );
      } catch (error) {
        console.error(
          "Typing Error:",
          error
        );
      }
    });

    // =========================================
    // Stop Typing
    // =========================================
    socket.on(
      "stop_typing",
      (data) => {
        try {
          const { receiverId } =
            data;

          const roomId = getRoomId(
            socket.userId,
            receiverId
          );

          socket.to(roomId).emit(
            "user_stop_typing",
            {
              senderId:
                socket.userId,
            }
          );
        } catch (error) {
          console.error(
            "Stop Typing Error:",
            error
          );
        }
      }
    );

    // =========================================
    // Message Seen
    // =========================================
    socket.on(
      "message_seen",
      async (data) => {
        try {
          const {
            messageId,
            senderId,
          } = data;

          // Update DB
          await Message.findByIdAndUpdate(
            messageId,
            {
              status: "seen",
            }
          );

          // Room ID
          const roomId = getRoomId(
            socket.userId,
            senderId
          );

          // Emit Seen Update
          io.to(roomId).emit(
            "message_seen_update",
            {
              messageId,

              status: "seen",
            }
          );

          console.log(
            `Message ${messageId} seen`
          );
        } catch (error) {
          console.error(
            "Seen Error:",
            error
          );
        }
      }
    );

    // =========================================
    // Disconnect
    // =========================================
    socket.on(
      "disconnect",
      async () => {
        console.log(
          `User Disconnected: ${socket.userId}`
        );

        // Remove User
        onlineUsers.delete(
          socket.userId
        );

        // Broadcast Online Users
        io.emit(
          "online_users",
          Array.from(
            onlineUsers.keys()
          )
        );

        // Update User Status
        await User.findByIdAndUpdate(
          socket.userId,
          {
            status: "offline",

            lastSeen:
              new Date(),
          }
        );

        console.log(
          "Online Users:",
          onlineUsers
        );
      }
    );
  });
};

module.exports = initializeSocket;