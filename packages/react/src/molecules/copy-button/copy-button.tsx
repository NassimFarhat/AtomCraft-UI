import { copyText } from "@atomscraft/core";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Button, IconButton } from "../../atoms/button";
import type { ButtonProps } from "../../atoms/button";
import { IconCheck, IconCopy } from "../../icons";
import { useMessages } from "../../provider";
import { VisuallyHidden } from "../../utils";

/** How long the confirmation stays, in line with other transient feedback. */
const FEEDBACK_MS = 2000;

type CopyState = "idle" | "copied" | "error";

export type CopyButtonProps = Omit<ButtonProps, "children" | "onClick"> & {
  /** Text put on the clipboard. */
  value: string;
  /** Visible text. Without it the button is icon-only. */
  children?: ReactNode;
  /** Accessible name while idle. */
  label?: string;
  copiedLabel?: string;
};

/** Copies and resets itself, so the button reflects what just happened. */
function useCopyState(value: string) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return undefined;
    const timer = setTimeout(() => setState("idle"), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [state]);

  return {
    state,
    copy: () => {
      void copyText(value).then((copied) => setState(copied ? "copied" : "error"));
    },
  };
}

/** The words for each state, so the button and the announcement agree. */
function useCopyLabels(label: string | undefined, copiedLabel: string | undefined) {
  const messages = useMessages();
  return {
    idle: label ?? messages.copy,
    copied: copiedLabel ?? messages.copied,
    error: messages.copyFailed,
  };
}

/** Copies text and confirms it, announcing the result to assistive technologies. */
export function CopyButton({
  value,
  children,
  label,
  copiedLabel,
  variant = "ghost",
  tone = "neutral",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const { state, copy } = useCopyState(value);
  const labels = useCopyLabels(label, copiedLabel);
  const done = state === "copied";
  const shared = { ...props, variant, tone, size, "data-state": state, onClick: copy };
  const icon = done ? <IconCheck /> : <IconCopy />;

  return (
    <>
      {children === undefined ? (
        <IconButton {...shared} label={done ? labels.copied : labels.idle}>
          {icon}
        </IconButton>
      ) : (
        <Button {...shared}>
          {icon}
          {children}
        </Button>
      )}
      <VisuallyHidden role="status" aria-live="polite">
        {state === "idle" ? "" : labels[state]}
      </VisuallyHidden>
    </>
  );
}
