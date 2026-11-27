import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export type ListItemProps = HTMLAttributes<HTMLLIElement> & {
  leading?: ReactNode;
  trailing?: ReactNode;
  description?: ReactNode;
  selected?: boolean;
};

/** Flexible list row with named leading, text and trailing areas. */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { leading, trailing, description, selected = false, className, children, ...props },
  ref,
) {
  return (
    <li
      {...props}
      ref={ref}
      data-slot="list-item"
      data-selected={selected || undefined}
      className={cn("ac-list-item", className)}
    >
      {leading && (
        <span data-slot="list-item-leading" className="ac-list-item__leading">
          {leading}
        </span>
      )}
      <span className="ac-list-item__body">
        <span data-slot="list-item-title" className="ac-list-item__title">
          {children}
        </span>
        {description && (
          <span data-slot="list-item-description" className="ac-list-item__description">
            {description}
          </span>
        )}
      </span>
      {trailing && (
        <span data-slot="list-item-trailing" className="ac-list-item__trailing">
          {trailing}
        </span>
      )}
    </li>
  );
});
