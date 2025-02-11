import React, { createContext } from "react";

type KeyBoardContextType = {};

const initilalValue: KeyBoardContextType = {};

export const keyBoardContext =
  createContext<KeyBoardContextType>(initilalValue);
