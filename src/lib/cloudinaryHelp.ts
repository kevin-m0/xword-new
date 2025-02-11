import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,

  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,

  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

const FOLDER_NAME = "concatenated-videos/";

export const handleCloudinaryUpload = (path: string, concatVideos = []) => {
  let folder = "videos/";

  // Array to hold Cloudinary transformation options
  const transformation:any = [];

  // If concatVideos parameter is not empty, add the videos transformation options to the transformation array
  if (concatVideos.length) {
    folder = FOLDER_NAME;

    // 720p Resolution
    const width = 1280,
      height = 720;

    for (const video of concatVideos) {
      transformation.push(
        { height, width, crop: "pad" },
        { flags: "splice", overlay: `video:${video}` },
      );
    }

    transformation.push(
      { height, width, crop: "pad" },
      { flags: "layer_apply" },
    );
  }

  // Create and return a new Promise
  return new Promise((resolve, reject) => {
    // Use the sdk to upload media
    cloudinary.uploader.upload(
      path,
      {
        // Folder to store video in
        folder,
        // Type of resource
        resource_type: "auto",
        allowed_formats: ["mp4"],
        transformation,
      },
      (error, result) => {
        if (error) {
          // Reject the promise with an error if any
          return reject(error);
        }

        // Resolve the promise with a successful result
        return resolve(result);
      },
    );
  });
};
