import { z } from "zod";
import { createChatSchema } from "./schema";
import { MessageSchema } from "./schema";

export type SendMessageType = z.infer<typeof MessageSchema>;
export type CreateChatType = z.infer<typeof createChatSchema>;
