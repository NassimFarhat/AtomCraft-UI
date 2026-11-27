import { cn } from "@atomscraft/core";
import type { HTMLAttributes, ReactNode } from "react";

export type MessageProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  author?: string;
  timestamp?: string;
  dateTime?: string;
  direction?: "incoming" | "outgoing";
};

/** Conversation message with optional author and machine-readable timestamp. */
export function Message({
  children,
  author,
  timestamp,
  dateTime,
  direction = "incoming",
  className,
  ...props
}: MessageProps) {
  return (
    <article
      {...props}
      data-slot="message"
      data-direction={direction}
      className={cn("ac-message", className)}
    >
      {(author || timestamp) && (
        <header className="ac-message__meta">
          {author && <bdi className="ac-message__author">{author}</bdi>}
          {timestamp && (
            <time className="ac-message__time" dateTime={dateTime}>
              {timestamp}
            </time>
          )}
        </header>
      )}
      <div data-slot="message-content" className="ac-message__content">
        {children}
      </div>
    </article>
  );
}
