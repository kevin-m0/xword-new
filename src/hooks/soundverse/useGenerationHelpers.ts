import axios, { AxiosRequestConfig } from "axios";
import { useAtom } from "jotai";
import { refetchTrigger } from "~/atoms";
import { GenerateAudioPayload } from "~/types/soundverse.types";

export const useGenerationHelpers = () => {
  const [_, setRefetchTokenUsage] = useAtom(refetchTrigger);
  const generateVoice = async (payload: GenerateAudioPayload) => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_LLM_TOKEN,
        },
      };

      const apiUrl = `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/audio/generate-audio`;
      const { data } = await axios.post(apiUrl, payload, config);

      setRefetchTokenUsage((prev) => !prev);

      return data.file;

    } catch (e) {
      console.log(e);
      // <ErrorToast
//   t={t}
//   title="Audio Generation Error"
//   description="Something went wrong. Please try again later."
// />
    }
  };

  return { generateVoice };
};