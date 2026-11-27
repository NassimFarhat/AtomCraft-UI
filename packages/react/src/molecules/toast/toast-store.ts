import { createStore } from "@atomscraft/core";
import type { ReactNode } from "react";
import type { Tone } from "../../types";

export type ToastAction = { label: string; onClick: () => void };

export type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  /** Shows a spinner in place of the tone icon and stays open by default. */
  loading?: boolean;
  /** A toast with an action stays until dismissed, so it can be reached (WCAG 2.2.1). */
  action?: ToastAction;
  /** Auto-dismiss delay in ms. `Infinity` keeps it open. */
  duration?: number;
  /** Hides the close button while leaving programmatic dismissal available. */
  dismissible?: boolean;
  /** Shows the remaining auto-dismiss time. Defaults to true for timed toasts. */
  progress?: boolean;
  onDismiss?: () => void;
};

export type ToastRecord = ToastOptions & { id: string; createdAt: number };
export type ToastPromiseContent = ReactNode | { title: ReactNode; description?: ReactNode };
export type ToastPromiseOptions<T> = {
  loading: ToastPromiseContent;
  success: ToastPromiseContent | ((value: T) => ToastPromiseContent);
  error: ToastPromiseContent | ((error: unknown) => ToastPromiseContent);
  duration?: number;
};

export const DEFAULT_TOAST_DURATION = 5000;

export const toastStore = createStore<ToastRecord[]>([]);

let counter = 0;

/** Shows a toast from anywhere (no hook needed). Returns its id. */
function show(title: ReactNode, options: Omit<ToastOptions, "title"> = {}): string {
  counter += 1;
  const id = `toast-${counter}`;
  toastStore.set((toasts) => [...toasts, { ...options, title, id, createdAt: Date.now() }]);
  return id;
}

const withTone =
  (tone: Tone) =>
  (title: ReactNode, options: Omit<ToastOptions, "title" | "tone" | "loading"> = {}) =>
    show(title, { ...options, tone });

function toastLoading(title: ReactNode, options: Omit<ToastOptions, "title" | "loading"> = {}) {
  return show(title, { ...options, loading: true, duration: options.duration ?? Infinity });
}

function toastUpdate(
  id: string,
  title: ReactNode,
  options: Partial<Omit<ToastOptions, "title">> = {},
) {
  toastStore.set((toasts) =>
    toasts.map((item) =>
      item.id === id ? { ...item, ...options, title, id, createdAt: Date.now() } : item,
    ),
  );
}

function dismiss(id?: string) {
  const current = toastStore.get();
  const dismissed = id ? current.filter((item) => item.id === id) : current;
  if (dismissed.length === 0) return;
  toastStore.set((toasts) => (id ? toasts.filter((item) => item.id !== id) : []));
  dismissed.forEach((item) => item.onDismiss?.());
}

function promiseToast<T>(promise: PromiseLike<T>, options: ToastPromiseOptions<T>): Promise<T> {
  const loadingContent = normalizePromiseContent(options.loading);
  const id = toastLoading(loadingContent.title, { description: loadingContent.description });

  return Promise.resolve(promise).then(
    (value) => {
      const successContent = normalizePromiseContent(
        typeof options.success === "function" ? options.success(value) : options.success,
      );
      toastUpdate(id, successContent.title, {
        description: successContent.description,
        tone: "success",
        loading: false,
        duration: options.duration ?? DEFAULT_TOAST_DURATION,
      });
      return value;
    },
    (error: unknown) => {
      const errorContent = normalizePromiseContent(
        typeof options.error === "function" ? options.error(error) : options.error,
      );
      toastUpdate(id, errorContent.title, {
        description: errorContent.description,
        tone: "danger",
        loading: false,
        duration: options.duration ?? DEFAULT_TOAST_DURATION,
      });
      throw error;
    },
  );
}

function normalizePromiseContent(content: ToastPromiseContent): {
  title: ReactNode;
  description?: ReactNode;
} {
  if (typeof content === "object" && content !== null && "title" in content) {
    return content as { title: ReactNode; description?: ReactNode };
  }
  return { title: content };
}

export const toast = Object.assign(show, {
  success: withTone("success"),
  info: withTone("info"),
  warning: withTone("warning"),
  error: withTone("danger"),
  loading: toastLoading,
  update: toastUpdate,
  promise: promiseToast,
  dismiss,
});
