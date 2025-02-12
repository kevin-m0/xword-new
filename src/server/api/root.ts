import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { llmRouter } from "./routers/llm/route";
import { pathfixRouter } from "./routers/pathfix/route";
import { awsRouter } from "./routers/aws/route";
import { audioRouter } from "./routers/audio/route";
import { chatSonicRouter } from "./routers/chatsonic/route";
import { audioProjectsRouter } from "./routers/audio-projects/route";
import { storyboardRouter } from "./routers/storyboard/route";
import { videoProjectsRouter } from "./routers/video-projects/route";
import { writerxRouter } from "./routers/writerx/route";
import { userRouter } from "./routers/user/route";
import { documentRouter } from "./routers/document/route";
import { workspaceRouter } from "./routers/workspace/route";
import { editorRouter } from "./routers/editor/route";
import { flowRouter } from "./routers/flow/route";
import { imageRouter } from "./routers/image/route";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  llm: llmRouter,
  pathfix: pathfixRouter,
  aws: awsRouter,
  audio: audioRouter,
  chat: chatSonicRouter,
  audioProject: audioProjectsRouter,
  storyboard: storyboardRouter,
  videoProject: videoProjectsRouter,
  writerx: writerxRouter,
  user: userRouter,
  document: documentRouter,
  workspace: workspaceRouter,
  editor: editorRouter,
  flow: flowRouter,
  image: imageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
