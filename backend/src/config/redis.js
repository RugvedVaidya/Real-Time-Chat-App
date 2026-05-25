const { createClient } = require("redis");

const pubClient = createClient({
  url: "redis://localhost:6379",
});

const subClient = pubClient.duplicate();

const connectRedis = async () => {
  try {
    await pubClient.connect();
    await subClient.connect();

    console.log("Redis Connected");
  } catch (error) {
    console.error(
      "Redis Connection Error:",
      error
    );
  }
};

module.exports = {
  pubClient,
  subClient,
  connectRedis,
};