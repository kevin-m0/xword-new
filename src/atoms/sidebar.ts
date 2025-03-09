import { atom } from "jotai";

export const sidebarAtom = atom<boolean>(true);


export const activeTabAtom = atom<string | null>(null);

