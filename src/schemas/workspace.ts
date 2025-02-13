import { z } from "zod";

export const workspaceNameSchema = z.object({
    workspaceName: z
        .string()
        .min(3, "Workspace name must be at least 3 characters")
        .max(50, "Workspace name cannot exceed 50 characters")
        .regex(/^[a-zA-Z0-9\s'-]*$/, "Only letters, numbers, spaces, hyphens and apostrophes are allowed")
        .trim(),
});

