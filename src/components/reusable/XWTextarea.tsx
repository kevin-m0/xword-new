import * as React from "react";

import { cn } from "~/utils/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const XWTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border-xw-border foucus:outline-none bg-xw-input focus:ring-xw-primary placeholder:text-xw-muted flex min-h-[80px] w-full resize-none rounded-lg border px-3 py-2 outline-none focus:ring-1 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:bg-black/80",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
XWTextarea.displayName = "Textarea";

export { XWTextarea };
