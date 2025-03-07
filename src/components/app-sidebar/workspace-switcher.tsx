"use client";

import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import { ArrowUpDown, ChevronDown, Command } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import NewSidebarWorkspacePopover from "./NewSidebarWorkspacePopover";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

const WorkspaceSwitcher = () => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <>insert custom loader here</>;
  }

  return (
    <NewSidebarWorkspacePopover>
      <SidebarMenuButton size="lg" asChild>
        <div className="cursor-pointer bg-slate-500 p-2 h-14">
          <div className="flex aspect-square size-9 items-center justify-center !rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            {organization?.imageUrl ? (
              <h2  className="text-white font-bold text-base">{organization?.name?.charAt(0)?.toUpperCase() || "W"}</h2>
              // <Image
              //   src={organization?.imageUrl}
              //   alt={organization?.name}
              //   className="h-full w-full object-cover !rounded-full border-2 border-blue-600"
              //   height={5}
              //   width={5}
              // />
            ) : (
              <Command className="h-full w-full" />
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-base">{organization?.name}</span>
            <span className="truncate text-sm">Free Tier</span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4" />
        </div>
      </SidebarMenuButton>
    </NewSidebarWorkspacePopover>
  );
};

export default WorkspaceSwitcher;
