import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Button, IconButton } from "../../atoms/button";
import { Spinner } from "../../atoms/spinner";
import { IconCircleAlert, IconCircleCheck, IconInfo, IconTriangleAlert, IconX } from "../../icons";
import { useMessages } from "../../provider";
import type { Tone } from "../../types";
import type { ToastAction } from "./toast-store";

const ICONS: Partial<Record<Tone, typeof IconInfo>> = {
  info: IconInfo,
  success: IconCircleCheck,
  warning: IconTriangleAlert,
  danger: IconCircleAlert,
};

export type ToastProps = Omit<HTMLAttributes<HTMLLIElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode | undefined;
  tone?: Tone | undefined;
  loading?: boolean | undefined;
  action?: ToastAction | undefined;
  dismissible?: boolean | undefined;
  dismissLabel?: string | undefined;
  onDismiss?: (() => void) | undefined;
  progress?: boolean | undefined;
  duration?: number | undefined;
  progressKey?: string | number | undefined;
  paused?: boolean | undefined;
};

function ToastIcon({ loading, tone }: { loading: boolean; tone: Tone }) {
  if (loading) return <Spinner size="sm" label="" className="ac-toast__loading" />;
  const ToneIcon = ICONS[tone];
  return ToneIcon ? <ToneIcon className="ac-toast__icon" /> : null;
}

function ToastBody({
  title,
  description,
}: {
  title: ReactNode;
  description: ReactNode | undefined;
}) {
  return (
    <div className="ac-toast__body">
      <p className="ac-toast__title">
        <bdi>{title}</bdi>
      </p>
      {description && (
        <p className="ac-toast__description">
          <bdi>{description}</bdi>
        </p>
      )}
    </div>
  );
}

function ToastActionButton({ action }: { action: ToastAction }) {
  return (
    <Button size="sm" variant="outline" tone="neutral" onClick={action.onClick}>
      <bdi>{action.label}</bdi>
    </Button>
  );
}

function ToastDismissButton({
  dismissible,
  label,
  onDismiss,
}: {
  dismissible: boolean;
  label: string;
  onDismiss: (() => void) | undefined;
}) {
  if (!dismissible || !onDismiss) return null;
  return (
    <IconButton label={label} size="xs" className="ac-toast__close" onClick={onDismiss}>
      <IconX />
    </IconButton>
  );
}

function ToastProgress({
  progress,
  duration,
  progressKey,
}: {
  progress: boolean | undefined;
  duration: number | undefined;
  progressKey: string | number | undefined;
}) {
  if (progress === false || duration === undefined || !Number.isFinite(duration) || duration <= 0)
    return null;
  const style = { "--_toast-duration": `${duration}ms` } as CSSProperties;
  return <span key={progressKey} aria-hidden="true" className="ac-toast__progress" style={style} />;
}

/** Presentational toast surface. Queueing, timing and dismissal policy belong to `Toaster`. */
export const Toast = forwardRef<HTMLLIElement, ToastProps>(function Toast(
  {
    title,
    description,
    tone = "neutral",
    loading = false,
    action,
    dismissible = true,
    dismissLabel,
    onDismiss,
    progress,
    duration,
    progressKey,
    paused = false,
    className,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  return (
    <li
      {...props}
      ref={ref}
      className={cn("ac-toast", className)}
      data-slot="toast"
      data-tone={tone}
      data-loading={loading || undefined}
      data-paused={paused || undefined}
      role={tone === "danger" ? "alert" : "status"}
      aria-atomic="true"
    >
      <ToastIcon loading={loading} tone={tone} />
      <ToastBody title={title} description={description} />
      {action && <ToastActionButton action={action} />}
      <ToastDismissButton
        dismissible={dismissible}
        label={dismissLabel ?? messages.dismiss}
        onDismiss={onDismiss}
      />
      <ToastProgress progress={progress} duration={duration} progressKey={progressKey} />
    </li>
  );
});
