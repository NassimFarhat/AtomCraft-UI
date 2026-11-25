import { cn } from "@atomcraft/core";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes } from "react";
import { IconExternalLink } from "../../icons";
import { useMessages } from "../../provider";
import { Slot } from "../../utils";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tone?: "primary" | "neutral";
  underline?: "hover" | "always" | "none";
  /** Opens in a new tab, safely, and says so to assistive technologies. */
  external?: boolean;
  /** Renders a router link (Next.js, React Router) with these styles. */
  asChild?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    tone = "primary",
    underline = "hover",
    external = false,
    asChild = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const messages = useMessages();
  const shared = {
    ...props,
    "data-slot": "link",
    "data-tone": tone,
    "data-underline": underline,
    className: cn("ac-link", className),
  };
  if (asChild) {
    return (
      <Slot {...shared} ref={ref}>
        {children}
      </Slot>
    );
  }
  return (
    <a
      {...shared}
      ref={ref}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external && (
        <>
          <IconExternalLink className="ac-link__external" />
          <span className="ac-visually-hidden"> {messages.opensInNewTab}</span>
        </>
      )}
    </a>
  );
});
