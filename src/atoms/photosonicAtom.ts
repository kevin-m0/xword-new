import { atom } from "jotai";


export enum PHOTO_SONIC_MODE {
    "Simple",
    "Real Time",
}
export interface ImageAsset {
    id: string;
    assetKey: string;
    assetName?: string;
    prompt?: string;
    assetType: string;
    workspaceId: string;
    folderId?: string;
}

export const photoSonicImageGeneratingAtom = atom(false);

export const photoSonicModeAtom = atom<PHOTO_SONIC_MODE>(PHOTO_SONIC_MODE.Simple);

export const imageCurrentState = atom<ImageAsset[] | null>(null);
export const aiImagesLoadingState = atom<boolean>(false);
export const aiImageLoadingRatio = atom<string>("1024x768");
export const aiImageCount = atom<number>(1);
export const currentGeneratingPrompt = atom<string>("");
export const refetchTrigger = atom<boolean>(false);

export const realTimeImageAtom = atom<string | null>(null);
export const isGeneratingRealtimeImageAtom = atom<boolean>(false);