"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "~/utils/utils";

const XWRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
XWRadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const XWRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "text-xw-primary aspect-square h-4 w-4 rounded-full border border-white",
        "focus-visible:ring-xw-primary focus:border-xw-primary focus:outline-none focus-visible:ring-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="bg-xw-primary h-2 w-2 rounded-full" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
XWRadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Optional: Create a wrapper for radio item with label
interface XWRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string;
}

const XWRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  XWRadioItemProps
>(({ className, label, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <XWRadioGroupItem ref={ref} {...props} />
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
});
XWRadioItem.displayName = "XWRadioItem";

export { XWRadioGroup, XWRadioGroupItem, XWRadioItem };

// Usage Example:
/*
const Example = () => {
    return (
        <XWRadioGroup defaultValue="option1">
            <XWRadioItem
                value="option1"
                id="option1"
                label="Option 1"
            />
            <XWRadioItem
                value="option2"
                id="option2"
                label="Option 2"
            />
        </XWRadioGroup>
    );
};
*/
