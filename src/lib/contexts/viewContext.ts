import { createContext } from "react";
import { ViewContextType } from "~/types";
export const viewContext = createContext<ViewContextType>(
  {} as ViewContextType
);
