"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Cable,
  Calendar,
  Command,
  Frame,
  Home,
  Image,
  Library,
  LifeBuoy,
  Map,
  MessageCircle,
  Pen,
  PenIcon,
  PieChart,
  Send,
  Settings2,
  Speaker,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "~/components/app-sidebar/nav-main";
import { NavProjects } from "~/components/app-sidebar/nav-projects";
import { NavSecondary } from "~/components/app-sidebar/nav-secondary";

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
import WorkspaceSwitcher from "./workspace-switcher";
import NavUser from "./nav-user";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Media Library",
      url: "/media-library",
      icon: Library,
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
      icon: Calendar,
    },
    {
      title: "Social Accounts",
      url: "/social-accounts",
      icon: Cable,
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
      url: "/chatsonic",
      icon: MessageCircle,
    },
    {
      name: "SoundVerse",
      url: "/soundverse",
      icon: Speaker,
    },
    {
      name: "PhotoSonic",
      url: "/photosonic",
      icon: Image,
    },
    {
      name: "WriterX",
      url: "/writerx",
      icon: PenIcon,
    },
    {
      name: "AudioVerse",
      url: "/audioverse",
      icon: Map,
    },
    {
      name: "VideoVerse",
      url: "/videoverse",
      icon: Map,
    },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <WorkspaceSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <>insert custom loader here</>}
      </SidebarFooter>
    </Sidebar>
  );
}
