import { useState } from "react";
import { uploadFile } from "~/services/aws-file-upload";

export const useUploadAudioFile = () => {
  const [uploading, setUploading] = useState(false);

  const uploadAudioFile = async (file: File): Promise<string> => {
    const key = crypto.randomUUID();
    setUploading(true);
    try {
      await uploadFile(file, key);
      return key;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadAudioFile, uploading };
};