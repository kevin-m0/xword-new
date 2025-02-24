import * as z from "zod"

export const remixTextSchema = z.object({
    content: z.string().min(1, "Please enter some content"),
    remixInstructions: z.string().min(1, "Please provide remix instructions"),
    length: z.enum(["short", "medium", "long"])
})

export const remixUploadSchema = z.object({
    remixInstructions: z.string().min(1, "Please provide remix instructions"),
    length: z.enum(["short", "medium", "long"])
})

export type RemixTextFormValues = z.infer<typeof remixTextSchema>
export type RemixUploadFormValues = z.infer<typeof remixUploadSchema> 