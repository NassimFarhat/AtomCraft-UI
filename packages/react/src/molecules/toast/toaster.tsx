import { cn } from "@atomscraft/core";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FocusEvent } from "react";
import { useMessages } from "../../provider";
import { Portal } from "../../utils";
import { DEFAULT_TOAST_DURATION, toast, toastStore } from "./toast-store";
import { Toast } from "./toast";
import type { ToastRecord } from "./toast-store";

type ToastItemProps = {
  item: ToastRecord;
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
};

function useToastTimer({ item, pauseOnHover, pauseOnFocus }: ToastItemProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const startedAt = useRef(0);
  const remaining = useRef(0);
  const pauseReasons = useRef(new Set<string>());
  const [paused, setPaused] = useState(false);
  const duration = item.action
    ? Infinity
    : (item.duration ?? (item.loading ? Infinity : DEFAULT_TOAST_DURATION));

  const startTimer = useCallback(() => {
    if (!Number.isFinite(duration) || pauseReasons.current.size > 0) return;
    clearTimeout(timer.current);
    startedAt.current = Date.now();
    timer.current = setTimeout(() => toast.dismiss(item.id), Math.max(remaining.current, 0));
  }, [duration, item.id]);

  const pause = useCallback(
    (reason: string) => {
      if (pauseReasons.current.has(reason)) return;
      if (pauseReasons.current.size === 0 && Number.isFinite(duration)) {
        clearTimeout(timer.current);
        remaining.current = Math.max(remaining.current - (Date.now() - startedAt.current), 0);
      }
      pauseReasons.current.add(reason);
      setPaused(true);
    },
    [duration],
  );

  const resume = useCallback(
    (reason: string) => {
      if (!pauseReasons.current.delete(reason)) return;
      if (pauseReasons.current.size === 0) {
        setPaused(false);
        startTimer();
      }
    },
    [startTimer],
  );

  useEffect(() => {
    remaining.current = duration;
    if (pauseReasons.current.size === 0) startTimer();
    return () => clearTimeout(timer.current);
  }, [duration, item.createdAt, startTimer]);

  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) resume("focus");
  };

  return {
    duration,
    paused,
    onPointerEnter: pauseOnHover ? () => pause("pointer") : undefined,
    onPointerLeave: pauseOnHover ? () => resume("pointer") : undefined,
    onFocus: pauseOnFocus ? () => pause("focus") : undefined,
    onBlur: pauseOnFocus ? onBlur : undefined,
  };
}

function ToastItem({ item, pauseOnHover, pauseOnFocus }: ToastItemProps) {
  const timer = useToastTimer({ item, pauseOnHover, pauseOnFocus });
  return (
    <Toast
      title={item.title}
      description={item.description}
      tone={item.tone ?? "neutral"}
      loading={item.loading}
      action={item.action}
      dismissible={item.dismissible}
      onDismiss={() => toast.dismiss(item.id)}
      progress={item.progress}
      duration={timer.duration}
      progressKey={item.createdAt}
      paused={timer.paused}
      onPointerEnter={timer.onPointerEnter}
      onPointerLeave={timer.onPointerLeave}
      onFocus={timer.onFocus}
      onBlur={timer.onBlur}
    />
  );
}

export type ToasterProps = {
  position?:
    "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end";
  className?: string;
  /** Maximum number of most recent toasts kept visible. Defaults to five. */
  limit?: number;
  /** Places new toasts first in the stack. Defaults to false. */
  newestOnTop?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
};

function visibleToasts(toasts: ToastRecord[], limit: number, newestOnTop: boolean) {
  const visibleCount = Number.isFinite(limit) ? Math.max(0, Math.trunc(limit)) : Infinity;
  const visible = visibleCount === 0 ? [] : toasts.slice(-visibleCount);
  return newestOnTop ? visible.reverse() : visible;
}

/** Renders the toasts queued with `toast()`. Mount it once, near the root. */
export function Toaster({
  position = "bottom-end",
  className,
  limit = 5,
  newestOnTop = false,
  pauseOnHover = true,
  pauseOnFocus = true,
}: ToasterProps) {
  const messages = useMessages();
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.get, toastStore.get);
  const visible = visibleToasts(toasts, limit, newestOnTop);
  return (
    <Portal>
      <section
        aria-label={messages.notifications}
        className={cn("ac-toaster", className)}
        data-position={position}
        data-newest-on-top={newestOnTop || undefined}
      >
        <ol className="ac-toaster__list">
          {visible.map((item) => (
            <ToastItem
              key={item.id}
              item={item}
              pauseOnHover={pauseOnHover}
              pauseOnFocus={pauseOnFocus}
            />
          ))}
        </ol>
      </section>
    </Portal>
  );
}
