import AppSidebar from "~/components/app-sidebar/app-sidebar";
import { CheckAuth } from "~/components/providers/CheckAuth";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        {/* <header className="fixed top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-transparent pl-5 pt-2">
        </header> */}
        <div>
          <CheckAuth>{children}</CheckAuth>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
