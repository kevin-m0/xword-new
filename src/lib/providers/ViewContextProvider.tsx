"use client";
import { useState, useCallback, useEffect } from "react";
import { viewContext } from "../contexts/viewContext";
import { cookies } from "../../utils/utils";
import { View } from "~/types";
interface ViewProviderProps {
  children: React.ReactNode;
  initialViewValue: View;
}

export const ViewContextProvider = ({
  children,
  initialViewValue,
}: ViewProviderProps) => {
  const [view, setView] = useState<View>(initialViewValue);

  const selectGridView = useCallback(() => {
    if (view === "grid") return;
    setView("grid");
  }, [view]);

  const selectListView = useCallback(() => {
    if (view === "list") return;
    setView("list");
  }, [view]);

  useEffect(() => {
    cookies.set("view", view);
  }, [view]);

  const contextValue = {
    view,
    selectGridView,
    selectListView,
  };

  return (
    <viewContext.Provider value={contextValue}>{children}</viewContext.Provider>
  );
};
