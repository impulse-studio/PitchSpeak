// AlignUI Notification v0.0.0

import * as NotificationPrimitives from "@radix-ui/react-toast";
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
  RiMagicFill,
} from "@remixicon/react";
import * as React from "react";

import * as Alert from "@/components/ui/alert";
import { cn } from "@/lib/utils/cn";

const NotificationProvider = NotificationPrimitives.Provider;
const NotificationAction = NotificationPrimitives.Action;

const NotificationViewport = React.forwardRef<
  React.ComponentRef<typeof NotificationPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Viewport>
>(({ className, ...rest }, forwardedRef) => (
  <NotificationPrimitives.Viewport
    className={cn(
      "fixed top-0 left-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-5 p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:left-auto sm:max-w-[438px] sm:flex-col sm:p-6",
      className
    )}
    ref={forwardedRef}
    {...rest}
  />
));
NotificationViewport.displayName = "NotificationViewport";

type NotificationProps = React.ComponentPropsWithoutRef<
  typeof NotificationPrimitives.Root
> &
  Pick<
    React.ComponentPropsWithoutRef<typeof Alert.Root>,
    "status" | "variant"
  > & {
    title?: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    disableDismiss?: boolean;
  };

const Notification = React.forwardRef<
  React.ComponentRef<typeof NotificationPrimitives.Root>,
  NotificationProps
>(
  (
    {
      className,
      status,
      variant = "filled",
      title,
      description,
      action,
      disableDismiss = false,
      ...rest
    }: NotificationProps,
    forwardedRef
  ) => {
    let Icon: React.ElementType;

    switch (status) {
      case "success":
        Icon = RiCheckboxCircleFill;
        break;
      case "warning":
        Icon = RiAlertFill;
        break;
      case "error":
        Icon = RiErrorWarningFill;
        break;
      case "information":
        Icon = RiInformationFill;
        break;
      case "feature":
        Icon = RiMagicFill;
        break;
      default:
        Icon = RiErrorWarningFill;
        break;
    }

    return (
      <NotificationPrimitives.Root
        asChild
        className={cn(
          // open
          "data-[state=open]:max-[639px]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-right-full data-[state=open]:animate-in",
          // close
          "data-[state=closed]:fade-out-80 data-[state=open]:max-[639px]:slide-out-to-top-full data-[state=closed]:sm:slide-out-to-right-full data-[state=closed]:animate-out",
          // swipe
          "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=end]:animate-out data-[swipe=move]:transition-none",
          className
        )}
        ref={forwardedRef}
        {...rest}
      >
        <Alert.Root size="large" status={status} variant={variant}>
          <Alert.Icon aria-hidden="true" as={Icon} />
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex w-full flex-col gap-1">
              {title && (
                <NotificationPrimitives.Title className="text-label-sm">
                  {title}
                </NotificationPrimitives.Title>
              )}
              {description && (
                <NotificationPrimitives.Description>
                  {description}
                </NotificationPrimitives.Description>
              )}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
          </div>
          {!disableDismiss && (
            <NotificationPrimitives.Close aria-label="Close">
              <Alert.CloseIcon />
            </NotificationPrimitives.Close>
          )}
        </Alert.Root>
      </NotificationPrimitives.Root>
    );
  }
);
Notification.displayName = "Notification";

export {
  Notification as Root,
  NotificationProvider as Provider,
  NotificationAction as Action,
  NotificationViewport as Viewport,
  type NotificationProps,
};
