import { cn } from "@atomcraft/core";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Button, IconButton } from "../../atoms/button";
import { IconCircleAlert, IconCircleCheck, IconInfo, IconTriangleAlert, IconX } from "../../icons";
import { useMessages } from "../../provider";
import type { Tone } from "../../types";
import { Portal } from "../../utils";
import { DEFAULT_TOAST_DURATION, toast, toastStore } from "./toast-store";
import type { ToastRecord } from "./toast-store";

const ICONS: Partial<Record<Tone, typeof IconInfo>> = {
  info: IconInfo,
  success: IconCircleCheck,
  warning: IconTriangleAlert,
  danger: IconCircleAlert,
};

function ToastItem({ item }: { item: ToastRecord }) {
  const messages = useMessages();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tone = item.tone ?? "neutral";
  const Icon = ICONS[tone];
  const duration = item.action ? Infinity : (item.duration ?? DEFAULT_TOAST_DURATION);

  const start = () => {
    if (Number.isFinite(duration))
      timer.current = setTimeout(() => toast.dismiss(item.id), duration);
  };
  const pause = () => clearTimeout(timer.current);

  useEffect(() => {
    start();
    return pause;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the timer starts once per toast
  }, []);

  return (
    <li
      className="ac-toast"
      data-slot="toast"
      data-tone={tone}
      role={tone === "danger" ? "alert" : "status"}
      onPointerEnter={pause}
      onPointerLeave={start}
      onFocus={pause}
      onBlur={start}
    >
      {Icon && <Icon className="ac-toast__icon" />}
      <div className="ac-toast__body">
        <p className="ac-toast__title">{item.title}</p>
        {item.description && <p className="ac-toast__description">{item.description}</p>}
      </div>
      {item.action && (
        <Button size="sm" variant="outline" tone="neutral" onClick={item.action.onClick}>
          {item.action.label}
        </Button>
      )}
      <IconButton
        label={messages.dismiss}
        size="xs"
        className="ac-toast__close"
        onClick={() => toast.dismiss(item.id)}
      >
        <IconX />
      </IconButton>
    </li>
  );
}

export type ToasterProps = {
  position?:
    "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end";
  className?: string;
};

/** Renders the toasts queued with `toast()`. Mount it once, near the root. */
export function Toaster({ position = "bottom-end", className }: ToasterProps) {
  const messages = useMessages();
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.get, toastStore.get);
  return (
    <Portal>
      <section
        aria-label={messages.notifications}
        className={cn("ac-toaster", className)}
        data-position={position}
      >
        <ol className="ac-toaster__list">
          {toasts.map((item) => (
            <ToastItem key={item.id} item={item} />
          ))}
        </ol>
      </section>
    </Portal>
  );
}
