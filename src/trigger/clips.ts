import { task } from "@trigger.dev/sdk/v3";
import { createClips } from "~/lib/clip-generation/clip-generation";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME } from "~/lib/constant/videoverse.constants";

export const generateViralClips = task({
  id: "generate-viral-clips",
  run: async (payload: any) => {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const response = await createClips(
      payload.timestamps,
      payload.video,
      payload.videoId,
      payload.workspaceId,
    );
    return response;
  },
});
