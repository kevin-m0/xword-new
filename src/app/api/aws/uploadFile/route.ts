import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { client } from "~/lib/aws-sdk-config";

const Bucket = process.env.S3_BUCKET_NAME as string;
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const fileData = formData.get("file") as File;
        const fileName = formData.get("fileName") as string;
        const ContentType = formData.get("ContentType") as string;

        const fileReader = fileData.stream().getReader();
        let fileDataDataU8 = new Uint8Array();

        while (true) {
            const { done, value } = await fileReader.read();
            if (done) break;

            // Efficiently concatenate the new Uint8Array with the existing one
            let temp = new Uint8Array(fileDataDataU8.length + value.length);
            temp.set(fileDataDataU8, 0);
            temp.set(value, fileDataDataU8.length);
            fileDataDataU8 = temp;
        }

        //converting our Uint8Array to  a 'binary' buffer.
        const fileBinary: Buffer = Buffer.from(fileDataDataU8);

        const command = new PutObjectCommand({
            Bucket: Bucket,
            Key: fileName,
            Body: fileBinary,
            ContentType: ContentType,
            ACL: 'public-read',
        });

        const response = await client.send(command);
        if (response)
            return NextResponse.json(
                {
                    status: "ok",
                    message: "file uploaded ",
                },
                { status: 200 },
            );
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                error: "Unknown Internal server error",
            },
            { status: 500 },
        );
    }
}