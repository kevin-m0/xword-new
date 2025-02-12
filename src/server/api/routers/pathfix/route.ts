import axios from "axios"; //ideally should use the axios instance from the utils
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, privateProcedure } from "../../trpc";

export const MediaSchema = z.object({
  type: z.enum(["audio", "video", "image", "doc"]),
  source: z.enum(["url", "file", "key"]),
  content: z.union([z.string(), z.instanceof(File)]), // Accepts either a string (URL) or a File object
});

// Define the router for interacting with the Pathfix API
export const pathfixRouter = createTRPCRouter({
  disconnectUser: privateProcedure
    .input(
      z.object({
        provider: z.string(),
        user_id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { provider, user_id } = input;

        // Pathfix API endpoint with necessary query parameters
        const url = `https://labs.pathfix.com/api/connection/${provider}`;

        // Prepare the request parameters
        const params = {
          user_id,
          public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
          private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
        };

        // Make a GET request to the Pathfix API
        const res = await axios.delete(url, { params });

        // Return the response data from Pathfix
        return res.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to disconnect user: ${error.message}`,
        });
      }
    }),
  fetchTwitterUserDetails: privateProcedure
    .input(
      z.object({
        appUserId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { appUserId } = input;

        // Pathfix API endpoint with necessary query parameters
        const url = `https://labs.pathfix.com/oauth/method/twitteroauth2/call`;

        // Prepare the request parameters
        const params = {
          user_id: appUserId,
          public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
          private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
        };

        const body = {
          url: "https://api.twitter.com/2/users/me",
          method: "GET",
        };

        // Make a GET request to the Pathfix API
        const res = await axios.post(url, body, { params });

        // Return the response data from Pathfix
        return res.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch Instagram user: ${error.message}`,
        });
      }
    }),
  fetchLinkedInUserDetails: privateProcedure
    .input(
      z.object({
        appUserId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { appUserId } = input;

        // Pathfix API endpoint with necessary query parameters
        const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

        // Prepare the request parameters
        const params = {
          user_id: appUserId,
          public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
          private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
        };

        const body = {
          url: "https://api.linkedin.com/v2/userinfo",
          method: "GET",
          headers: {
            "X-Restli-Protocol-Version": "2.0.0",
          },
        };

        // Make a POST request to the Pathfix API
        const res = await axios.post(url, body, { params });

        return res.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch LinkedIn user: ${error.message}`,
        });
      }
    }),
  fetchFacebookUserDetails: privateProcedure
    .input(
      z.object({
        appUserId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { appUserId } = input;

        // Pathfix API endpoint with necessary query parameters
        const url = `https://labs.pathfix.com/oauth/method/facebook/call`;

        // Prepare the request parameters
        const params = {
          user_id: appUserId,
          public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
          private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
        };

        const body = {
          url: "https://graph.facebook.com/me?fields=id,first_name,last_name,email",
          method: "GET",
        };

        // Make a GET request to the Pathfix API
        const res = await axios.post(url, body, { params });

        // Return the response data from Pathfix
        return res.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch Instagram user: ${error.message}`,
        });
      }
    }),
  fetchYoutubeUserDetails: privateProcedure
    .input(
      z.object({
        appUserId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { appUserId } = input;

        // Pathfix API endpoint with necessary query parameters
        const url = `https://labs.pathfix.com/oauth/method/youtube/call`;

        // Prepare the request parameters
        const params = {
          user_id: appUserId,
          public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
          private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
        };

        const body = {
          url: "https://www.googleapis.com/youtube/v3/search",
          method: "GET",
          queryString: {
            part: "snippet",
            type: "video",
            forMine: true,
          },
        };

        // Make a GET request to the Pathfix API
        const res = await axios.post(url, body, { params });

        // Return the response data from Pathfix
        return res.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch Instagram user: ${error.message}`,
        });
      }
    }),
  fetchIgGraphUserDetails: privateProcedure
    .input(
      z.object({
        appUserId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { appUserId } = input;

        // Pathfix API endpoint with necessary query parameters
        const url = `https://labs.pathfix.com/oauth/method/iggraphapi/call`;

        // Prepare the request parameters
        const params = {
          user_id: appUserId,
          public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
          private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
        };

        const body = {
          url: "https://graph.facebook.com/me?fields=id,first_name,last_name,email",
          method: "GET",
        };

        // Make a GET request to the Pathfix API
        const res = await axios.post(url, body, { params });

        // Return the response data from Pathfix
        return res.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch Instagram user: ${error.message}`,
        });
      }
    }),
  postTwitterTweet: privateProcedure
    .input(
      z.object({
        text: z.string(),
        user_id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { text, user_id } = input;

        // Pathfix API endpoint with necessary query parameters
        const url = `https://labs.pathfix.com/oauth/method/twitteroauth2/call?user_id=${user_id}&public_key=${process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY}`;

        const payload = {
          url: "https://api.twitter.com/2/tweets",
          method: "POST",
          payload: {
            text: text,
          },
        };

        // Make a POST request to the Pathfix API
        const res = await axios.post(url, payload);

        // Return the response data from Pathfix
        return res.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to post Twitter tweet: ${error.message}`,
        });
      }
    }),
  postTextonLinkedIn: privateProcedure
    .input(
      z.object({
        text: z.string(),
        user_id: z.string(),
        linkedIn_id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { text, user_id, linkedIn_id } = input;

        // Pathfix API endpoint with necessary query parameters
        const url = `https://labs.pathfix.com/oauth/method/linkedin/call`;

        // Prepare the request parameters
        const params = {
          user_id: user_id,
          public_key: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
          private_key: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,
        };

        const body = {
          url: "https://api.linkedin.com/v2/ugcPosts",
          method: "POST",
          payload: {
            author: `urn:li:person:${linkedIn_id}`,
            lifecycleState: "PUBLISHED",
            specificContent: {
              "com.linkedin.ugc.ShareContent": {
                shareCommentary: {
                  text: text,
                },
                shareMediaCategory: "NONE",
              },
            },
            visibility: {
              "com.linkedin.ugc.MemberNetworkVisibility": "CONNECTIONS",
            },
          },
        };

        const res = await axios.post(url, body, { params });

        return res.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to post LinkedIn post: ${error.message}`,
        });
      }
    }),

  createPost: privateProcedure
    .input(
      z.object({
        title: z.string(),
        userId: z.string(),
        platform: z.enum([
          "twitter",
          "linkedin",
          "instagram",
          "youtube",
          "facebook",
        ]),
        content: z.string(),
        postType: z.string(),
        media: z
          .array(
            z.object({
              source: z.enum(["key", "url", "file"]),
              content: z.union([z.string(), z.instanceof(File)]),
              type: z.enum(["audio", "video", "image", "doc"]),
            }),
          )
          .optional(),
        scheduledAt: z.date(),
        status: z.enum(["draft", "scheduled", "posted", "failed"]),
        platformSpecific: z.any().optional(),
        workspaceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          title,
          userId,
          platform,
          content,
          postType,
          media,
          scheduledAt,
          status,
          platformSpecific,
          workspaceId,
        } = input;

        // Transform media for JSON compatibility
        const transformedMedia = media?.map((item) => {
          if (item.source === "file") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "File uploads must be handled separately.",
            });
          }

          // Ensure content is always a string for JSON compatibility
          return {
            source: item.source,
            content:
              typeof item.content === "string" ? item.content : undefined,
            type: item.type,
          };
        });

        // Create the new post
        const newPost = await db.post.create({
          data: {
            title,
            userId,
            platform,
            postType,
            content,
            media: transformedMedia || Prisma.JsonNull, // Ensure compatibility with InputJsonValue
            scheduledAt,
            status,
            platformSpecific: platformSpecific || Prisma.JsonNull, // Handle optional fields
            workspaceId,
          },
        });

        return newPost;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create post: ${error.message}`,
        });
      }
    }),

  updatePost: privateProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        platform: z
          .enum(["twitter", "instagram", "facebook", "linkedin", "youtube"])
          .optional(),
        content: z.string().optional(),
        postType: z.string().optional(),
        media: z.array(MediaSchema).optional(),
        scheduledAt: z.date().optional(),
        status: z.enum(["draft", "scheduled", "posted", "failed"]).optional(),
        platformSpecific: z.any().optional(),
        workspaceId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        // Verify post exists and user has permission to update it
        const existingPost = await db.post.findUnique({
          where: { id },
          select: { userId: true, workspaceId: true },
        });

        if (!existingPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        // Create update object only with provided fields
        const updateObject: any = {};

        if (updateData.title !== undefined)
          updateObject.title = updateData.title;
        if (updateData.platform !== undefined)
          updateObject.platform = updateData.platform;
        if (updateData.content !== undefined)
          updateObject.content = updateData.content;
        if (updateData.postType !== undefined)
          updateObject.postType = updateData.postType;
        if (updateData.media !== undefined)
          updateObject.media = updateData.media;
        if (updateData.scheduledAt !== undefined)
          updateObject.scheduledAt = updateData.scheduledAt;
        if (updateData.status !== undefined)
          updateObject.status = updateData.status;
        if (updateData.platformSpecific !== undefined)
          updateObject.platformSpecific = updateData.platformSpecific;
        if (updateData.workspaceId !== undefined)
          updateObject.workspaceId = updateData.workspaceId;

        // Add automatic updatedAt timestamp
        updateObject.updatedAt = new Date();

        // Update the post
        const updatedPost = await db.post.update({
          where: { id },
          data: updateObject,
        });
        return updatedPost;
      } catch (error: any) {
        // Handle specific error cases
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle Prisma-specific errors
        if (error.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Unique constraint violation",
          });
        }

        // Default error handling
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update post: ${error.message}`,
        });
      }
    }),

  deletePost: privateProcedure
    .input(
      z.object({
        postId: z.string(), // ID of the post to delete
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const userId = ctx.userId; // Get userId from the context (assumed to be set)

      try {
        // Verify the post exists and belongs to the user
        const post = await db.post.findUnique({
          where: { id: postId },
          select: { userId: true },
        });

        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found.",
          });
        }

        if (post.userId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this post.",
          });
        }

        // Delete the post
        await db.post.delete({
          where: { id: postId },
        });

        return { message: "Post deleted successfully." };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete post: ${error.message}`,
        });
      }
    }),

  getUserPosts: privateProcedure
    .input(
      z.object({
        userId: z.string(), // Accept userId as input to filter posts
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const { userId } = input;

        // Fetch posts created by the same user
        const posts = await db.post.findMany({
          where: {
            userId: userId, // Filter by userId
          },
        });

        return posts;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch user posts: ${error?.message}`,
        });
      }
    }),
});
