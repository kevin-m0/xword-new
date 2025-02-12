import { atom } from "jotai";

export const postTextAtom = atom("");
export const postImageAtom = atom<string | null>(null);
export const selectedLanguageAtom = atom("en");
