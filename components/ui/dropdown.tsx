// AlignUI Dropdown v0.0.0

"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { RiArrowRightSLine } from "@remixicon/react";
import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { PolymorphicComponentProps } from "@/lib/utils/polymorphic";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
const DropdownMenuArrow = DropdownMenuPrimitive.Arrow;

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      className={cn(
        "z-50 w-[300px] overflow-hidden rounded-2xl bg-bg-white-0 p-2 shadow-regular-md ring-1 ring-stroke-soft-200 ring-inset",
        "flex flex-col gap-1",
        // origin
        "data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left data-[side=top]:origin-bottom",
        // animation
        "data-[state=open]:fade-in-0 data-[state=open]:animate-in",
        "data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      ref={forwardedRef}
      sideOffset={sideOffset}
      {...rest}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      // base
      "group/item relative cursor-pointer select-none rounded-lg p-2 text-paragraph-sm text-text-strong-950 outline-none",
      "flex items-center gap-2",
      "transition duration-200 ease-out",
      // hover
      "data-[highlighted]:bg-bg-weak-50",
      // focus
      "focus:outline-none",
      // disabled
      "data-[disabled]:text-text-disabled-300",
      inset && "pl-9",
      className
    )}
    ref={forwardedRef}
    {...rest}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

function DropdownItemIcon<T extends React.ElementType>({
  className,
  as,
  ...rest
}: PolymorphicComponentProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        // base
        "size-5 text-text-sub-600",
        // disabled
        "group-has-[[data-disabled]]:text-text-disabled-300",
        className
      )}
      {...rest}
    />
  );
}
DropdownItemIcon.displayName = "DropdownItemIcon";

const DropdownMenuGroup = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>
>(({ className, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Group
    className={cn("flex flex-col gap-1", className)}
    ref={forwardedRef}
    {...rest}
  />
));
DropdownMenuGroup.displayName = "DropdownMenuGroup";

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.Label
    className={cn(
      "px-2 py-1 text-subheading-xs text-text-soft-400 uppercase",
      className
    )}
    ref={forwardedRef}
    {...rest}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      // base
      "group/item relative cursor-pointer select-none rounded-lg p-2 text-paragraph-sm text-text-strong-950 outline-0",
      "flex items-center gap-2",
      "transition duration-200 ease-out",
      // hover
      "data-[highlighted]:bg-bg-weak-50",
      // disabled
      "data-[disabled]:text-text-disabled-300",
      inset && "pl-9",
      className
    )}
    ref={forwardedRef}
    {...rest}
  >
    {children}
    <span className="flex-1" />
    <DropdownItemIcon as={RiArrowRightSLine} />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...rest }, forwardedRef) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(
      "z-50 w-max overflow-hidden rounded-2xl bg-bg-white-0 p-2 shadow-regular-md ring-1 ring-stroke-soft-200 ring-inset",
      "flex flex-col gap-1",
      // animation
      "data-[state=open]:fade-in-0 data-[state=open]:animate-in",
      "data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    ref={forwardedRef}
    {...rest}
  />
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export {
  DropdownMenu as Root,
  DropdownMenuPortal as Portal,
  DropdownMenuTrigger as Trigger,
  DropdownMenuContent as Content,
  DropdownMenuItem as Item,
  DropdownItemIcon as ItemIcon,
  DropdownMenuGroup as Group,
  DropdownMenuLabel as Label,
  DropdownMenuSub as MenuSub,
  DropdownMenuSubTrigger as MenuSubTrigger,
  DropdownMenuSubContent as MenuSubContent,
  DropdownMenuCheckboxItem as CheckboxItem,
  DropdownMenuRadioGroup as RadioGroup,
  DropdownMenuRadioItem as RadioItem,
  DropdownMenuSeparator as Separator,
  DropdownMenuArrow as Arrow,
};
