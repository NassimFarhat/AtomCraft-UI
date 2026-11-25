import { cn, getPageItems } from "@atomcraft/core";
import type { HTMLAttributes } from "react";
import { Button, IconButton } from "../../atoms/button";
import { useControllableState } from "../../hooks";
import { IconChevronLeft, IconChevronRight } from "../../icons";
import { formatMessage, useMessages } from "../../provider";

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  totalPages: number;
  page?: number | undefined;
  defaultPage?: number;
  onPageChange?: ((page: number) => void) | undefined;
  /** Pages shown on each side of the current one. */
  siblings?: number;
};

type PageListProps = {
  current: number;
  totalPages: number;
  siblings: number;
  onSelect: (page: number) => void;
};

function PageList({ current, totalPages, siblings, onSelect }: PageListProps) {
  const messages = useMessages();
  return (
    <ul className="ac-pagination__pages">
      {getPageItems(current, totalPages, siblings).map((item) =>
        typeof item === "number" ? (
          <li key={item}>
            <Button
              variant={item === current ? "outline" : "ghost"}
              tone="neutral"
              aria-current={item === current ? "page" : undefined}
              aria-label={formatMessage(messages.goToPage, { page: item })}
              data-icon-only=""
              onClick={() => onSelect(item)}
            >
              {item}
            </Button>
          </li>
        ) : (
          <li key={item} className="ac-pagination__ellipsis" aria-hidden="true">
            …
          </li>
        ),
      )}
    </ul>
  );
}

export function Pagination({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  siblings = 1,
  className,
  ...props
}: PaginationProps) {
  const messages = useMessages();
  const [current, setCurrent] = useControllableState({
    value: page,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const go = (target: number) => setCurrent(Math.min(Math.max(target, 1), totalPages));

  return (
    <nav
      {...props}
      aria-label={messages.pagination}
      data-slot="pagination"
      className={cn("ac-pagination", className)}
    >
      <IconButton
        label={messages.previousPage}
        variant="ghost"
        disabled={current <= 1}
        onClick={() => go(current - 1)}
      >
        <IconChevronLeft />
      </IconButton>
      <PageList current={current} totalPages={totalPages} siblings={siblings} onSelect={go} />
      <p className="ac-pagination__compact" aria-hidden="true">
        <bdi>
          {current} / {totalPages}
        </bdi>
      </p>
      <IconButton
        label={messages.nextPage}
        variant="ghost"
        disabled={current >= totalPages}
        onClick={() => go(current + 1)}
      >
        <IconChevronRight />
      </IconButton>
    </nav>
  );
}
