import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables
   */
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    CLERK_SECRET_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    TRIGGER_SECRET_KEY: z.string(),

    AWS_REGION: z.string(),
    S3_BUCKET_NAME: z.string(),
    AWS_FILE_UPLOAD_ACCESS_KEY: z.string(),
    AWS_FILE_UPLOAD_SECRET_KEY: z.string(),

    OPEN_METER_BASE_URL: z.string().optional(),
    OPEN_METER_SECRET: z.string().optional(),

    IMAGEKIT_PRIVATE_KEY: z.string().optional(),
    TIPTAP_BASE_URL: z.string().optional(),
    TIPTAP_JWT_SECRET: z.string().optional(),

    CLOUDINARY_API_SECRET: z.string().optional(),
  },

  /**
   * Client-side environment variables (must start with `NEXT_PUBLIC_`)
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default("/"),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default("/"),

    NEXT_PUBLIC_APP_ID: z.string().optional(),
    NEXT_PUBLIC_TIPTAP_APPID: z.string().optional(),

    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().optional(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().optional(),

    NEXT_PUBLIC_LLM_PAID_TIER_URL: z.string().optional(),
    NEXT_PUBLIC_LLM_FREE_TIER_URL: z.string().optional(),
    NEXT_PUBLIC_LLM_TOKEN: z.string().optional(),

    NEXT_PUBLIC_ABSTRACT_API_KEY: z.string().optional(),

    NEXT_PUBLIC_REDIS_HOST: z.string().optional(),
    NEXT_PUBLIC_REDIS_PASSWORD: z.string().optional(),

    NEXT_PUBLIC_NOVU_API_KEY: z.string().optional(),
    NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER: z.string().optional(),

    NEXT_PUBLIC_KEYWORDS_PLANNER_URL: z.string().optional(),
    NEXT_PUBLIC_SEARCH_RESULTS_URL: z.string().optional(),
    NEXT_PUBLIC_SEARCH_API_KEY: z.string().optional(),

    NEXT_PUBLIC_DEEP_GRAM_API_KEY: z.string().optional(),

    NEXT_PUBLIC_MUX_ACCESS_TOKEN: z.string().optional(),
    NEXT_PUBLIC_MUX_SECRET_TOKEN: z.string().optional(),

    NEXT_PUBLIC_RENDLEY_LICENSE_KEY: z.string().optional(),
    NEXT_PUBLIC_RENDLEY_LICENSE_NAME: z.string().optional(),

    NEXT_PUBLIC_STREAMPOT_API_KEY: z.string().optional(),

    NEXT_PUBLIC_PEXELS_API_KEY: z.string().optional(),
    NEXT_PUBLIC_PEXELS_VIDEO_URL: z.string().optional(),
    NEXT_PUBLIC_PEXELS_IMAGE_URL: z.string().optional(),
    NEXT_PUBLIC_GIPHY_API_KEY: z.string().optional(),

    NEXT_PUBLIC_PATHFIX_PUBLIC_KEY: z.string().optional(),
    NEXT_PUBLIC_PATHFIX_PRIVATE_KEY: z.string().optional(),

    NEXT_PUBLIC_TIPTAP_APP_ID: z.string().optional(),
    NEXT_PUBLIC_TIPTAP_APP_NAME: z.string().optional(),
    NEXT_PUBLIC_TIPTAP_TOKEN: z.string().optional(),

    NEXT_PUBLIC_AWS_IMAGE_BASE_URL: z.string().optional(),

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().optional(),

    NEXT_PUBLIC_TRIGGER_SECRET_KEY: z.string().optional(),
  },

  /**
   * Runtime environment variables
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,

    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY,

    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    AWS_FILE_UPLOAD_ACCESS_KEY: process.env.AWS_FILE_UPLOAD_ACCESS_KEY,
    AWS_FILE_UPLOAD_SECRET_KEY: process.env.AWS_FILE_UPLOAD_SECRET_KEY,

    OPEN_METER_BASE_URL: process.env.OPEN_METER_BASE_URL,
    OPEN_METER_SECRET: process.env.OPEN_METER_SECRET,

    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    TIPTAP_BASE_URL: process.env.TIPTAP_BASE_URL,
    TIPTAP_JWT_SECRET: process.env.TIPTAP_JWT_SECRET,

    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,

    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    NEXT_PUBLIC_TIPTAP_APPID: process.env.NEXT_PUBLIC_TIPTAP_APPID,

    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,

    NEXT_PUBLIC_LLM_PAID_TIER_URL: process.env.NEXT_PUBLIC_LLM_PAID_TIER_URL,
    NEXT_PUBLIC_LLM_FREE_TIER_URL: process.env.NEXT_PUBLIC_LLM_FREE_TIER_URL,
    NEXT_PUBLIC_LLM_TOKEN: process.env.NEXT_PUBLIC_LLM_TOKEN,

    NEXT_PUBLIC_ABSTRACT_API_KEY: process.env.NEXT_PUBLIC_ABSTRACT_API_KEY,

    NEXT_PUBLIC_REDIS_HOST: process.env.NEXT_PUBLIC_REDIS_HOST,
    NEXT_PUBLIC_REDIS_PASSWORD: process.env.NEXT_PUBLIC_REDIS_PASSWORD,

    NEXT_PUBLIC_NOVU_API_KEY: process.env.NEXT_PUBLIC_NOVU_API_KEY,
    NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER: process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER,

    NEXT_PUBLIC_KEYWORDS_PLANNER_URL: process.env.NEXT_PUBLIC_KEYWORDS_PLANNER_URL,
    NEXT_PUBLIC_SEARCH_RESULTS_URL: process.env.NEXT_PUBLIC_SEARCH_RESULTS_URL,
    NEXT_PUBLIC_SEARCH_API_KEY: process.env.NEXT_PUBLIC_SEARCH_API_KEY,

    NEXT_PUBLIC_DEEP_GRAM_API_KEY: process.env.NEXT_PUBLIC_DEEP_GRAM_API_KEY,

    NEXT_PUBLIC_MUX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MUX_ACCESS_TOKEN,
    NEXT_PUBLIC_MUX_SECRET_TOKEN: process.env.NEXT_PUBLIC_MUX_SECRET_TOKEN,

    NEXT_PUBLIC_RENDLEY_LICENSE_KEY: process.env.NEXT_PUBLIC_RENDLEY_LICENSE_KEY,
    NEXT_PUBLIC_RENDLEY_LICENSE_NAME: process.env.NEXT_PUBLIC_RENDLEY_LICENSE_NAME,

    NEXT_PUBLIC_STREAMPOT_API_KEY: process.env.NEXT_PUBLIC_STREAMPOT_API_KEY,

    NEXT_PUBLIC_PEXELS_API_KEY: process.env.NEXT_PUBLIC_PEXELS_API_KEY,
    NEXT_PUBLIC_PEXELS_VIDEO_URL: process.env.NEXT_PUBLIC_PEXELS_VIDEO_URL,
    NEXT_PUBLIC_PEXELS_IMAGE_URL: process.env.NEXT_PUBLIC_PEXELS_IMAGE_URL,
    NEXT_PUBLIC_GIPHY_API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY,

    NEXT_PUBLIC_PATHFIX_PUBLIC_KEY: process.env.NEXT_PUBLIC_PATHFIX_PUBLIC_KEY,
    NEXT_PUBLIC_PATHFIX_PRIVATE_KEY: process.env.NEXT_PUBLIC_PATHFIX_PRIVATE_KEY,

    NEXT_PUBLIC_TIPTAP_APP_ID: process.env.NEXT_PUBLIC_TIPTAP_APP_ID,
    NEXT_PUBLIC_TIPTAP_APP_NAME: process.env.NEXT_PUBLIC_TIPTAP_APP_NAME,
    NEXT_PUBLIC_TIPTAP_TOKEN: process.env.NEXT_PUBLIC_TIPTAP_TOKEN,

    NEXT_PUBLIC_AWS_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_AWS_IMAGE_BASE_URL,

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,

    NEXT_PUBLIC_TRIGGER_SECRET_KEY: process.env.NEXT_PUBLIC_TRIGGER_SECRET_KEY,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
