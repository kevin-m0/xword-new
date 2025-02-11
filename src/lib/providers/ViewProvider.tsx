import { ViewContextProvider } from "./ViewContextProvider";
import React from "react";
import { cookies } from "next/headers";
import { View } from "~/types";

interface ViewProviderProps {
  children: React.ReactNode;
}

const ViewProvider = async ({ children }: ViewProviderProps) => {
  const cookieStore = await cookies();
  const view = cookieStore.get("view");
  let viewValue: View;

  if (view?.value === "grid" || view?.value === "list") {
    viewValue = view.value as View;
  } else {
    viewValue = "grid";
  }

  return (
    <ViewContextProvider initialViewValue={viewValue}>
      {children}
    </ViewContextProvider>
  );
};

export default ViewProvider;
