import { cn } from "@atomscraft/core";
import { forwardRef, useRef } from "react";
import type { HTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Button } from "../atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../molecules/card";
import { Message } from "../molecules/message";
import { PriceDisplay } from "../molecules/price-display";
import { PromptInput } from "../molecules/prompt-input";
import { useControllableState } from "../hooks";
import { useComposedRefs } from "../utils";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

export type RichTextEditorProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange"
> & {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  formatLabels: { bold: string; italic: string; bulletList: string };
};

/** Lightweight Markdown editor with selection-aware formatting actions. */
export const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
  function RichTextEditor(
    { label, value, defaultValue = "", onValueChange, formatLabels, className, ...props },
    forwardedRef,
  ) {
    const [text, setText] = useControllableState({ value, defaultValue, onChange: onValueChange });
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const ref = useComposedRefs(forwardedRef, internalRef);
    const apply = (marker: string, list = false) => {
      const control = internalRef.current;
      if (!control) return;
      const start = control.selectionStart;
      const end = control.selectionEnd;
      const selected = text.slice(start, end);
      const replacement = list
        ? selected
            .split("\n")
            .map((line) => `- ${line}`)
            .join("\n")
        : `${marker}${selected}${marker}`;
      const next = `${text.slice(0, start)}${replacement}${text.slice(end)}`;
      setText(next);
      requestAnimationFrame(() => {
        control.focus();
        const cursor = list
          ? start + replacement.length
          : start + marker.length + selected.length + marker.length;
        control.setSelectionRange(cursor, cursor);
      });
    };
    return (
      <div
        data-slot="rich-text-editor"
        data-format="markdown"
        className={cn("ac-rich-text-editor", className)}
      >
        <div role="toolbar" aria-label={label} className="ac-rich-text-editor__toolbar">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            tone="neutral"
            aria-label={formatLabels.bold}
            onClick={() => apply("**")}
          >
            B
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            tone="neutral"
            aria-label={formatLabels.italic}
            onClick={() => apply("_")}
          >
            I
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            tone="neutral"
            aria-label={formatLabels.bulletList}
            onClick={() => apply("", true)}
          >
            •
          </Button>
        </div>
        <textarea
          {...props}
          ref={ref}
          aria-label={label}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="ac-rich-text-editor__input"
        />
      </div>
    );
  },
);

export type ChatMessage = {
  id: string;
  body: ReactNode;
  author?: string;
  timestamp?: string;
  dateTime?: string;
  direction?: "incoming" | "outgoing";
};
export type ChatProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  messages: readonly ChatMessage[];
  inputLabel: string;
  submitLabel: string;
  onSend: (message: string) => void;
  emptyLabel: string;
};
export const Chat = forwardRef<HTMLDivElement, ChatProps>(function Chat(
  { label, messages, inputLabel, submitLabel, onSend, emptyLabel, className, ...props },
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      aria-label={label}
      data-slot="chat"
      className={cn("ac-chat", className)}
    >
      <div role="log" aria-label={label} aria-live="polite" className="ac-chat__messages">
        {messages.length ? (
          messages.map((message) => (
            <Message
              key={message.id}
              {...(message.author !== undefined ? { author: message.author } : {})}
              {...(message.timestamp !== undefined ? { timestamp: message.timestamp } : {})}
              {...(message.dateTime !== undefined ? { dateTime: message.dateTime } : {})}
              {...(message.direction !== undefined ? { direction: message.direction } : {})}
            >
              {message.body}
            </Message>
          ))
        ) : (
          <p className="ac-chat__empty">{emptyLabel}</p>
        )}
      </div>
      <PromptInput
        inputLabel={inputLabel}
        submitLabel={submitLabel}
        onSubmit={(message) => onSend(message)}
      />
    </section>
  );
});

export type NotificationItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  time?: string;
  dateTime?: string;
  read?: boolean;
};
export type NotificationCenterProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  notifications: readonly NotificationItem[];
  markReadLabel: string;
  dismissLabel: string;
  emptyLabel: string;
  onMarkRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
};
export const NotificationCenter = forwardRef<HTMLDivElement, NotificationCenterProps>(
  function NotificationCenter(
    {
      label,
      notifications,
      markReadLabel,
      dismissLabel,
      emptyLabel,
      onMarkRead,
      onDismiss,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <section
        {...props}
        ref={ref}
        aria-label={label}
        data-slot="notification-center"
        className={cn("ac-notification-center", className)}
      >
        {notifications.length ? (
          <ul className="ac-notification-center__list">
            {notifications.map((item) => (
              <li
                key={item.id}
                data-read={item.read || undefined}
                className="ac-notification-center__item"
              >
                <div className="ac-notification-center__copy">
                  <strong>
                    <bdi>{item.title}</bdi>
                  </strong>
                  {item.description && <p>{item.description}</p>}
                  {item.time && <time dateTime={item.dateTime}>{item.time}</time>}
                </div>
                <div className="ac-notification-center__actions">
                  {!item.read && onMarkRead && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      tone="neutral"
                      onClick={() => onMarkRead(item.id)}
                    >
                      {markReadLabel}
                    </Button>
                  )}
                  {onDismiss && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      tone="neutral"
                      onClick={() => onDismiss(item.id)}
                    >
                      {dismissLabel}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ac-notification-center__empty">{emptyLabel}</p>
        )}
      </section>
    );
  },
);

export type CommentItem = {
  id: string;
  author: string;
  body: ReactNode;
  timestamp?: string;
  dateTime?: string;
};
export type CommentsThreadProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  comments: readonly CommentItem[];
  inputLabel: string;
  submitLabel: string;
  emptyLabel: string;
  onAddComment: (comment: string) => void;
};
export const CommentsThread = forwardRef<HTMLDivElement, CommentsThreadProps>(
  function CommentsThread(
    { label, comments, inputLabel, submitLabel, emptyLabel, onAddComment, className, ...props },
    ref,
  ) {
    return (
      <section
        {...props}
        ref={ref}
        aria-label={label}
        data-slot="comments-thread"
        className={cn("ac-comments-thread", className)}
      >
        {comments.length ? (
          <div className="ac-comments-thread__list">
            {comments.map((comment) => (
              <Message
                key={comment.id}
                author={comment.author}
                {...(comment.timestamp !== undefined ? { timestamp: comment.timestamp } : {})}
                {...(comment.dateTime !== undefined ? { dateTime: comment.dateTime } : {})}
              >
                {comment.body}
              </Message>
            ))}
          </div>
        ) : (
          <p className="ac-comments-thread__empty">{emptyLabel}</p>
        )}
        <PromptInput
          inputLabel={inputLabel}
          submitLabel={submitLabel}
          onSubmit={(comment) => onAddComment(comment)}
        />
      </section>
    );
  },
);

export type ManagedFile = {
  id: string;
  name: string;
  kind: "file" | "folder";
  size?: string;
  modified?: string;
};
export type FileManagerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  items: readonly ManagedFile[];
  emptyLabel: string;
  openFolderLabel: string;
  downloadLabel: string;
  deleteLabel: string;
  onOpenFolder?: (id: string) => void;
  onSelect?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
};
export const FileManager = forwardRef<HTMLDivElement, FileManagerProps>(function FileManager(
  {
    label,
    items,
    emptyLabel,
    openFolderLabel,
    downloadLabel,
    deleteLabel,
    onOpenFolder,
    onSelect,
    onDownload,
    onDelete,
    className,
    ...props
  },
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      aria-label={label}
      data-slot="file-manager"
      className={cn("ac-file-manager", className)}
    >
      {items.length ? (
        <ul className="ac-file-manager__list">
          {items.map((item) => (
            <li key={item.id} className="ac-file-manager__item">
              <button
                type="button"
                className="ac-file-manager__select"
                onClick={() =>
                  item.kind === "folder" ? onOpenFolder?.(item.id) : onSelect?.(item.id)
                }
              >
                <span aria-hidden="true" className="ac-file-manager__icon">
                  {item.kind === "folder" ? "▰" : "▤"}
                </span>
                <span className="ac-file-manager__name">
                  <bdi>{item.name}</bdi>
                </span>
                <span className="ac-file-manager__meta">
                  {item.size}
                  {item.modified && <> · {item.modified}</>}
                </span>
              </button>
              <div className="ac-file-manager__actions">
                {item.kind === "folder" && onOpenFolder && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    tone="neutral"
                    aria-label={`${openFolderLabel}: ${item.name}`}
                    onClick={() => onOpenFolder(item.id)}
                  >
                    {openFolderLabel}
                  </Button>
                )}
                {item.kind === "file" && onDownload && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    tone="neutral"
                    aria-label={`${downloadLabel}: ${item.name}`}
                    onClick={() => onDownload(item.id)}
                  >
                    {downloadLabel}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    tone="danger"
                    aria-label={`${deleteLabel}: ${item.name}`}
                    onClick={() => onDelete(item.id)}
                  >
                    {deleteLabel}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ac-file-manager__empty">{emptyLabel}</p>
      )}
    </section>
  );
});

export type TourStep = { id: string; title: ReactNode; description: ReactNode };
export type OnboardingTourProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  steps: readonly TourStep[];
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  previousLabel: string;
  nextLabel: string;
  finishLabel: string;
  skipLabel: string;
  stepLabel: (step: number, total: number) => string;
  onComplete?: () => void;
  onSkip?: () => void;
};
export function OnboardingTour({
  open,
  defaultOpen = false,
  onOpenChange,
  steps,
  step,
  defaultStep = 0,
  onStepChange,
  previousLabel,
  nextLabel,
  finishLabel,
  skipLabel,
  stepLabel,
  onComplete,
  onSkip,
}: OnboardingTourProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [active, setActive] = useControllableState({
    value: step,
    defaultValue: defaultStep,
    onChange: onStepChange,
  });
  const currentIndex = Math.min(Math.max(active, 0), Math.max(steps.length - 1, 0));
  const current = steps[currentIndex];
  if (!current) return null;
  const last = currentIndex === steps.length - 1;
  const finish = () => {
    setOpen(false);
    onComplete?.();
  };
  const skip = () => {
    setOpen(false);
    onSkip?.();
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{current.title}</DialogTitle>
          <DialogDescription>{current.description}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <span
            aria-label={stepLabel(currentIndex + 1, steps.length)}
            className="ac-onboarding-tour__count"
          >
            {currentIndex + 1} / {steps.length}
          </span>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" tone="neutral" onClick={skip}>
            {skipLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            tone="neutral"
            disabled={currentIndex === 0}
            onClick={() => setActive(currentIndex - 1)}
          >
            {previousLabel}
          </Button>
          <Button type="button" onClick={() => (last ? finish() : setActive(currentIndex + 1))}>
            {last ? finishLabel : nextLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type PricingPlan = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  period?: string;
  description?: ReactNode;
  features: readonly ReactNode[];
  featured?: boolean;
};
export type PricingTableProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  plans: readonly PricingPlan[];
  actionLabel: string;
  periodLabel?: string;
  onSelectPlan?: (id: string) => void;
};
export const PricingTable = forwardRef<HTMLDivElement, PricingTableProps>(function PricingTable(
  { label, plans, actionLabel, periodLabel, onSelectPlan, className, ...props },
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      aria-label={label}
      data-slot="pricing-table"
      className={cn("ac-pricing-table", className)}
    >
      {plans.map((plan) => (
        <Card
          key={plan.id}
          data-featured={plan.featured || undefined}
          className="ac-pricing-table__plan"
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            {plan.description && <CardDescription>{plan.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="ac-pricing-table__price">
              <PriceDisplay amount={plan.amount} currency={plan.currency} />
              <span>{plan.period ?? periodLabel}</span>
            </div>
            <ul className="ac-pricing-table__features">
              {plan.features.map((feature, index) => (
                <li key={`${plan.id}-${index}`}>{feature}</li>
              ))}
            </ul>
            <Button type="button" block onClick={() => onSelectPlan?.(plan.id)}>
              {actionLabel}
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
});

export type FooterLink = { id: string; label: string; href: string };
export type FooterProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  label: string;
  brand?: ReactNode;
  links: readonly FooterLink[];
  copyright?: ReactNode;
};
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { label, brand, links, copyright, className, ...props },
  ref,
) {
  return (
    <footer
      {...props}
      ref={ref}
      aria-label={label}
      data-slot="footer"
      className={cn("ac-footer", className)}
    >
      {brand && <div className="ac-footer__brand">{brand}</div>}
      <nav aria-label={label}>
        <ul className="ac-footer__links">
          {links.map((link) => (
            <li key={link.id}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      {copyright && <small className="ac-footer__copyright">{copyright}</small>}
    </footer>
  );
});
