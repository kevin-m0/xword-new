import { atom } from "jotai";

export const selectedSuggestionAtom = atom<string>("");


// flow atom in writerX
export enum FlowType {
    "General",
    'Social'
}
export const flowSteps = atom<Number>(0)
export const flowPromptId = atom<string | null>(null)
export const flowType = atom<FlowType>(FlowType.General)
export const socialFlowId = atom<string | null>(null)
export const flowImages = atom<string[]>([])
export const flowVariations = atom<string[]>([])
export const flowPrevType = atom<string | null>(null)