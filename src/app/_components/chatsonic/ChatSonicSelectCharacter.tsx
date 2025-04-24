import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Loader2, User } from "lucide-react";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { avatarImageMap } from "./utils";

interface Avatar {
  avatarId: string;
  characterName: string;
  description: string;
}

const ChatSonicSelectCharacter = ({
  avatars,
  isLoading,
  selectedCharacter,
  setSelectedCharacter,
}: {
  avatars: Avatar[];
  isLoading: boolean;
  selectedCharacter: string;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [open, setOpen] = React.useState(false);
  const characterName = selectedCharacter
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="gap-2" size={"sm"}>
          <User className="h-4 w-4" />{" "}
          {selectedCharacter === "wizard" ? "Character" : characterName}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-xw-sidebar w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Select Character:</DialogTitle>
          <DialogDescription className="hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <>
            <ScrollArea className="h-[80vh] w-full">
              <div className="flex flex-col gap-4">
                {avatars?.map((avatar) => (
                  <Card
                    key={avatar.avatarId}
                    className={`flex items-center gap-5 p-4 ${selectedCharacter === avatar.avatarId ? "bg-xw-primary" : ""}`}
                  >
                    <div
                      className="flex cursor-pointer items-center gap-4"
                      onClick={() => {
                        setSelectedCharacter(avatar.avatarId);
                        setOpen(false);
                      }}
                    >
                      <div className="h-[65px] w-[60px] flex-shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={
                            avatarImageMap[avatar.avatarId] ||
                            "/images/chatsonic/wizard.webp"
                          }
                          height={60}
                          width={60}
                          alt={avatar.characterName}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-lg font-semibold">
                          {avatar.characterName}
                        </h1>
                        <p className="text-xw-muted text-sm">
                          {avatar.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatSonicSelectCharacter;
