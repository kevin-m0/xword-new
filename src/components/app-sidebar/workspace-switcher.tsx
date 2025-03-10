"use client";

import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import { ArrowUpDown, ChevronDown, Command } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import NewSidebarWorkspacePopover from "./NewSidebarWorkspacePopover";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";

const WorkspaceSwitcher = () => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <>
      <div className="flex items-center space-x-3 p-2 w-full bg-gray-700 rounded-lg">
        {/* Avatar Skeleton */}
        <Skeleton className="h-10 w-10 rounded-full bg-blue-600" />

        <div className="space-y-1">
          {/* Name Skeleton */}
          <Skeleton className="h-4 w-16 bg-gray-400" />
          {/* Tier Skeleton */}
          <Skeleton className="h-3 w-20 bg-gray-500" />
        </div>
      </div>
    </>;
  }

  return (
    <NewSidebarWorkspacePopover>
      <SidebarMenuButton size="lg" asChild>
        <div className="cursor-pointer bg-slate-500 p-2 h-14">
          <div className="flex aspect-square size-9 items-center justify-center !rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            {organization?.imageUrl ? (
              <h2 className="text-white font-bold text-base">{organization?.name?.charAt(0)?.toUpperCase() || "W"}</h2>
            ) : (
              <Command className="h-full w-full" />
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-base text-white">{organization?.name}</span>
            <span className="truncate text-sm text-gray-300">Free Tier</span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4" />
        </div>
      </SidebarMenuButton>
    </NewSidebarWorkspacePopover>
  );
};

export default WorkspaceSwitcher;
