import AppSidebar from "~/components/app-sidebar/app-sidebar";
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
      <SidebarInset className="max-h-10">
        <header className="z-50 flex h-16 w-full shrink-0 items-center gap-2 bg-transparent">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
