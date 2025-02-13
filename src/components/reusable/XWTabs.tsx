"use client";

import { Button } from "~/components/ui/button";
import { cn } from "~/utils/utils";
import Image from "next/image";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface XWTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

const XWTabs = ({ tabs, activeTab, onChange, className }: XWTabsProps) => {
  return (
    <div className={cn("bg-xw-card flex gap-1 rounded-xl p-1", className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="gap-2 transition-all duration-100"
          variant={activeTab === tab.id ? "default" : "ghost"}
        >
          {tab.icon && (
            <Image src={tab.icon} height={16} width={16} alt={tab.label} />
          )}
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default XWTabs;
