import { cn } from "~/utils/utils";
import React from "react";

interface XWSidebarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
const XWSidebarButton = ({
  children,
  className,
  ...props
}: XWSidebarButtonProps) => {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-full bg-transparent px-3 py-2 text-sm",
        `hover:border-l-xw-primary hover:border-l`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default XWSidebarButton;
