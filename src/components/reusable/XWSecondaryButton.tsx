import { cn } from "~/utils/utils";
import React from "react";

interface XWSecondaryButton extends React.HTMLAttributes<HTMLButtonElement> {
  size?: "default" | "sm" | "lg" | "icon" | "icon_sm";
  className1?: string;
  className2?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  rounded?: "md" | "lg" | "full";
}

const XWSecondaryButton = ({
  children,
  disabled,
  className1,
  className2,
  size = "default",
  type = "button",
  rounded = "lg",
  ...props
}: XWSecondaryButton) => {
  const sizeClasses = {
    default: "py-2 px-4 text-sm",
    sm: "px-2 py-2 text-sm",
    lg: "px-8 py-4",
    icon: " w-10",
    icon_sm: "h-8 w-8",
  };

  return (
    <button
      className={cn(
        "from-xw-border focus:ring-xw-primary flex h-9 cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-tr via-white/30 to-white/40 p-[0.8px] focus:ring-1 focus:ring-offset-transparent",
        rounded === "md"
          ? "rounded-md"
          : rounded === "full"
            ? "rounded-full"
            : "rounded-lg",
        className1,
        size === "sm"
          ? "h-8"
          : size === "lg"
            ? "h-11"
            : size === "icon"
              ? "h-9 w-9"
              : size === "icon_sm"
                ? "h-8 w-8"
                : "h-9",
      )}
      disabled={disabled}
      type={type}
      {...props}
    >
      <span
        className={cn(
          `bg-xw-secondary hover:bg-xw-secondary-hover disabled:bg-xw-sidebar flex h-full flex-1 items-center justify-center gap-2 text-white ${sizeClasses[size]}`,
          rounded === "md"
            ? "rounded-md"
            : rounded === "full"
              ? "rounded-full"
              : "rounded-lg",
          className2,
          disabled ? "text-xw-muted" : "",
        )}
      >
        {children}
      </span>
    </button>
  );
};

export default XWSecondaryButton;
