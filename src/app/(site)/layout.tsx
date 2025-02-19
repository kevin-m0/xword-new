import AppSidebar from "~/components/app-sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useDoesUserExist } from "~/hooks/misc/useDoesUserExist";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const { user, isLoading } = useDoesUserExist();

  // if (isLoading)
  //   return (
  //     <div>
  //       <LoadingScreen />
  //     </div>
  //   );

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* i dont know how the max-h-10 worked. but basically i want the container to be there and the elements to scroll inside it */}
      <SidebarInset>
        {/* <header className="fixed top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-transparent pl-5 pt-2">
          <SidebarTrigger className="-ml-1" />
        </header> */}
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
