const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

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

    onlineUsers.set(socket.userId, socket.id);

    console.log(onlineUsers);

    socket.on("disconnect", () => {
      console.log(
        `User Disconnected: ${socket.userId}`
      );

      onlineUsers.delete(socket.userId);
    });
  });
};

module.exports = initializeSocket;