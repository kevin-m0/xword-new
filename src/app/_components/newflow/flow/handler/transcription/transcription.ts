import axios, { all } from "axios";
 
export const handleFileTrasncription = async ({ url, type }: { url: string, type: string }) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate/handle-transcription`,
        {
            url: url,
            type: type,
            languagecode: 'en'
        },
        {
            headers: {
                'Authorization':  `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }
    );
 
    return response.data
}