import * as z from "zod"

export const purposeFormSchema = z.object({
    documentName: z.string().min(1, "Document name is required"),
    folder: z.string().min(1, "Please select a folder"),
    goal: z.string().min(1, "Please select a goal"),
    brandVoice: z.string().min(1, "Please select a brand voice"),
    targetAudience: z.string().min(1, "Target audience is required"),
    postLength: z.string().min(1, "Please select post length"),
    keywords: z.array(z.string()).min(1, "At least one keyword is required"),
    includeImage: z.boolean().default(false),
    materialSource: z.string().min(1, "Please select a material source"),
    callToAction: z.string().optional(),
    authorPersona: z.string().optional(),
    productDescription: z.string().optional(),
    termsToAvoid: z.string().optional(),
    additionalInfo: z.string().optional(),
    language: z.string().default("en")
})

export const titleFormSchema = z.object({
    selectedTitle: z.string().min(1, "Please select a title"),
    customTitle: z.string().optional(),
})

export const outlineFormSchema = z.object({
    targetAudience: z.string().min(1, "Target audience is required"),
    introduction: z.string().min(50, "Introduction should be at least 50 characters"),
    outline: z.string().min(50, "Outline should be at least 50 characters"),
})

export type PurposeFormValues = z.infer<typeof purposeFormSchema>
export type TitleFormValues = z.infer<typeof titleFormSchema>
export type OutlineFormValues = z.infer<typeof outlineFormSchema> 