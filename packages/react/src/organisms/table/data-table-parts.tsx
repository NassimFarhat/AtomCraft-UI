import type { ReactNode } from "react";
import { Checkbox } from "../../atoms/checkbox";
import { Skeleton } from "../../atoms/skeleton";
import { IconArrowDown, IconArrowUp, IconArrowUpDown, IconCircleAlert } from "../../icons";
import { useMessages } from "../../provider";
import type { SortState } from "./sorting";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { labelOf, readValue } from "./types";
import type { DataTableColumn } from "./types";
import type { TableSelection } from "./use-data-table";

/** Rows of placeholders while the data loads, so the layout does not jump. */
const LOADING_ROWS = 5;

function SortIcon({ direction }: { direction: "ascending" | "descending" | undefined }) {
  if (direction === "ascending") return <IconArrowUp />;
  if (direction === "descending") return <IconArrowDown />;
  return <IconArrowUpDown className="ac-table__sort-idle" />;
}

export type DataTableHeadProps<T> = {
  columns: readonly DataTableColumn<T>[];
  sort: SortState;
  onSort: (key: string) => void;
  selection: TableSelection | null;
};

export function DataTableHead<T>({ columns, sort, onSort, selection }: DataTableHeadProps<T>) {
  const messages = useMessages();
  return (
    <TableHeader>
      <TableRow>
        {selection && (
          <TableHead className="ac-table__select">
            <Checkbox
              aria-label={messages.selectAll}
              checked={selection.allSelected}
              indeterminate={selection.someSelected}
              onChange={selection.toggleAll}
            />
          </TableHead>
        )}
        {columns.map((column) => {
          const direction = sort?.key === column.key ? sort.direction : undefined;
          return (
            <TableHead
              key={column.key}
              align={column.align}
              aria-sort={direction}
              style={{ inlineSize: column.width }}
            >
              {column.sortable ? (
                <button type="button" className="ac-table__sort" onClick={() => onSort(column.key)}>
                  {column.header}
                  <SortIcon direction={direction} />
                </button>
              ) : (
                column.header
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

type RowsProps<T> = {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowId: (row: T) => string;
  selection: TableSelection | null;
};

function DataTableRows<T>({ columns, rows, getRowId, selection }: RowsProps<T>) {
  const messages = useMessages();
  return rows.map((row) => {
    const id = getRowId(row);
    const isSelected = selection?.selected.includes(id) ?? false;
    return (
      <TableRow key={id} selected={isSelected}>
        {selection && (
          <TableCell className="ac-table__select">
            <Checkbox
              aria-label={messages.selectRow}
              checked={isSelected}
              onChange={() => selection.toggle(id)}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell key={column.key} align={column.align} data-label={labelOf(column)}>
            {column.cell ? column.cell(row) : <bdi>{String(readValue(column, row) ?? "")}</bdi>}
          </TableCell>
        ))}
      </TableRow>
    );
  });
}

function PlaceholderRows({ columnCount }: { columnCount: number }) {
  return Array.from({ length: LOADING_ROWS }, (_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columnCount }, (__, cell) => (
        <TableCell key={cell}>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  ));
}

/** One cell spanning the table, for the loading, error and empty states. */
function StateRow({
  columnCount,
  className,
  children,
}: {
  columnCount: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} className={className}>
        {children}
      </TableCell>
    </TableRow>
  );
}

export type DataTableBodyProps<T> = RowsProps<T> & {
  loading: boolean;
  error: ReactNode;
  empty: ReactNode;
};

/** The rows, or the one state the table is in instead: loading, error or empty. */
export function DataTableBody<T>({ loading, error, empty, ...rowsProps }: DataTableBodyProps<T>) {
  const messages = useMessages();
  const columnCount = rowsProps.columns.length + (rowsProps.selection ? 1 : 0);
  if (loading) {
    return (
      <TableBody aria-busy="true">
        <PlaceholderRows columnCount={columnCount} />
      </TableBody>
    );
  }
  if (error) {
    return (
      <TableBody>
        <StateRow columnCount={columnCount} className="ac-table__error">
          <span role="alert" className="ac-table__error-text">
            <IconCircleAlert size="sm" />
            {error}
          </span>
        </StateRow>
      </TableBody>
    );
  }
  if (rowsProps.rows.length === 0) {
    return (
      <TableBody>
        <StateRow columnCount={columnCount} className="ac-table__empty">
          {empty ?? messages.noResults}
        </StateRow>
      </TableBody>
    );
  }
  return (
    <TableBody>
      <DataTableRows {...rowsProps} />
    </TableBody>
  );
}

export { Table };
