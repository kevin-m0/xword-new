"use client";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  MessageSquare,
  Network,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import moment from "moment";
import { CATEGORIES, PUBLISH_DATES } from "./constants";
import { useRouter } from "next/navigation";
import DomainTypeahead from "./DomainTypeahead";
import Image from "next/image";
// import ChatSonicSidebarLoader from '../loaders/ChatSonicSidebarLoader'
import { trpc } from "~/trpc/react";
import { useSessionId } from "~/hooks/chatsonic/useSessionId";
import useNewChat from "~/hooks/chatsonic/useNewChat";
import { OpenSections } from "~/types/chatsonic.types";
import ChatSonicSidebarLoader from "~/components/loaders/ChatSonicSidebarLoader";

interface ChatSonicSidebarProps {
  openSections: OpenSections;
  setOpenSections: React.Dispatch<React.SetStateAction<OpenSections>>;
  mode: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPublishDate: string;
  setSelectedPublishDate: (date: string) => void;
  includeDomains: string[];
  setIncludeDomains: (domains: string[]) => void;
}

const ChatSonicSidebar = ({
  openSections,
  setOpenSections,
  mode,
  selectedCategory,
  setSelectedCategory,
  selectedPublishDate,
  setSelectedPublishDate,
  includeDomains,
  setIncludeDomains,
}: ChatSonicSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sessionId = useSessionId();
  const handleNewChat = useNewChat();
  const { data: chats, isLoading } = trpc.chatsonic.fetchAllChats.useQuery();
  const router = useRouter();

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getFilteredChats = (period: string) => {
    if (!chats) return [];
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");
    const last30days = moment().subtract(30, "days").startOf("day");

    return chats.filter((chat: any) => {
      const createdAt = moment(chat.createdAt);
      const searchContains = chat.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      let dateMatch = false;
      switch (period) {
        case "today":
          dateMatch = createdAt.isSame(today, "day");
          break;
        case "yesterday":
          dateMatch = createdAt.isSame(yesterday, "day");
          break;
        case "last30days":
          dateMatch = createdAt.isBetween(
            last30days,
            yesterday,
            undefined,
            "[]",
          );
          break;
      }
      return dateMatch && searchContains;
    });
  };

  const handleChatSelect = (chatId: string) => {
    router.push(`/chatsonic/${chatId}`);
  };

  return (
    <div className="flex h-full w-full flex-col gap-5 p-5">
      <Button variant="default" onClick={handleNewChat}>
        New Chat
      </Button>

      <div className="flex w-full items-center justify-between rounded-lg border border-neutral-800 bg-black px-4 py-2">
        <Input
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-6 w-[85%] border-none bg-transparent p-0 text-sm font-medium text-white placeholder:text-white"
        />
        <Search className="h-4 w-4" />
      </div>

      <Separator />

      <Collapsible
        open={openSections.chats}
        onOpenChange={() => toggleSection("chats")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between focus:ring-0"
          >
            <span className="flex items-center gap-2 uppercase">
              <MessageSquare className="h-4 w-4" />
              Chats
            </span>
            {openSections.chats ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {isLoading ? (
            <ChatSonicSidebarLoader />
          ) : (
            <>
              {getFilteredChats("today").length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  <h2 className="text-xs text-muted-foreground">TODAY</h2>
                  {getFilteredChats("today").map((chat: any) => (
                    <Button
                      key={chat.id}
                      className="w-full justify-start text-sm"
                      variant={chat.id === sessionId ? "secondary" : "ghost"}
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      {chat.title}
                    </Button>
                  ))}
                </div>
              )}

              {getFilteredChats("yesterday").length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  <h2 className="text-xs text-muted-foreground">YESTERDAY</h2>
                  {getFilteredChats("yesterday").map((chat: any) => (
                    <Button
                      key={chat.id}
                      className="w-full justify-start text-sm"
                      variant={chat.id === sessionId ? "secondary" : "ghost"}
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      {chat.title}
                    </Button>
                  ))}
                </div>
              )}

              {getFilteredChats("last30days").length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  <h2 className="text-xs text-muted-foreground">
                    LAST 30 DAYS
                  </h2>
                  {getFilteredChats("last30days").map((chat: any) => (
                    <Button
                      key={chat.id}
                      className="w-full justify-start text-sm"
                      variant={chat.id === sessionId ? "secondary" : "ghost"}
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      {chat.title}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Web Mode Options */}
      {mode === "Web" && (
        <>
          <Separator />
          <Collapsible
            open={openSections.categories}
            onOpenChange={() => toggleSection("categories")}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-xw-sidebar w-full justify-between px-0 focus:ring-0"
              >
                <span className="flex items-center gap-2 uppercase">
                  <Network className="h-4 w-4" />
                  Categories
                </span>
                {openSections.categories ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  className="hover:bg-xw-secondary w-full justify-start gap-2 text-sm"
                  variant={
                    category === selectedCategory ? "secondary" : "ghost"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  <Image
                    src={`/icons/chatsonic/${category}.svg`}
                    alt={category}
                    width={16}
                    height={16}
                  />
                  {category}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openSections.publishDate}
            onOpenChange={() => toggleSection("publishDate")}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-xw-sidebar w-full justify-between px-0 focus:ring-0"
              >
                <span className="flex items-center gap-2 uppercase">
                  <Calendar className="h-4 w-4" />
                  Publish Date
                </span>
                {openSections.publishDate ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {PUBLISH_DATES.map((date) => (
                <Button
                  key={date}
                  className="hover:bg-xw_secondary w-full justify-start text-sm"
                  variant={date === selectedPublishDate ? "secondary" : "ghost"}
                  onClick={() => setSelectedPublishDate(date)}
                >
                  {date}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <DomainTypeahead
            includeDomains={includeDomains}
            setIncludeDomains={setIncludeDomains}
            openSections={openSections}
            setOpenSections={setOpenSections}
          />
        </>
      )}
    </div>
  );
};

export default ChatSonicSidebar;
