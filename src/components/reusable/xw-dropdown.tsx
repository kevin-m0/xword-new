"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "~/utils/utils";

interface XWDropdownProps {
  children: React.ReactNode;
}

const XWDropdown = ({ children }: XWDropdownProps) => {
  return <DropdownMenuPrimitive.Root>{children}</DropdownMenuPrimitive.Root>;
};

const XWDropdownTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={cn("cursor-pointer", className)}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Trigger>
));
XWDropdownTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

const XWDropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "bg-xw-sidebar-two z-50 min-w-[6rem] overflow-hidden rounded-lg p-1 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    >
      {props.children}
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
));
XWDropdownContent.displayName = DropdownMenuPrimitive.Content.displayName;

const XWDropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "hover:bg-xw-secondary relative flex w-full cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    {props.children}
  </DropdownMenuPrimitive.Item>
));
XWDropdownItem.displayName = DropdownMenuPrimitive.Item.displayName;

export { XWDropdown, XWDropdownTrigger, XWDropdownContent, XWDropdownItem };
