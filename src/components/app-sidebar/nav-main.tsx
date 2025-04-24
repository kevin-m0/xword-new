"use client";

import { useAtom } from "jotai";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { FunctionComponent } from "react";
import { activeTabAtom } from "~/atoms/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";

type IconType = LucideIcon | FunctionComponent<{ className?: string }>;

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: IconType;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-gray-400 text-sm px-4">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="mt-2">
        {items.map((item) => {
          const isActive = activeTab === item.url;
          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem className="text-white">
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link
                    href={item.url}
                    className={`flex items-center gap-3 p-5 !rounded-full transition-all
                      ${
                        isActive
                          ? "bg-gradient-to-r from-[#006FE8] to-[#2670E900]"
                          : "hover:bg-gray-800"
                      }
                    `}
                    onClick={() => setActiveTab(item.url)}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url}
                                className="text-gray-300 hover:text-white"
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
