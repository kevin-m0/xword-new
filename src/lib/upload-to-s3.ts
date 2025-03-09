import { v4 as uuidv4 } from "uuid";

export const uploadToS3 = async (file: File) => {
  const fileName = uuidv4() as string;

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("ContentType", file.type);

    const response = await fetch(
      process.env.NEXT_PUBLIC_APP_URL + "/api/upload-url",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get upload URL");
    }
    const data = (await response.json()) as { url: string };
    return { fileUrl: data?.url, fileKey: `uploads/${fileName}` };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file");
  }
};
