"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(fileUrl: string) {
  const result = await cloudinary.uploader
    .upload_large(fileUrl, {
      resource_type: "video",
      public_id: "exported_projects",
      overwrite: true,
    })
    .then((result) =>
      console.log(`Uploaded to Cloudinary: ${result.secure_url || result.url}`),
    );
  return result;
}
