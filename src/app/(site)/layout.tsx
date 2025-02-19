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
      <SidebarInset>
        {/* <header className="fixed top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-transparent pl-5 pt-2">
          <SidebarTrigger className="-ml-1" />
        </header> */}
        <div>
          <CheckAuth>{children}</CheckAuth>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
