import { appRouter } from "~/server/api/root";
import { createContextInner } from "~/server/api/trpc";

export const getServerClient = async () => {
    const ctx = await createContextInner(); // Get server context
    return appRouter.createCaller(ctx); // Pass context to tRPC
};
