"use client";

import { Link } from "lucide-react";
import AppSidebar from "~/components/app-sidebar/app-sidebar";
import TopbarComponent from "~/components/topbar/TopbarComponent";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* i dont know how the max-h-10 worked. but basically i want the container to be there and the elements to scroll inside it */}

      <SidebarInset className="">
        <header className="fixed top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-transparent pl-5 pt-2">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
