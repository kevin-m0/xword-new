"use client";

import { useAtom } from "jotai";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { FunctionComponent } from "react";
import { activeTabAtom } from "~/atoms/sidebar";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

type IconType = LucideIcon | FunctionComponent<{ className?: string }>;

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: IconType;
  }[];
}) {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-gray-400 text-sm px-4">
        Tools
      </SidebarGroupLabel>
      <SidebarMenu className="mt-2">
        {projects.map((item) => {
          const isActive = activeTab === item.url;
          return (
            <SidebarMenuItem key={item.name} className="text-white">
              <SidebarMenuButton asChild tooltip={item.name}>
                <Link
                  href={item.url}
                  className={`flex items-center gap-3 p-5 border-[#006FE8] transition-all
                    ${isActive ? "bg-gradient-to-r from-[#006FE8]/80 to-[#2670E900] !rounded-full border-l" : "hover:bg-gray-800"}
                  `}
                  onClick={() => setActiveTab(item.url)}
                >
                  <item.icon className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
