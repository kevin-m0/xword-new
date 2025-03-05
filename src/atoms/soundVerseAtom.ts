import { atom } from "jotai";
import { LanguageModel } from "~/types/soundverse.types";

// To store audio generation details
export const audioEmotionAtom = atom<string | null>(null);
export const audioLanguageAtom = atom<LanguageModel | null>(null);
export const audioApplyToAllParaAtom = atom<boolean>(false);
export const audioVoiceStyleIdAtom = atom<string | null>(null);
export const audioVoiceStyleNameAtom = atom<string | null>(null);
export const fileUrlAtom = atom<string | null>(null);

// Define atoms with TypeScript types
export const paraTextAtom = atom<string>("");
export const isProcessingAtom = atom<boolean>(false);
export const isGeneratingScriptAtom = atom<boolean>(false);
export const isCheckingGrammarAtom = atom<boolean>(false);

// File upload state
export const localFileAtom = atom<File | null>(null);
export const isUploadingAtom = atom<boolean>(false);

// Transcription states
export const isGeneratingTransScriptAtom = atom<boolean>(false);
export const transcriptionErrorAtom = atom<boolean>(false);
export const transcriptAtom = atom<string>("");

// Audio key state
export const generatedAudioKeyAtom = atom<string | null>(null);

// Selected language state
export const selectedLanguageAtom = atom<string>("en");
