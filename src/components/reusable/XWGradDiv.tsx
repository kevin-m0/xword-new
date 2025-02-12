import { cn } from "~/utils/utils";
import React from "react";

const XWGradDiv = ({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("xw-select rounded-lg", className)} {...props}>
      {children}
    </div>
  );
};

export default XWGradDiv;
