import { CategoryWithPrompts, ProjectDoc } from "~/types";

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



export const projectDocs: ProjectDoc[] = [
  {
      id: '1',
      title: 'Project Overview Document',
      type: 'document',
      created: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      image: '/images/video-thumbnail.png',
      link: '/projects/1',
      creator: {
          name: 'John Doe',
          image: '/images/avatar1.png'
      }
  },
  {
      id: '2',
      title: 'Marketing Video Campaign',
      type: 'video',
      created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastEdited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/video-thumbnail.png',
      link: '/projects/2',
      creator: {
          name: 'Jane Smith',
          image: '/images/avatar2.png'
      }
  },
  {
      id: '3',
      title: 'Technical Documentation',
      type: 'document',
      created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastEdited: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/video-thumbnail.png',
      link: '/projects/3',
      creator: {
          name: 'Mike Johnson',
          image: '/images/avatar3.png'
      }
  },
  {
      id: '4',
      title: 'Product Demo Video',
      type: 'video',
      created: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      lastEdited: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/video-thumbnail.png',
      link: '/projects/4',
      creator: {
          name: 'Sarah Williams',
          image: '/images/avatar4.png'
      }
  },
  {
      id: '5',
      title: 'Project Timeline',
      type: 'document',
      created: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
      lastEdited: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      image: '/images/video-thumbnail.png',
      link: '/projects/5',
      creator: {
          name: 'Alex Brown',
          image: '/images/avatar5.png'
      }
  }
]; 