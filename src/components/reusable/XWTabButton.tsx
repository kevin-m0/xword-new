"use client";

import Image from "next/image";
import { cn } from "~/utils/utils";

interface XWTabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const XWTabButton = ({ isActive, onClick, icon, label }: XWTabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full text-sm transition-all duration-200",
        "hover:text-white",
        isActive
          ? "bg-gradient-to-r from-white/10 via-white/30 to-white/40 p-[0.8px]"
          : "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center gap-2 rounded-full px-3 py-2",
          isActive && "bg-xw-background",
        )}
      >
        <Image src={icon} height={15} width={15} alt={label} />
        {label}
      </span>
    </button>
  );
};

export default XWTabButton;
