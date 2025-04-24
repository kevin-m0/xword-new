import { atom } from "jotai";

export enum MEDIA_ASSETS_TAB {
    image,
    audio
}

export enum MEDIA_PROJECT_TAB {
    audio,
    video,
    documents
}

export const mediaAssetsTab = atom<MEDIA_ASSETS_TAB>(MEDIA_ASSETS_TAB.image);

export const mediaTabs = atom<"assets" | "projects">("assets")

export const mediaProjectTab = atom<MEDIA_PROJECT_TAB>(MEDIA_PROJECT_TAB.audio)

export const timeFilterAtom = atom<string>("All Time");