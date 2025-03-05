import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
 
import s3 from "~/lib/s3-client";
 
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
 
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
 
export async function POST(req: Request) {
    try {
        // Parse the incoming FormData
        const Bucket = process.env.DIGITALOCEAN_SPACES_BUCKET_NAME!;
        const Region = process.env.DIGITALOCEAN_SPACES_REGION!;
        const formData = await req.formData();
 
        console.log("formData: ", formData);
        const fileData = formData.get("file") as File; // File object
        const fileName = formData.get("fileName") as string; // Desired file name
        const contentType = formData.get("ContentType") as string; // MIME type
 
        const key = `uploads/${fileName}`;
 
        if (!fileData || !fileName || !contentType) {
            throw new Error("Missing required form data fields");
        }
 
        // Read binary data from the file
        const fileReader = fileData.stream().getReader();
        let fileDataU8 = new Uint8Array();
 
        while (true) {
            const { done, value } = await fileReader.read();
            if (done) break;
 
            // Concatenate binary data
            const temp = new Uint8Array(fileDataU8.length + value.length);
            temp.set(fileDataU8, 0);
            temp.set(value, fileDataU8.length);
            fileDataU8 = temp;
        }
 
        // Convert Uint8Array to a Buffer for AWS SDK
        const fileBinary = Buffer.from(fileDataU8);
 
        // Prepare the S3 upload command
        const command = new PutObjectCommand({
            Bucket,
            Key: key,
            Body: fileBinary,
            ContentType: contentType,
            ACL: "public-read", // Optional: Allows public access
        });
 
        // Upload the file to S3
        const response = await s3.send(command);
 
        if (response.$metadata.httpStatusCode === 200) {
            const fileUrl = `https://${Bucket}.${Region}.digitaloceanspaces.com/${key}`;
            return NextResponse.json(
                { status: "ok", message: "File uploaded", url: fileUrl },
                { status: 200 },
            );
        }
 
        throw new Error("File upload failed");
    } catch (error) {
        console.error("File upload error:", error);
        return NextResponse.json(
            { status: "error", message: "File upload failed" },
            { status: 500 },
        );
    }
}