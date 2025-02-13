import React from "react";
import { cn } from "~/utils/utils";

interface XWPremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
  rounded?: "default" | "full";
  enableGlow?: boolean;
  className?: string;
  className2?: string;
}

const XWPremiumButton = ({
  children,
  size = "default",
  rounded = "default",
  className,
  className2,
  enableGlow = true,
  ...props
}: XWPremiumButtonProps) => {
  const sizeStyles = {
    default: "px-3 py-2",
    sm: "px-2 py-1 text-sm",
    lg: "px-4 py-3 text-lg",
    icon: "h-10 w-10",
  };

  const roundedStyles = {
    default: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        "inline-flex p-[0.8px]",
        roundedStyles[rounded],
        "w-fit bg-gradient-to-r from-white/20 via-white/30 to-white/70",
        enableGlow && "xw-premium",
        className,
      )}
    >
      <button
        className={cn(
          roundedStyles[rounded],
          sizeStyles[size],
          "inline-flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
          size === "icon" ? "p-0" : "px-3 py-2",
          className2,
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default XWPremiumButton;
