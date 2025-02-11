import React, { createContext } from "react";

type ShortCutContextType = {
  registerListner: (shortCutKey: Set<string>, eventHandler: () => void) => void;
  removeListner: (shortKey: Set<string>) => void;
  triggerListner: (shortKey: Set<string>, e: KeyboardEvent) => void;
};
const initilalValue = {
  registerListner: (_: Set<string>, eventHandler: () => void) => {},
  removeListner: (_: Set<string>) => {},
  triggerListner: (_: Set<string>, e: KeyboardEvent) => {},
};
export const shortCutContext =
  createContext<ShortCutContextType>(initilalValue);
