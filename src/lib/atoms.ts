import { atom } from "jotai";
type Views = "grid" | "list";
export const viewAtom = atom<Views>("grid"); 
