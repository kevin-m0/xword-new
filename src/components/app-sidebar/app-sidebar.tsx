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
import { AudiosonicSidebarIcon, ChatsonicSidebarIcon, PhotosonicSidebarIcon } from "~/icons/Figma";
import ChatSonicIcon from "~/icons/SidebarIcons/ChatSonicIcon";
import SoundVerseIcon from "~/icons/SidebarIcons/SoundVerseIcon";
import PhotoSonicIcon from "~/icons/SidebarIcons/PhotoSonicIcon";
import WriterXIcon from "~/icons/SidebarIcons/WriterXIcon";
import AudioVerseIcon from "~/icons/SidebarIcons/AudioVerseIcon";
import VideoVerseIcon from "~/icons/SidebarIcons/VideoVerseIcon";
import HomeIcon from "~/icons/SidebarIcons/HomeIcon";
import MediaLibraryIcon from "~/icons/SidebarIcons/MediaLibraryIcon";
import CalendarIcon from "~/icons/SidebarIcons/CalendarIcon";
import SocialAccountIcon from "~/icons/SidebarIcons/SocialAccountIcon";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: "Media Library",
      url: "/media-library",
      icon: MediaLibraryIcon,
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
      icon: CalendarIcon,
    },
    {
      title: "Social Accounts",
      url: "/social-accounts",
      icon: SocialAccountIcon,
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
      icon: ChatSonicIcon,
    },
    {
      name: "SoundVerse",
      url: "/soundverse",
      icon: SoundVerseIcon,
    },
    {
      name: "PhotoSonic",
      url: "/photosonic",
      icon: PhotoSonicIcon,
    },
    {
      name: "WriterX",
      url: "/writerx",
      icon: WriterXIcon,
    },
    {
      name: "AudioVerse",
      url: "/audioverse",
      icon: AudioVerseIcon,
    },
    {
      name: "VideoVerse",
      url: "/videoverse",
      icon: VideoVerseIcon,
    },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" className="bg-[#000000]" variant="sidebar" {...props}>
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
