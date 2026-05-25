require("dotenv").config();

const http = require("http");

const app = require("./src/app");

const connectDB = require("./src/config/db");

const {
  connectRedis,
} = require("./src/config/redis");

const initializeSocket = require(
  "./src/sockets/socket"
);

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// ======================================
// Start Server
// ======================================
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Connect Redis
    await connectRedis();

    // Start Server
    server.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server Startup Error:",
      error
    );
  }
};

startServer();