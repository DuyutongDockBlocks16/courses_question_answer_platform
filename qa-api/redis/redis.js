import { redisConnect } from "../deps.js";

const redisCache = await redisConnect({
  hostname: "redis-cache",
  port: 6379,
});

// const redisGrading = await redisConnect({
//     hostname: "redis-grading",
//     port: 6379,
// });

// export {redisCache, redisGrading}

export {redisCache}