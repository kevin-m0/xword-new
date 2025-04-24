// "use server";
// // @ts-ignore
// import cuuid from "cuuid";
// import { OpenMeter } from "@openmeter/sdk";
// import { Job, Queue, Worker } from "bullmq";
// import connectToRedis from "./redis";
// import { TOKEN_QUEUE } from "~/lib/constant/constants";

// let redisClient: any;

// export async function initializeQueueAndWorker() {
//   try {
//     if (!redisClient) {
//       redisClient = await connectToRedis();
//       redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
//       await redisClient.connect();
//     }

//     const tokenQueue = new Queue(TOKEN_QUEUE, {
//       connection: redisClient,
//     });

//     await initializeWorker();

//     return { tokenQueue, redisClient };
//   } catch (error) {
//     console.error("Error initializing BullMQ queue and worker", error);
//   }
// }

// const openmeter = new OpenMeter({
//   baseUrl: process.env.OPEN_METER_BASE_URL!,
//   apiKey: process.env.OPEN_METER_SECRET!,
// });

// type TokenData = {
//   userId: string;
//   tokens: number;
// };

// export const addTokenToQueue = async (data: TokenData) => {
//   const token = await initializeQueueAndWorker();
//   const tokenQueue = token?.tokenQueue;

//   if (!tokenQueue) return;
//   console.log("Adding Tokens to queue", data);
//   await tokenQueue.add("createTokens", data);
// };

// const initializeWorker = async () => {
//   try {
//     if (!redisClient) {
//       redisClient = await connectToRedis();
//       redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
//       await redisClient.connect();
//     }

//     const worker = new Worker(
//       TOKEN_QUEUE,
//       async (job: Job) => {
//         const { userId, tokens } = job.data;

//         await openmeter.events.ingest({
//           id: cuuid(),
//           source: "xWord",
//           type: "tokens",
//           time: new Date(),
//           subject: userId,
//           data: {
//             tokens,
//             model: "gpt-4",
//           },
//         });
//       },
//       {
//         connection: redisClient,
//       }
//     ) ;

//     worker.on('error', (err: any) => console.error('Worker Error', err));
//   } catch (e) {
//     console.log("ERROR EXECUTING WORKER JOB", e);
//   }
// };
