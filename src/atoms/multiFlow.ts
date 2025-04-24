import { atom } from "jotai"

export enum MultiFlowType {
    "General",
    'Social'
}

export enum MultiSelectType {
    url = 'url',
    doc = 'doc',
    audio = 'audio',
    audio_url = 'audio_url',
    default = 'default',
    video_url = "video_url",
    video = "video"
}
export const multiSourceSelect = atom<MultiSelectType>(MultiSelectType.default);


export const multiFlowStep = atom(0)
export const multiFlowPromptId = atom<string | null>(null)
export const multiFlowType = atom<MultiFlowType>(MultiFlowType.General)
export const multiPromptArray = atom<string[]>([])
export const multiFlowPrompt = atom<string | null>(null)
export const multiFlowCategories = atom<{ promptId: string, category: string, prevType: string }[]>([])
export const multiFlowTranscribe = atom<boolean>(false);