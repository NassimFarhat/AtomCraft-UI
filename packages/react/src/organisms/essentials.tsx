import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { Progress } from "../atoms/progress";
import { Spinner } from "../atoms/spinner";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../molecules/card";

export type NavigationRailItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  current?: boolean;
  disabled?: boolean;
  badge?: ReactNode;
};

export type NavigationRailProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  label: string;
  items: readonly NavigationRailItem[];
  collapsed?: boolean;
};

export const NavigationRail = forwardRef<HTMLElement, NavigationRailProps>(function NavigationRail(
  { label, items, collapsed = false, className, ...props },
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      data-slot="navigation-rail"
      data-collapsed={collapsed || undefined}
      className={cn("ac-navigation-rail", className)}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={item.disabled ? undefined : item.href}
          aria-label={collapsed ? item.label : undefined}
          aria-current={item.current ? "page" : undefined}
          aria-disabled={item.disabled || undefined}
          title={collapsed ? item.label : undefined}
          data-slot="navigation-rail-item"
          data-current={item.current || undefined}
          data-disabled={item.disabled || undefined}
          className="ac-navigation-rail__item"
        >
          <span className="ac-navigation-rail__icon" aria-hidden="true">
            {item.icon}
          </span>
          {!collapsed && <span className="ac-navigation-rail__label">{item.label}</span>}
          {!collapsed && item.badge !== undefined && (
            <span className="ac-navigation-rail__badge">{item.badge}</span>
          )}
        </a>
      ))}
    </nav>
  );
});

export type SkipLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { href = "#main-content", className, ...props },
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      href={href}
      data-slot="skip-link"
      className={cn("ac-skip-link", className)}
    />
  );
});

export type LoadingOverlayProps = HTMLAttributes<HTMLDivElement> & {
  loading: boolean;
  label: string;
  children: ReactNode;
};
export function LoadingOverlay({
  loading,
  label,
  children,
  className,
  ...props
}: LoadingOverlayProps) {
  return (
    <div
      {...props}
      data-slot="loading-overlay"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={cn("ac-loading-overlay", className)}
    >
      <div className="ac-loading-overlay__content">{children}</div>
      {loading && (
        <div className="ac-loading-overlay__scrim">
          <Spinner label={label} />
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

export type ProgressOverlayProps = HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
  label: string;
  children: ReactNode;
};
export function ProgressOverlay({
  value,
  max = 100,
  label,
  children,
  className,
  ...props
}: ProgressOverlayProps) {
  return (
    <div
      {...props}
      data-slot="progress-overlay"
      aria-busy="true"
      className={cn("ac-progress-overlay", className)}
    >
      <div className="ac-progress-overlay__content">{children}</div>
      <div className="ac-progress-overlay__scrim">
        <p>{label}</p>
        <Progress value={value} max={max} aria-label={label} />
      </div>
    </div>
  );
}

export type ErrorStateProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  children: ReactNode;
  action?: ReactNode;
};
export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  { title, children, action, className, ...props },
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      role="alert"
      data-slot="error-state"
      className={cn("ac-error-state", className)}
    >
      <h2 className="ac-error-state__title">{title}</h2>
      <div className="ac-error-state__description">{children}</div>
      {action && <div className="ac-error-state__action">{action}</div>}
    </section>
  );
});

export type OfflineIndicatorProps = HTMLAttributes<HTMLDivElement> & {
  online: boolean;
  onlineLabel: string;
  offlineLabel: string;
};
export function OfflineIndicator({
  online,
  onlineLabel,
  offlineLabel,
  className,
  ...props
}: OfflineIndicatorProps) {
  return (
    <div
      {...props}
      role="status"
      aria-live="polite"
      data-slot="offline-indicator"
      data-online={online || undefined}
      className={cn("ac-offline-indicator", className)}
    >
      <span aria-hidden="true" className="ac-offline-indicator__dot" />
      {online ? onlineLabel : offlineLabel}
    </div>
  );
}

export type DataListItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  value?: ReactNode;
};
export type DataListProps = Omit<HTMLAttributes<HTMLUListElement>, "children"> & {
  items: readonly DataListItem[];
};
export const DataList = forwardRef<HTMLUListElement, DataListProps>(function DataList(
  { items, className, ...props },
  ref,
) {
  return (
    <ul {...props} ref={ref} data-slot="data-list" className={cn("ac-data-list", className)}>
      {items.map((item) => (
        <li key={item.id} data-slot="data-list-item" className="ac-data-list__item">
          <div className="ac-data-list__copy">
            <span className="ac-data-list__title">
              <bdi>{item.title}</bdi>
            </span>
            {item.description && (
              <span className="ac-data-list__description">{item.description}</span>
            )}
          </div>
          {item.value !== undefined && (
            <span className="ac-data-list__value">
              <bdi>{item.value}</bdi>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
});

export type DescriptionListItem = { id: string; term: ReactNode; description: ReactNode };
export type DescriptionListProps = Omit<HTMLAttributes<HTMLDListElement>, "children"> & {
  items: readonly DescriptionListItem[];
  columns?: 1 | 2 | 3;
};
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(
  function DescriptionList({ items, columns = 1, className, ...props }, ref) {
    return (
      <dl
        {...props}
        ref={ref}
        data-slot="description-list"
        data-columns={columns}
        className={cn("ac-description-list", className)}
      >
        {items.map((item) => (
          <div key={item.id} className="ac-description-list__item">
            <dt>
              <bdi>{item.term}</bdi>
            </dt>
            <dd>
              <bdi>{item.description}</bdi>
            </dd>
          </div>
        ))}
      </dl>
    );
  },
);

export type DataCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};
export const DataCard = forwardRef<HTMLDivElement, DataCardProps>(function DataCard(
  { title, value, description, action, className, ...props },
  ref,
) {
  return (
    <article
      {...props}
      ref={ref}
      data-slot="data-card"
      data-variant="outline"
      className={cn("ac-card ac-data-card", className)}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>
        <strong className="ac-data-card__value">
          <bdi>{value}</bdi>
        </strong>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </article>
  );
});

export type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  function FormDescription({ className, ...props }, ref) {
    return (
      <p
        {...props}
        ref={ref}
        data-slot="form-description"
        className={cn("ac-field__description", className)}
      />
    );
  },
);

export type ValidationMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  tone?: "error" | "warning";
};
export const ValidationMessage = forwardRef<HTMLParagraphElement, ValidationMessageProps>(
  function ValidationMessage({ tone = "error", className, ...props }, ref) {
    return (
      <p
        {...props}
        ref={ref}
        role={tone === "error" ? "alert" : "status"}
        data-slot="validation-message"
        data-tone={tone}
        className={cn("ac-validation-message", "ac-field__error", className)}
      />
    );
  },
);
