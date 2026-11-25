import { cn } from "@atomcraft/core";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Always offer a next step: create, clear filters, retry... */
  actions?: ReactNode;
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, actions, className, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} data-slot="empty-state" className={cn("ac-empty-state", className)}>
      {icon && (
        <span className="ac-empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <p className="ac-empty-state__title">{title}</p>
      {description && <p className="ac-empty-state__description">{description}</p>}
      {actions && <div className="ac-empty-state__actions">{actions}</div>}
    </div>
  );
});
