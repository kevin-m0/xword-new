import { z } from "zod";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../../trpc";

const defaultContent = {
    type: "doc",
    content: [
        {
            type: "heading",
            attrs: { level: 1 },
            content: [{ text: "My Heading", type: "text" }]
        },
        {
            type: "bulletList",
            content: [
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            attrs: { indent: 0, textAlign: "left" },
                            content: [{ text: "First item", type: "text" }]
                        }
                    ]
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            attrs: { indent: 0, textAlign: "left" },
                            content: [{ text: "Second item", type: "text" }]
                        }
                    ]
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            attrs: { indent: 0, textAlign: "left" },
                            content: [{ text: "Third item", type: "text" }]
                        }
                    ]
                }
            ]
        },
        {
            type: "paragraph",
            attrs: { indent: 0, textAlign: "left" },
            content: [{ text: "This is a paragraph of text.", type: "text" }]
        }
    ]
};

export const editorRouter = createTRPCRouter({
 // Create a new document with a default table structure.
    createDocument: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
        try {
            const response = await axios.post(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${input.name}?format=json`,
                defaultContent,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                }
            );

            // If successful, return the document name/id
            return {
                id: input.name,
                message: 'Document created successfully'
            };
        } catch (error) {
            // Detailed error logging and throwing
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

    /**
 * Fetch a single document by its ID.
 */
fetchDocument: privateProcedure
.input(z.object({ id: z.string() }))
.query(async ({ input }) => {
    try {
        const response = await axios.get(
            `${process.env.TIPTAP_BASE_URL}/api/documents/${input.id}`,
            {
                headers: {
                    Authorization: `${process.env.TIPTAP_JWT_SECRET}`,
                },
            }
        );
        return response.data;
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

/**
 * Fetch all documents.
 */
fetchAllDocuments: privateProcedure.query(async () => {
    try {
        const response = await axios.get(`${process.env.TIPTAP_BASE_URL}/api/documents`, {
            headers: {
                Authorization: `${process.env.TIPTAP_JWT_SECRET}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.response?.data?.message || 'Failed to fetch documents',
            });
        }
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Unexpected error occurred',
        });
    }
}),

/**
 * Delete a document by its ID.
 */
deleteDocument: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
        try {
            const response = await axios.delete(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${input.id}`,
                {
                    headers: {
                        Authorization: `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
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

    updateDocument: privateProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {

        const content = input.content;

        try {
            const response = await axios.patch(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${input.id}?format=json`,
                content,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                }
            );

            return {
                id: input.id,
                message: 'Document updated successfully'
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to update document',
                });
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    fetchRealtimeDoc: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
        try {
            const response = await axios.get(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${input.id}?format=yjs`,
                {
                    headers: {
                        Authorization: `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                }
            );
            return response.data;
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

    updateRealtimeDoc: privateProcedure
    .input(z.object({ id: z.string(), content: z.any() }))
    .mutation(async ({ input }) => {

        const content = input.content;

        try {
            const response = await axios.patch(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${input.id}?format=yjs`,
                content,
                {
                    headers: {
                        'Authorization': `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                }
            );

            return {
                id: input.id,
                message: 'Document updated successfully'
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to update document',
                });
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            });
        }
    }),
    createVersion: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
        try {
            const response = await axios.post(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${input.id}/versions`,
                {},
                {
                    headers: {
                        Authorization: `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to create version',
                });
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            })
        }
    }),
    getAllVersions: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
        try {
            const response = await axios.get(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${input.id}/versions`,
                {
                    headers: {
                        Authorization: `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to fetch versions',
                });
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            })
        }
    }),
    deleteVersion: privateProcedure
    .input(z.object({ id: z.string(), versionId: z.number() }))
    .mutation(async ({ input }) => {
        try {
            const response = await axios.delete(
                `${process.env.TIPTAP_BASE_URL}/api/documents/${input.id}/versions/${input.versionId}`,
                {
                    headers: {
                        Authorization: `${process.env.TIPTAP_JWT_SECRET}`,
                    },
                });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.response?.data?.message || 'Failed to delete version',
                });
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unexpected error occurred',
            })
        }
    }),

});