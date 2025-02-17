import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Settings } from "lucide-react";
import Image from "next/image";

const UserBox = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/images/user2.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="mr-2 flex w-80 flex-col gap-2">
        <div className="flex items-center rounded-lg border border-xw-secondary p-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex flex-col">
            <span className="text-white">Shadcn</span>
            <span className="text-xs text-xw-muted">example@shadcn.co</span>
          </div>
        </div>

        <Link href={"/settings"} className="w-full">
          <Button variant={"ghost"} className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" /> General Settings
          </Button>
        </Link>
        <Link href={"/"} className="w-full">
          <Button variant={"ghost"} className="w-full justify-start gap-2">
            <Image
              src={"/icons/Crown.svg"}
              width={15}
              height={15}
              alt="crown"
            />
            Manage Plan
          </Button>
        </Link>

        <Link href={"/"} className="w-full">
          <Button variant={"default"} className="w-full justify-start gap-2">
            Update Plan
          </Button>
        </Link>

        <Link href={"/"} className="w-full">
          <Button className="w-full justify-start gap-2" variant={"ghost"}>
            <Image
              src={"/icons/logout.svg"}
              width={15}
              height={15}
              alt="logout"
            />
            Sign Out
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default UserBox;
