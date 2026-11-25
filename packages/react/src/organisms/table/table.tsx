import { cn, dataAttr } from "@atomcraft/core";
import { forwardRef } from "react";
import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  density?: "compact" | "comfortable" | undefined;
  striped?: boolean | undefined;
  /** Keeps the header visible while the table scrolls. */
  stickyHeader?: boolean | undefined;
};

/** Semantic table in a horizontally scrollable region, so wide tables never break the layout. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { density = "comfortable", striped = false, stickyHeader = false, className, ...props },
  ref,
) {
  return (
    <div
      className="ac-table-container"
      data-slot="table-container"
      data-sticky-header={dataAttr(stickyHeader)}
    >
      <table
        {...props}
        ref={ref}
        data-slot="table"
        data-density={density}
        data-striped={dataAttr(striped)}
        className={cn("ac-table", className)}
      />
    </div>
  );
});

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      {...props}
      ref={ref}
      data-slot="table-header"
      className={cn("ac-table__header", className)}
    />
  );
});

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      {...props}
      ref={ref}
      data-slot="table-body"
      className={cn("ac-table__body", className)}
    />
  );
});

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      {...props}
      ref={ref}
      data-slot="table-footer"
      className={cn("ac-table__footer", className)}
    />
  );
});

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & { selected?: boolean };

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected = false, className, ...props },
  ref,
) {
  return (
    <tr
      {...props}
      ref={ref}
      aria-selected={selected || undefined}
      data-state={selected ? "selected" : undefined}
      data-slot="table-row"
      className={cn("ac-table__row", className)}
    />
  );
});

export type CellAlign = "start" | "center" | "end";

export type TableHeadProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> & {
  align?: CellAlign | undefined;
};

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { align = "start", scope = "col", className, ...props },
  ref,
) {
  return (
    <th
      {...props}
      ref={ref}
      scope={scope}
      data-align={align}
      data-slot="table-head"
      className={cn("ac-table__head", className)}
    />
  );
});

export type TableCellProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> & {
  align?: CellAlign | undefined;
};

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = "start", className, ...props },
  ref,
) {
  return (
    <td
      {...props}
      ref={ref}
      data-align={align}
      data-slot="table-cell"
      className={cn("ac-table__cell", className)}
    />
  );
});

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement> & {
  /** Keeps the caption for assistive technologies only. */
  hidden?: boolean;
};

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ hidden = false, className, ...props }, ref) {
    return (
      <caption
        {...props}
        ref={ref}
        data-slot="table-caption"
        className={cn(hidden ? "ac-visually-hidden" : "ac-table__caption", className)}
      />
    );
  },
);
