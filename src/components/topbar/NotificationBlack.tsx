import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import XWGradDiv from "../reusable/XWGradDiv";
import { Button } from "~/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import Image from "next/image";
import XWButton from "../reusable/XWButton";

const NotificationBlack = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="hover:bg-xw-secondary" size={"icon"}>
          <Bell className="h-4 w-4 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex h-96 w-80 flex-col border-none">
        <XWGradDiv className="flex w-full flex-1 flex-col gap-2 px-2 py-5">
          <div className="flex items-center justify-between gap-2 p-2">
            <h1 className="text-lg font-semibold">Notifications</h1>
            <Settings className="h-6 w-6" />
          </div>
          <Separator />

          <div className="flex-1">
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <Image
                src={"/icons/belloff.svg"}
                height={40}
                width={40}
                alt="bell off"
              />

              <p>You have no notifications.</p>
            </div>
          </div>

          <Separator />
          <div className="flex items-center justify-between gap-2 p-2">
            <h1 className="text-sm">0 unread</h1>
            <XWButton size="sm" className1=" text-sm" disabled>
              Mark all as read
            </XWButton>
          </div>
        </XWGradDiv>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBlack;
