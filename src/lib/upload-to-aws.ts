"use server";

export const uploadAudioFile = async (audioFile: File, signedUrl: string) => {
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": audioFile.type, // Ensure the content type matches the audio file
    },
    body: audioFile, // Send the file as the body of the request
  });

  if (!response.ok) {
    console.error("Error uploading audio file:", response.statusText);
    throw new Error("Failed to upload audio file.");
  }
};
