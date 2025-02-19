import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import { ArrowRightLeft, ChevronDown, Command } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import NewSidebarWorkspacePopover from "./NewSidebarWorkspacePopover";

const WorkspaceSwitcher = () => {
  const { organization } = useOrganization();

  return (
    <NewSidebarWorkspacePopover>
      <SidebarMenuButton size="lg" asChild>
        <a href="#">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {organization?.imageUrl ? (
              <Image
                src={organization?.imageUrl}
                alt={organization?.name}
                className="h-full w-full object-cover"
                height={5}
                width={5}
              />
            ) : (
              <Command className="h-full w-full" />
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{organization?.name}</span>
            <span className="truncate text-xs">Free Tier</span>
          </div>
          <ArrowRightLeft className="ml-auto h-4 w-4" />
        </a>
      </SidebarMenuButton>
    </NewSidebarWorkspacePopover>
  );
};

export default WorkspaceSwitcher;
