import { absoluteUrl } from "~/utils/utils";
import axios from "axios";

export const uploadFile = async (file: File, fileName: string) => {
  const url = "/api/aws/uploadFile";
  const absoluteURL = absoluteUrl(url);
  const fileType = file.type;
  const formData = new FormData();
  formData.append("fileName", fileName);
  formData.append("file", file);
  formData.append("ContentType", fileType);

  // console.log("formData: ", fileName, fileType, file);

  const response = await axios.post(absoluteURL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // console.log("res: ", response)
  return response.data;
};