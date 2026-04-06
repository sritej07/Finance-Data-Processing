const { createClient } = require("redis");

let redisClient;

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on("error", (error) => {
      console.error(`Redis error: ${error.message}`);
    });
  }

  return redisClient;
};

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.warn("REDIS_URL is not defined. Redis caching is disabled.");
    return null;
  }

  const client = getRedisClient();

  if (!client.isOpen) {
    await client.connect();
    console.log("Redis connected successfully.");
  }

  return client;
};

module.exports = {
  getRedisClient,
  connectRedis
};
