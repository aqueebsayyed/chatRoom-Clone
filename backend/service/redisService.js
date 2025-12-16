// services/redis.service.js
const { createClient } = require("redis");

const redis = createClient();
redis.connect();

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("Redis error", err));

module.exports = redis;