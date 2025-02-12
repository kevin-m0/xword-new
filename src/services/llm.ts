
import axios from "axios";
import { MODEL_TYPE } from "~/atoms";

// API endpoints for the paid version of the LLM API
const API_PAID = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL}/generate`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
  },
});

// LLM Microservice API's output is not structured properly which causes unexpected results, hence commenting the code until the API is fixed.
// API endpoints for the free tier of the LLM API
const API_FREE = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL}/generate`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TOKEN}`,
  },
});

// const API_TEST = axios.create({
// 	baseURL: `${process.env.NEXT_PUBLIC_LLM_TEST}/generate`,
// 	headers: {
// 		Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_TEST_TOKEN}`,
// 	},
// });

type SEOOptmiseAPIResponse = {
  response: string;
};
type SuggestIdeasResponse = {
  response: string[];
};

type WriteContentResponse = {
  response: string;
};

type ScraptTextResponse = {
  response: string;
};

type GenerateIdeasForPlannerResponse = {
  geminiResponse: string[];
};

type GenerateOutlinesForPlannerResponse = {
  geminiResponse: string[];
};

type GenerateArticleForPlannerResponse = {
  response: string;
};

export const seoOptimise = (
  payload: {
    userId: string;
    text: string;
  },
  isSubscribed: boolean,
) => {
  if (true) {
    return API_PAID.post<SEOOptmiseAPIResponse>(`/seo/seo-optimise`, {
      userId: payload.userId,
      text: payload.text,
    });
  } else {
    return API_PAID.post<SEOOptmiseAPIResponse>(`/seo/generate-seo-optimize`, {
      userId: payload.userId,
      text: payload.text,
    });
  }
};

export const scrapeText = (payload: {
  userId: string;
  urls: string[];
  tagsToSkip: string[];
  cssToSkip: string[];
  token: string;
  id: string;
  query: string;
}) => {
  // return API_PAID.post<ScraptTextResponse>(`/chatbot/web-scrape`, {
  //   userId: payload.userId,
  //   text: payload.text,
  // });
};

export const suggestIdeas = (
  payload: {
    userId: string;
    query: string;
    quantity: string;
    model: MODEL_TYPE;
  },
  isSubscribed: boolean,
) => {
  if (true)
    return API_PAID.post<SuggestIdeasResponse>(`/suggest-ideas`, payload);
  else
    return API_PAID.post<SuggestIdeasResponse>(
      `/generate-suggest-ideas`,
      payload,
    );
};

export const fetchPromptLibrary = () => {
  return API_PAID.get("/prompt-library/all-prompts");
};

export const fetchPromptLibraryForTranscription = () => {
  return API_FREE.get("/every-prompt");
};

export const fetchPromptLibraryForContentGen = () => {
  return API_PAID.get("/every-prompt"); //TODO: change the endpoint to fetch all prompts from contentGen instead of transcription
};

export const fetchPromptByIdForContentGen = (promptId: string) => {
  return API_PAID.get(`/get-selected-prompt?promptId=${promptId}`); //TODO: change the endpoint to fetch a single prompt from contentGen instead of transcription
};

export const contentGenResponse = ({
  userId,
  promptId,
  responses,
}: {
  userId: string;
  promptId: string;
  responses: object;
}) => {
  return API_PAID.post(`/get-prompt-library-response`, {
    userId,
    promptId,
    responses,
  });
};

export const fetchPromptDetails = (promptId: string) => {
  return API_PAID.get(`/prompt-library/prompt-details`, {
    params: {
      promptId,
    },
  });
};

export const writeContent = (
  payload: {
    userId: string;
    prompt: string;
    words: string;
    personalizedVector?: {
      audience?: string;
      purpose?: string;
      tone?: string[];
      emotions?: string[];
      character?: string[];
      genre?: string[];
      language?: string[];
      syntax?: string;
    };
  },
  isSubscribed: boolean,
) => {
  if (true)
    return API_PAID.post<WriteContentResponse>("/write-content", payload);
  else
    return API_PAID.post<WriteContentResponse>(
      "/generate-write-content",
      payload,
    );
};

export const generateKeywords = (
  payload: {
    userId: string;
    topic: string;
    url: string;
    locationCode: string;
    strategy: string;
  },
  isSubscribed: boolean,
) => {
  return axios.post(
    process.env.NEXT_PUBLIC_KEYWORDS_PLANNER_URL!,
    {
      topic: payload.topic,
      url: payload.url,
      locationCode: payload.locationCode,
      strategy: payload.strategy,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const generateIdeasForPlanner = async (
  payload: {
    userId: string;
    topic: string;
    keywords: string;
    tone: string;
    pov: string;
    call: string;
    model: MODEL_TYPE;
  },
  isSubscribed: boolean,
) => {
  const { data } = await API_PAID.post<GenerateIdeasForPlannerResponse>(
    "/generate-get-ideas",
    { ...payload },
  );
  return data;
};

export const generateOutlinesForPlanner = async (
  payload: {
    userId: string;
    title: string;
    keywords: string;
    tone: string;
    pov: string;
    call: string;
    model: MODEL_TYPE;
  },
  isSubscribed: boolean,
) => {
  const { data } = await API_PAID.post<GenerateOutlinesForPlannerResponse>(
    "/generate-get-outline",
    payload,
  );
  return data;
};

export const generateArticleForPlanner = async (
  payload: {
    userId: string;
    title: string;
    outline: string;
    keywords: string;
    tone: string;
    pov: string;
    call: string;
    model: MODEL_TYPE;
  },
  isSubscribed: boolean,
) => {
  return API_PAID.post<GenerateArticleForPlannerResponse>(
    "/generate-get-article",
    payload,
  );
};

export const topSearchResults = async (
  payload: { userId: string; topic: string; countryCode: string },
  isSubscribed: boolean,
) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SEARCH_RESULTS_URL!,
      {
        params: {
          q: payload.topic,
          gl: payload.countryCode,
          lr: "lang_en",
          num: "10",
          start: "0",
        },
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_SEARCH_API_KEY!,
          "X-RapidAPI-Host": "google-search72.p.rapidapi.com",
        },
      },
    );
    const res = response.data.items.map((data: any) => ({
      link: data.link,
      title: data.title,
    }));
    return res;
  } catch (error) {
    throw new Error("Failed to fetch top search results");
  }
};
