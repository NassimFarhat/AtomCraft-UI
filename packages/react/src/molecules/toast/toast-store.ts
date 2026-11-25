import { createStore } from "@atomcraft/core";
import type { ReactNode } from "react";
import type { Tone } from "../../types";

export type ToastAction = { label: string; onClick: () => void };

export type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  /** A toast with an action stays until dismissed, so it can be reached (WCAG 2.2.1). */
  action?: ToastAction;
  /** Auto-dismiss delay in ms. `Infinity` keeps it open. */
  duration?: number;
};

export type ToastRecord = ToastOptions & { id: string; createdAt: number };

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
  (title: ReactNode, options: Omit<ToastOptions, "title" | "tone"> = {}) =>
    show(title, { ...options, tone });

export const toast = Object.assign(show, {
  success: withTone("success"),
  info: withTone("info"),
  warning: withTone("warning"),
  error: withTone("danger"),
  dismiss(id?: string) {
    toastStore.set((toasts) => (id ? toasts.filter((item) => item.id !== id) : []));
  },
});
