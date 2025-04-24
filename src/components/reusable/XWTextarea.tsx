import * as React from "react";

import { cn } from "~/utils/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const XWTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "foucus:outline-none flex min-h-[80px] w-full resize-none rounded-lg border-none bg-xw-input px-3 py-2 outline-none placeholder:text-xw-muted focus:ring-1 focus:ring-xw-primary focus:ring-offset-transparent disabled:cursor-not-allowed disabled:bg-black/80",
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
