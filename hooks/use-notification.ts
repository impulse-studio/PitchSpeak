"use client";

import { useEffect, useState } from "react";

import type { NotificationProps } from "@/components/ui/notification";

const NOTIFICATION_LIMIT = 1;
const NOTIFICATION_REMOVE_DELAY = 1_000_000;

type NotificationPropsWithId = NotificationProps & {
  id: string;
};

type ActionType = {
  readonly ADD_NOTIFICATION: "ADD_NOTIFICATION";
  readonly UPDATE_NOTIFICATION: "UPDATE_NOTIFICATION";
  readonly DISMISS_NOTIFICATION: "DISMISS_NOTIFICATION";
  readonly REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION";
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      type: ActionType["ADD_NOTIFICATION"];
      notification: NotificationPropsWithId;
    }
  | {
      type: ActionType["UPDATE_NOTIFICATION"];
      notification: Partial<NotificationPropsWithId>;
    }
  | {
      type: ActionType["DISMISS_NOTIFICATION"];
      notificationId?: NotificationPropsWithId["id"];
    }
  | {
      type: ActionType["REMOVE_NOTIFICATION"];
      notificationId?: NotificationPropsWithId["id"];
    };

interface State {
  notifications: NotificationPropsWithId[];
}

const notificationTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (notificationId: string) => {
  if (notificationTimeouts.has(notificationId)) {
    return;
  }

  const timeout = setTimeout(() => {
    notificationTimeouts.delete(notificationId);
    dispatch({
      type: "REMOVE_NOTIFICATION",
      notificationId,
    });
  }, NOTIFICATION_REMOVE_DELAY);

  notificationTimeouts.set(notificationId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.notification, ...state.notifications].slice(
          0,
          NOTIFICATION_LIMIT
        ),
      };

    case "UPDATE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.map((t) =>
          t.id === action.notification.id ? { ...t, ...action.notification } : t
        ),
      };

    case "DISMISS_NOTIFICATION": {
      const { notificationId } = action;

      if (notificationId) {
        addToRemoveQueue(notificationId);
      } else {
        for (const notification of state.notifications) {
          addToRemoveQueue(notification.id);
        }
      }

      return {
        ...state,
        notifications: state.notifications.map((t) =>
          t.id === notificationId || notificationId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_NOTIFICATION":
      if (action.notificationId === undefined) {
        return {
          ...state,
          notifications: [],
        };
      }
      return {
        ...state,
        notifications: state.notifications.filter(
          (t) => t.id !== action.notificationId
        ),
      };
    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { notifications: [] };

function dispatch(action: Action) {
  if (action.type === "ADD_NOTIFICATION") {
    const notificationExists = memoryState.notifications.some(
      (t) => t.id === action.notification.id
    );
    if (notificationExists) {
      return;
    }
  }
  memoryState = reducer(memoryState, action);
  for (const listener of listeners) {
    listener(memoryState);
  }
}

type Notification = Omit<NotificationPropsWithId, "id">;

function notification({ ...props }: Notification & { id?: string }) {
  const id = props?.id || genId();

  const update = (props: Notification) =>
    dispatch({
      type: "UPDATE_NOTIFICATION",
      notification: { ...props, id },
    });
  const dismiss = () =>
    dispatch({ type: "DISMISS_NOTIFICATION", notificationId: id });

  dispatch({
    type: "ADD_NOTIFICATION",
    notification: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) {
          dismiss();
        }
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useNotification() {
  const [state, setState] = useState<State>(memoryState);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Force re-render on state change
  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    notification,
    dismiss: (notificationId?: string) =>
      dispatch({ type: "DISMISS_NOTIFICATION", notificationId }),
  };
}

export { notification, useNotification };
