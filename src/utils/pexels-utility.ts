import axios from "axios";

export const handlePexelsVideoFetch = async (search: string) => {
  try {
    const url = process.env.NEXT_PUBLIC_PEXELS_VIDEO_URL!;
    const key = process.env.NEXT_PUBLIC_PEXELS_API_KEY!;
    const finalURL = new URL(url);
    finalURL.searchParams.append("query", search);
    finalURL.searchParams.append("per_page", "5"); // Fetch more results to increase chances of finding 1080p videos
    finalURL.searchParams.append("orientation", "landscape");
    finalURL.searchParams.append("size", "medium"); // Full HD (1080p)
    console.log("finalURL", finalURL.toString());

    const response = await axios.get(finalURL.toString(), {
      headers: {
        Authorization: key,
      },
    });

    // Filter for 1080p videos
    const videos = response.data.videos;
    const fullHDVideo = videos.find((video: any) =>
      video.video_files.some(
        (file: any) => file.width === 1920 && file.height === 1080,
      ),
    );

    if (!fullHDVideo) {
      throw new Error("No 1080p video found for the given query.");
    }

    // Find the first 1080p file link
    const videoFile = fullHDVideo.video_files.find(
      (file: any) => file.width === 1920 && file.height === 1080,
    );

    return videoFile.link;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error in handlePexelsVideoFetch");
  }
};

export const handlePexelsImageFetch = async (search: string) => {
  try {
    const url = process.env.NEXT_PUBLIC_PEXELS_IMAGE_URL!;
    const key = process.env.NEXT_PUBLIC_PEXELS_API_KEY!;
    const finalURL = new URL(url);
    finalURL.searchParams.append("query", search);
    finalURL.searchParams.append("per_page", "1");
    finalURL.searchParams.append("orientation", "landscape");
    console.log("finalURL", finalURL.toString());
    const response = await fetch(finalURL.toString(), {
      method: "GET",
      headers: {
        Authorization: key,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    return data.photos[0].src.original;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error in handlePexelsVideoFetch");
  }
};
