import Redis from "ioredis";

const host = process.env.NEXT_PUBLIC_REDIS_HOST!;
const password = process.env.NEXT_PUBLIC_REDIS_PASSWORD;
// const port = 11162;
const port = 17303;

const handleRedisError = (error: Error) => {
  if (error.name === "ECONNRESET") {
    console.log("Connection to Redis Session Store timed out.");
  } else if (error.name === "ECONNREFUSED") {
    console.log("Connection to Redis Session Store refused!");
  } else console.log(error);
};

async function connectToRedis() {
  try {
    const redisClient = new Redis({
      host,
      port,
      password,
      lazyConnect: true,
      connectTimeout: 5000,

      maxRetriesPerRequest: null,
      retryStrategy(times) {
        console.log("retrying", times);
      },

      keepAlive: 1_000,
      reconnectOnError: (err) => {
        console.log("THER WAS SOME ERROR IN RECONNECTING", err.message);

        const targetError = ["ETIMEDOUT", "ECONNRESET"];
        if (targetError.includes(err.message)) {
          return 1;
        }

        return 2;
      },
    });

    // Error handling
    redisClient.on("error", handleRedisError);

    redisClient.on("reconnecting", () => {
      if (redisClient.status === "reconnecting")
        console.log("Reconnecting to Redis Session Store...");
      else console.log("Error reconnecting to Redis Session Store.");
    });

    redisClient.on("close", (err: Error) => {
      if (!err) console.log("Connected to Redis Session Store!");
    });

    redisClient.on("disconnect", () => {
      console.log("Redis Session Store connection closed.");
    });

    return redisClient;
  } catch (e) {
    console.log("redis connection error", e);
  }
}

export default connectToRedis;
