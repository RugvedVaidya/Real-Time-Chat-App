const { pubClient } = require(
  "../config/redis"
);

const rateLimiter = async (
  key,
  limit,
  windowSeconds
) => {
  const current =
    await pubClient.incr(key);

  if (current === 1) {
    await pubClient.expire(
      key,
      windowSeconds
    );
  }

  return current <= limit;
};

module.exports = rateLimiter;