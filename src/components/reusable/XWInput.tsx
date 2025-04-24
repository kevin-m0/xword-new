import * as React from "react";
import { cn } from "~/utils/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  borderFlag?: boolean; // Optional boolean prop
}

const XWInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "border-xw-border bg-xw-input foucus:outline-none focus:ring-xw-primary placeholder:text-xw-muted flex w-full flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-1 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:bg-black/80",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
XWInput.displayName = "Input";

export { XWInput };
