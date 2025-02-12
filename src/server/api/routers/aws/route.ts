import { z } from "zod";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "../../trpc";

const Bucket = process.env.S3_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_FILE_UPLOAD_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_FILE_UPLOAD_SECRET_KEY as string,
  },
});

export async function getFileInfo(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket,
      Key: key,
    });

    const headObject = await s3.send(command);
    const fileName = key.split("/").pop() || "Unknown";
    const fileExtension = fileName.split(".").pop() || "Unknown";
    const fileType = key.split("_")[0]; // document, image, or audio

    return {
      id: key,
      fileName,
      fileExtension,
      contentType: headObject.ContentType,
      size: headObject.ContentLength,
      type: fileType,
    };
  } catch (error) {
    console.error("Error fetching file info:", error);
    return null;
  }
}

export const awsRouter = createTRPCRouter({
  getObjectURL: privateProcedure
  .input(
    z.object({
      key: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const { key } = input;

    const command = new GetObjectCommand({ Bucket, Key: key });
    try {
      // const src = await getSignedUrl(s3, command);
      const src = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

      console.log("src: ", src);
      return src;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate download URL",
      });
    }
  }),

  getUploadUrl: privateProcedure
  .input(
    z.object({
      key: z.string(),
      contentType: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { key, contentType } = input;

    const command = new PutObjectCommand({
      Bucket,
      Key: key,
      ContentType: contentType,
    });

    try {
      const uploadUrl = await getSignedUrl(s3, command, {
        expiresIn: 3600,
      });

      return { uploadUrl };
    } catch (error) {
      console.error("S3 upload URL error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate upload URL",
      });
    }
  }),

  deleteObject: privateProcedure
  .input(
    z.object({
      key: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { key } = input;
    const command = new DeleteObjectCommand({ Bucket, Key: key });
    try {
      await s3.send(command);
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete file",
      });
    }
  }),

  getFileInfoProcedure: privateProcedure
  .input(z.object({ fileId: z.string() }))
  .query(async ({ input }) => {
    const fileInfo = await getFileInfo(input.fileId);
    if (!fileInfo) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "File information not found",
      });
    }
    return fileInfo;
  }),

  uploadBase64Image: privateProcedure
  .input(
    z.object({
      fileName: z.string(),
      base64Data: z.string(),
      contentType: z.string().default("image/png"),
    }),
  )
  .mutation(async ({ input }) => {
    const { fileName, base64Data, contentType } = input;
    try {
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

      const buffer = Buffer.from(cleanBase64, "base64");
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${fileName}`,
        Body: buffer,
        ContentType: contentType,
      });
      await s3.send(command);
      return `${fileName}`;
    } catch (error) {
      console.error("Error uploading image to S3:", error);
    }
  }),

  uploadBase64ImagePublic: privateProcedure
  .input(
    z.object({
      fileName: z.string(),
      base64Data: z.string(),
      contentType: z.string().default("image/png"),
    }),
  )
  .mutation(async ({ input }) => {
    const { fileName, base64Data, contentType } = input;
    try {
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

      const buffer = Buffer.from(cleanBase64, "base64");
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${fileName}`,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read"
      });
      await s3.send(command);
      return `${fileName}`;
    } catch (error) {
      console.error("Error uploading image to S3:", error);
    }
  }),

  getBatchObjectURLs: privateProcedure
  .input(
    z.object({
      keys: z.array(z.string()),
    }),
  )
  .query(async ({ input }) => {
    const { keys } = input;

    try {
      const urlPromises = keys.map(async (key) => {
        const command = new GetObjectCommand({ Bucket, Key: key });
        return getSignedUrl(s3, command);
      });

      const urls = await Promise.all(urlPromises);
      return urls;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate batch download URLs",
      });
    }
  }),

})
