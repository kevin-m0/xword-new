import { S3Client } from "@aws-sdk/client-s3";

export const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_FILE_UPLOAD_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_FILE_UPLOAD_SECRET_KEY as string,
  },
});
