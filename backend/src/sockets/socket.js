const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error("Authentication error"));
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

  io.on("connection", (socket) => {
    console.log(
      `User Connected: ${socket.userId}`
    );

    // Store Online User
    onlineUsers.set(socket.userId, socket.id);

    console.log("Online Users:");
    console.log(onlineUsers);

    // Test Event
    socket.on("send_message", (data) => {
      console.log(data);

      io.emit("receive_message", data);
    });

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