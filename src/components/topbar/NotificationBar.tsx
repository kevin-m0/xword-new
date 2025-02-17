import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Bell, Calendar, Settings } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const NotificationBar = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <Bell className="h-4 w-4 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-2 flex w-80 flex-col gap-2">
        <div className="flex items-center justify-between gap-2 p-2">
          <h1 className="text-lg font-semibold">Notifications</h1>
          <Settings className="h-6 w-6" />
        </div>
        <Separator />

        <div className="flex w-full gap-2 rounded-md border border-xw-border bg-xw-card-hover p-2">
          <Avatar>
            <AvatarImage src="/images/user10.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between gap-2">
              <h1>John Doe</h1>
              <p className="text-xs">2 hours ago</p>
            </div>
            <p className="text-sm text-xw-muted">
              Invited you to join the workspace.
            </p>
          </div>
        </div>

        <div className="flex w-full gap-2 rounded-md border border-xw-border p-2">
          <Avatar className="bg-xw-background">
            <AvatarFallback className="bg-xw-background">
              <Calendar className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between gap-2">
              <h1>John Doe</h1>
            </div>
            <p className="text-sm text-xw-muted">
              Invited you to join the workspace.
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-2 p-2">
          <h1 className="text-sm">2 unread</h1>
          <Button size="sm" variant={"secondary"}>
            Mark all as read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBar;
