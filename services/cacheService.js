const { getRedisClient } = require("../config/redis");

const DASHBOARD_CACHE_PREFIX = "dashboard";
const DASHBOARD_CACHE_TTL_SECONDS = 5 * 60;

const getDashboardCacheKey = (userId) => {
  return `${DASHBOARD_CACHE_PREFIX}:${userId}`;
};

const getDashboardCache = async (userId) => {
  const client = getRedisClient();

  if (!client?.isOpen) {
    return null;
  }

  const cachedValue = await client.get(getDashboardCacheKey(userId));
  return cachedValue ? JSON.parse(cachedValue) : null;
};

const setDashboardCache = async (userId, payload) => {
  const client = getRedisClient();

  if (!client?.isOpen) {
    return;
  }

  await client.set(getDashboardCacheKey(userId), JSON.stringify(payload), {
    EX: DASHBOARD_CACHE_TTL_SECONDS
  });
};

const invalidateDashboardCache = async () => {
  const client = getRedisClient();

  if (!client?.isOpen) {
    return;
  }

  const keys = await client.keys(`${DASHBOARD_CACHE_PREFIX}:*`);

  if (keys.length > 0) {
    await client.del(keys);
  }
};

module.exports = {
  DASHBOARD_CACHE_TTL_SECONDS,
  getDashboardCacheKey,
  getDashboardCache,
  setDashboardCache,
  invalidateDashboardCache
};
