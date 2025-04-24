"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "~/lib/aws-sdk-config";
import { absoluteUrl } from "~/utils/utils";
import axios from "axios";

export const uploadFile = async (file: File, fileName: string) => {
  try {
    const url = "/api/aws/uploadFile";
    const fileType = file.type;
    const Bucket = process.env.S3_BUCKET_NAME as string;
    console.log("file------------>", file);

    const fileData = file
    const ContentType = fileType

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

    const fileBinary: Buffer = Buffer.from(fileDataDataU8);

    const command = new PutObjectCommand({
      Bucket: Bucket,
      Key: fileName,
      Body: fileBinary,
      ContentType: ContentType,
      ACL: 'public-read',
    });
    
    const response = await client.send(command);
    console.log("res: for uploaded file---------> ", response)
    return response;
  } catch (error) {
    throw (error)
  }
};
