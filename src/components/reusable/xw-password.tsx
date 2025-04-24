"use client";

import * as React from "react";
import { cn } from "~/utils/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "~/components/ui/button";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  borderFlag?: boolean;
}

const XWPassword = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowPassword(!showPassword);
    };

    return (
      <div className="xw-gradient-primary-border relative flex rounded-lg">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "focus:ring-xw-primary bg-xw-background placeholder:text-xw-muted textOutline flex w-full flex-1 rounded-lg border-none px-3 py-2 pr-10 outline-none focus:outline-none focus:ring-1 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePassword}
        >
          {showPassword ? (
            <EyeOff className="text-xw-muted h-4 w-4" />
          ) : (
            <Eye className="text-xw-muted h-4 w-4" />
          )}
        </Button>
      </div>
    );
  },
);
XWPassword.displayName = "XWPassword";

export { XWPassword };
