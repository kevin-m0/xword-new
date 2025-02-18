import { atom } from "jotai";

export enum CALENDARFLOW {
  CREATE,
  OPTIONS,
  FORM,
  SCHEDULE,
}
export const calendarFlowAtom = atom<CALENDARFLOW>(CALENDARFLOW.CREATE);
export const selectedAccountAtom = atom<string | null>(null);
export const selectedOptionAtom = atom<string | null>(null);

export interface SocialAccountOption {
  id: string;
  label: string;
  icon: string;
}

export interface SocialAccount {
  name: string;
  value: string;
  image: string;
  username: string;
  options?: SocialAccountOption[];
}

export type Media = {
  type: "audio" | "video" | "image" | "doc";
  source: "url" | "file" | "key"; // Indicates whether the media is a URL or a file
  content: string | File; // Stores URL as a string or the File object
};

// export const mediaUrlsAtom = atom<string[]>([]);
// export const mediaFilesAtom = atom<File[]>([]);
export const postTitleAtom = atom<string>("");
export const postDescriptionAtom = atom<string>("");
export const postTextAtom = atom<string>("");
export const postMediaAtom = atom<Media[]>([]);
export const scheduleAndTimeAtom = atom<Date>(new Date());
export const socialAccountsAtom = atom<SocialAccount[]>([
  {
    name: "LinkedIn",
    value: "linkedin",
    image: "/images/contentverse/linkedin.svg",
    username: "ProfessionalNet",
    options: [
      {
        id: "Post",
        label: "Post",
        icon: "/images/contentverse/linkedin.svg",
      },
      {
        id: "Video",
        label: "Video",
        icon: "/images/contentverse/linkedin.svg",
      },
    ],
  },
  {
    name: "X",
    value: "twitter",
    image: "/images/contentverse/x-twitter.svg",
    username: "TweetMaster",
    options: [
      {
        id: "Tweet",
        label: "Tweet",
        icon: "/images/contentverse/x-twitter.svg",
      },
      {
        id: "Thread",
        label: "Thread",
        icon: "/images/contentverse/x-twitter.svg",
      },
    ],
  },
  {
    name: "Instagram",
    value: "instagram",
    image: "/icons/instagram-new.svg",
    username: "TweetMaster",
    options: [
      {
        id: "Post",
        label: "Post",
        icon: "/icons/instagram-new.svg",
      },
      {
        id: "Story",
        label: "Story",
        icon: "/icons/instagram-new.svg",
      },
      {
        id: "Reel",
        label: "Reel",
        icon: "/icons/instagram-new.svg",
      },
    ],
  },
  {
    name: "Facebook",
    value: "facebook",
    image: "/icons/facebook-new.svg",
    username: "kevz",
    options: [
      {
        id: "Post",
        label: "Post",
        icon: "/icons/facebook-new.svg",
      },
      {
        id: "Story",
        label: "Story",
        icon: "/icons/facebook-new.svg",
      },
    ],
  },
  {
    name: "Youtube",
    value: "youtube",
    image: "/icons/youtube-new.svg",
    username: "Youtube",
    options: [
      {
        id: "Video",
        label: "Video",
        icon: "/icons/youtube-new.svg",
      },
      {
        id: "Shorts",
        label: "Shorts",
        icon: "/icons/youtube-new.svg",
      },
    ],
  },
]);
