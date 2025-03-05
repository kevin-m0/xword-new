import { S3Client } from "@aws-sdk/client-s3";
 
const s3 = new S3Client({
    region: process.env.DIGITALOCEAN_SPACES_REGION,
    endpoint: process.env.DIGITALOCEAN_SPACES_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.DIGITALOCEAN_SPACES_ACCESS_KEY_ID!,
        secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET_ACCESS_KEY!,
    },
});
 
export default s3;