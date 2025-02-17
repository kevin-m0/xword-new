import { CategoryWithPrompts } from "~/types";

export const DOCUMENTS_LIMIT_HOME_PAGE = 15;
export const IMAGE_LIMIT = 4;
export const TOKEN_QUEUE = "token-queue";

//this are used  for key board shortcuts can be changes or updated from here
// Add short cuts ad needed here and short cuts can be updated here
export const SHORTCUT_ACTIONS = {
  GRAMMER_CHECK: new Set(["shift", "alt", "g"]),
  SPELL_CHECK: new Set(["shift", "alt", "s"]),
  LEARN_FROM_WRITING: new Set(["shift", "alt", "l"]),
  EXPAND: new Set(["shift", "alt", "e"]),
  SHORTEN: new Set(["shift", "alt", "x"]),
  AUTO_COMPLETE: new Set(["shift", "alt", "a"]),
  SUMMARIZE: new Set(["shift", "alt", "z"]),
  REPHRASE: new Set(["shift", "alt", "r"]),
  ADD_EMOJI: new Set(["shift", "alt", "m"]),
  GENERATE_IMAGE: new Set(["shift", "alt", "i"]),
  SEO_OPTIMISE: new Set(["control", "shift", "s"]),
  PLAGIARISM_DETECTION: new Set(["shift", "alt", "p"]),
} as const;

export const KEYBOARD_SHORTCUTS = {
  openCommandPalette: {
    alternative1: new Set(["control", "k"]),
    alternative2: new Set(["control", "q"]),
  },
} as const;

export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 100000,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 1000000,
    price: {
      amount: 0,
      priceIds: {
        test: "price_1Om7UeSJHqAMsbsWCUGQFoJ5",
        production: "",
      },
    },
  },
];
export const ADD_FILE_TOOLTIP_CONTENT = {
  TRIGGER: " Upload and chat with your files, links, images and audio",
  DOCUMENT: "Upload Document",
  IMAGE: "Upload Image",
  AUDIO: "Upload Audio",
  URL: "Add Url",
  ONLY_ONE_TYPE:
    "Either only documents, only images, only audios or only links can be attached",
} as const;
