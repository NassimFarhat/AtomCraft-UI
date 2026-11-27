import { cn } from "@atomscraft/core";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../../atoms/button";
import { EmptyState } from "../../molecules/empty-state";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../molecules/dropdown-menu";
import type { ColumnToggle } from "./data-table-toolbar";
import { Table, TableBody, TableCell, TableRow } from "./table";

export type TableColumnVisibilityProps = {
  label: string;
  columns: readonly ColumnToggle[];
  onToggleColumn: (key: string) => void;
};
export function TableColumnVisibility({
  label,
  columns,
  onToggleColumn,
}: TableColumnVisibilityProps) {
  return (
    <DropdownMenu align="end">
      <DropdownMenuTrigger>
        <Button type="button" variant="outline" tone="neutral" size="sm">
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label={label}>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={column.visible}
            onCheckedChange={() => onToggleColumn(column.key)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type TableRowAction = {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  tone?: "neutral" | "danger";
};
export type TableRowActionsProps = {
  label: string;
  actions: readonly TableRowAction[];
  className?: string;
};
export function TableRowActions({ label, actions, className }: TableRowActionsProps) {
  return (
    <div data-slot="table-row-actions" className={cn("ac-table-row-actions", className)}>
      <DropdownMenu align="end">
        <DropdownMenuTrigger>
          <Button type="button" variant="ghost" tone="neutral" size="sm" aria-label={label}>
            <span aria-hidden="true">⋯</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-label={label}>
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onSelect={action.onSelect}
              {...(action.disabled !== undefined ? { disabled: action.disabled } : {})}
              {...(action.tone !== undefined ? { tone: action.tone } : {})}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export type TableEmptyStateProps = Omit<HTMLAttributes<HTMLTableElement>, "children"> & {
  columnCount: number;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};
export function TableEmptyState({
  columnCount,
  title,
  description,
  action,
  className,
  ...props
}: TableEmptyStateProps) {
  return (
    <Table {...props} className={cn(className)}>
      <TableBody>
        <TableRow>
          <TableCell colSpan={Math.max(1, columnCount)} className="ac-table__empty">
            <EmptyState title={title} description={description} actions={action} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
