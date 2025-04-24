import React from "react";
import { cn } from "~/utils/utils";

interface XWBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const XWBadge = ({ children, className, ...props }: XWBadgeProps) => {
  return (
    <div
      className={cn(
        `text-xw-muted bg-xw-card flex h-full w-fit items-center justify-center gap-2 rounded-md px-3 py-1 text-xs ring-0`,
        className,
        { ...props },
      )}
    >
      {children}
    </div>
  );
};

export default XWBadge;
