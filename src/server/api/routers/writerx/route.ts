import { db } from "~/server/db";
import { z } from "zod";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import { v4 as UUIDv4 } from "uuid";
import { createTRPCRouter, privateProcedure } from "../../trpc";

const newContent = {
    "type": "doc",
    "content": [
        {
            "type": "heading",
            "attrs": {
                "level": 1,
                "textAlign": "left"
            },
            "content": [
                {
                    "type": "text",
                    "text": "Hello World"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": "left"
            },
            "content": [
                {
                    "type": "text",
                    "text": "This is a "
                },
                {
                    "type": "text",
                    "text": "bold",
                    "marks": [
                        {
                            "type": "bold"
                        }
                    ]
                },
                {
                    "type": "text",
                    "text": " and "
                },
                {
                    "type": "text",
                    "text": "italic",
                    "marks": [
                        {
                            "type": "italic"
                        }
                    ]
                },
                {
                    "type": "text",
                    "text": " text."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": "left"
            }
        },
        {
            "type": "bulletList",
            "content": [
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "indent": 0,
                                "textAlign": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "List item 1"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "indent": 0,
                                "textAlign": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "List item 2"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "indent": 0,
                                "textAlign": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Nested item"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": "left"
            }
        },
        {
            "type": "orderedList",
            "content": [
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "indent": 0,
                                "textAlign": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Ordered item 1"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "indent": 0,
                                "textAlign": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Ordered item 2"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": "left"
            }
        },
        {
            "type": "blockquote",
            "content": [
                {
                    "type": "paragraph",
                    "attrs": {
                        "textAlign": "left"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "This is a blockquote"
                        }
                    ]
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": "left"
            }
        },
        {
            "type": "codeBlock",
            "attrs": {
                "language": null,
                "textAlign": "left"
            },
            "content": [
                {
                    "type": "text",
                    "text": "  const code = \"example\";"
                }
            ]
        }
    ]
}


export const writerxRouter = createTRPCRouter({
    newCreateDocument: privateProcedure
    .input(z.object({ workspaceId: z.string(), payload: z.string(), title: z.string(), content: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
        const { workspaceId, payload, title } = input;
        try {


            const getId = UUIDv4();
            const response = await axios.post(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${getId}?format=json`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                }
            );


            // If successful, return the document name/id
            const newDoc = await db.document.create({
                data: {
                    title: title,
                    userId: ctx.userId,
                    docId: getId,
                    organizationId: workspaceId,
                    access: "WRITE",
                    thumbnailImageUrl: "/images/pre-thumb.png",
                    role: "OWNER",
                    content: input.content || "",
                    redirectType: "General",
                    createdBy: ctx.userId
                }
            })



            return newDoc;

        } catch (error) {
            console.log(error);

            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to create document',
                });
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    createDocument: privateProcedure
    .input(z.object({ workspaceId: z.string(), content: z.string().optional(), title: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
        const { workspaceId, title, content } = input;
        console.log("input---------------------------------->", input);
        
        try {
            const getId = UUIDv4();
            // const response = await axios.post(
            //     `${process.env.TIPTAP_BASE_URL}/api/documents/${getId}?format=json`,
            //     newContent,
            //     {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `${process.env.TIPTAP_JWT_SECRET}`,
            //         },
            //     }
            // );
            // console.log("res----------------------------------->", response);
            
            // If successful, return the document name/id
            const newDoc = await db.document.create({
                data: {
                    title: title || "untitled",
                    userId: ctx.userId,
                    docId: getId,
                    organizationId: workspaceId,
                    access: "WRITE",
                    role: "OWNER",
                    thumbnailImageUrl: "/images/pre-thumb.png",
                    content: content || "",
                    createdBy: ctx.userId,
                    redirectType: "General"
                }
            })

            return newDoc;

        } catch (error) {
            console.log(error);

            if (axios.isAxiosError(error)) {
                console.log("errror1------------->", error);
                
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to create document',
                });
            }
            console.log("error ----2----->", error);
            
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    getAllDocs: privateProcedure
    .input(
        z.object({
            workspaceId: z.string(),
        }),
    )
    .query(async ({ input, ctx }) => {
        const { workspaceId } = input;
        const docs = await db.document.findMany({
            where: {    
                userId: ctx.userId,
                spaceId: workspaceId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return docs || [];
    }),

    getSingleDoc: privateProcedure
    .input(
        z.object({
            id: z.string(),
            spaceId: z.string(),
        }),
    )
    .query(async ({ input, ctx }) => {
        const { id, spaceId } = input;
        const doc = await db.document.findFirst({
            where: {
                id: id,
                // organizationId: spaceId
            },
        });
        return doc;
    }),
    changeDocTitle: privateProcedure
    .input(
        z.object({
            docId: z.string(),
            title: z.string(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        const { docId, title } = input;
        const doc = await db.document.update({
            where: {
                id: docId,
                userId: ctx.userId,
            },
            data: {
                title: title,
            }
        });
        return doc;
    }),
    createSocialDocument: privateProcedure
    .input(z.object({
        title: z.string(),
        content: z.string(),
        spaceId: z.string(),
        promptId: z.string(),
        thumbnailImageUrl: z.string(),
        images: z.array(z.string()),
        variations: z.array(z.string()),
        previewType: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
        try {
            const res = await db.document.create({
                data: {
                    title: input.title,
                    content: input.content,
                    organizationId: input.spaceId,
                    userId: ctx.userId,
                    promptId: input.promptId,
                    createdBy: ctx.userId,
                    thumbnailImageUrl: input.thumbnailImageUrl,
                    images: input.images,
                    redirectType: "Social",
                    variations: input.variations,
                    previewType: input.previewType || ""
                }
            })

            return res.id;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to create document',
                });
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    fetchSocialDocument: privateProcedure
    .input(z.object({ id: z.string(), spaceId: z.string() }))
    .query(async ({ input }) => {
        try {
            const response = db.document.findUnique({
                where: {
                    id: input.id,
                    organizationId: input.spaceId
                }
            })
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to fetch document',
                });
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    editSocialDocument: privateProcedure
    .input(z.object({ id: z.string(), content: z.string(), thumbnailImageUrl: z.string(), images: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
        try {
            const updatedImages = [
                input.thumbnailImageUrl,
                ...input.images.filter((url) => url !== input.thumbnailImageUrl),
            ];
            const response = await db.document.update({
                where: {
                    id: input.id
                },
                data: {
                    content: input.content,
                    thumbnailImageUrl: input.thumbnailImageUrl,
                    createdBy: ctx.userId,
                    userId: ctx.userId,
                    images: updatedImages,
                }
            })
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to fetch document',
                });
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    saveDocContent: privateProcedure
    .input(
        z.object({
            docId: z.string(),
            content: z.string(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        try {
            const { docId, content } = input;
            const findDoc = await db.document.findFirst({
                where: {
                    docId: docId,
                    userId: ctx.userId,
                }
            })

            if (!findDoc) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Document not found',
                });
            }

            const doc = await db.document.update({
                where: {
                    id: findDoc.id,
                    userId: ctx.userId,
                },
                data: {
                    content: content,
                }
            });
            return doc;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    handleTranscribe: privateProcedure
    .input(
        z.object({
            url: z.string(),
            type: z.string(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        try {

            const { url } = input;

            console.log('Transcribing URL:', url);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/web-url-scrape`,
                {
                    url: [url],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Transcription error:', error.message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    handleTranscribeFile: privateProcedure
    .input(
        z.object({
            url: z.string(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
        try {

            console.log(input)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/handle-transcription`,
                {
                    url: input.url,
                    type: 'mux',
                    languagecode: 'en'
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Transcription error:', error.message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    deleteDocument: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
        try {
            // find the document
            const doc = await db.document.findUnique({
                where: {
                    id: input.id,
                    createdBy: ctx.userId
                }
            })

            // delete doc on tiptap cloud
            if (doc?.redirectType === "General" && doc?.docId) {
                console.log("deleting from cloud!")
                await axios.delete(
                    `${process.env.TIPTAP_BASE_URL}/api/documents/${doc.docId}`,
                    {
                        headers: {
                            Authorization: `${process.env.TIPTAP_JWT_SECRET}`,
                        },
                    }
                );
            }
            const response = await db.document.delete({
                where: {
                    id: input.id,
                    createdBy: ctx.userId
                }
            })
            return response.id;
        } catch (error: any) {
            console.log(error.message);
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to delete document',
                });
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    updateThumbnail: privateProcedure
    .input(
        z.object({
            docId: z.string(),
            image: z.string(),
        })
    )
    .mutation(async ({ input, ctx }) => {
        const { docId, image } = input;

        try {

            const findDoc = await db.document.findFirst({
                where: {
                    docId: docId,
                    // userId: ctx.userId,
                },
            });

            if (!findDoc) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Document not found',
                });
            }

            // Update the document's thumbnail URL
            await db.document.update({
                where: { id: findDoc.id, userId: findDoc.userId },
                data: { thumbnailImageUrl: image },
            });

            return image;
        } catch (error) {
            console.error('Error updating thumbnail:', error);
            throw new Error('Failed to update thumbnail');
        }
    }),
})
