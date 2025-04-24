import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Menu } from "lucide-react";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";

const ChatSonicMobileSidebar = ({ sidebar }: { sidebar: React.ReactNode }) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="tb:hidden px-2 py-4 lg:hidden">
        <XWSecondaryButton size="icon">
          <Menu className="h-4 w-4" />
        </XWSecondaryButton>
      </SheetTrigger>
      <SheetContent className="xw-scrollbar flex w-full max-w-sm flex-col overflow-x-auto px-0 py-5">
        <SheetHeader>
          <SheetTitle className="hidden">Are you absolutely sure?</SheetTitle>
          <SheetDescription className="hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1">{sidebar}</div>

        <div></div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSonicMobileSidebar;
