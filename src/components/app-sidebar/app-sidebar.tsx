"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "~/components/app-sidebar/nav-main";
import { NavProjects } from "~/components/app-sidebar/nav-projects";
import { NavSecondary } from "~/components/app-sidebar/nav-secondary";

const NavUser = dynamic(() => import("~/components/app-sidebar/nav-user"));

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "~/components/ui/sidebar";

import { useUser } from "@clerk/nextjs";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Media Library",
      url: "/media-library",
      icon: Bot,
      // items: [
      //   {
      //     title: "Genesis",
      //     url: "#",
      //   },
      //   {
      //     title: "Explorer",
      //     url: "#",
      //   },
      //   {
      //     title: "Quantum",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Content Calendar",
      url: "/content-calendar",
      icon: BookOpen,
    },
    {
      title: "Social Accounts",
      url: "/social-accounts",
      icon: Settings2,
    },
  ],
  navSecondary: [
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: LifeBuoy,
    // },
    // {
    //   title: "Feedback",
    //   url: "#",
    //   icon: Send,
    // },
  ],
  projects: [
    {
      name: "ChatSonic",
      url: "/chatsonic/aa",
      icon: Frame,
    },
    {
      name: "SoundVerse",
      url: "/soundverse",
      icon: PieChart,
    },
    {
      name: "PhotoSonic",
      url: "photosonic",
      icon: Map,
    },
    {
      name: "WriterX",
      url: "writerx",
      icon: Map,
    },
    {
      name: "ContentVerse",
      url: "contentverse",
      icon: Map,
    },
    {
      name: "AudioVerse",
      url: "audioverse",
      icon: Map,
    },
    {
      name: "VideoVerse",
      url: "videoverse",
      icon: Map,
    },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Kevin&apos;s Workspace
                  </span>
                  <span className="truncate text-xs">Free Tier</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <React.Suspense fallback={<SidebarMenuSkeleton />}>
          {user && <NavUser user={user} />}
        </React.Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
