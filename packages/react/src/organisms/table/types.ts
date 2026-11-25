import type { ReactNode } from "react";
import type { SortState, SortValue } from "./sorting";
import type { CellAlign } from "./table";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  /** Plain-text name, used in the column menu and on narrow screens. */
  label?: string;
  /** Custom cell content. Defaults to the sort value as text. */
  cell?: (row: T) => ReactNode;
  /** Value used for sorting, searching and default display. Defaults to `row[key]`. */
  value?: (row: T) => SortValue;
  sortable?: boolean;
  /** Excludes the column from the search. Defaults to included. */
  searchable?: boolean;
  /** Keeps the column out of the column menu, so it cannot be hidden. */
  hidable?: boolean;
  align?: CellAlign;
  width?: string;
};

export type DataTableProps<T> = {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowId: (row: T) => string;
  /** Required for accessibility; hide it visually with `hideCaption`. */
  caption: ReactNode;
  hideCaption?: boolean;
  sort?: SortState | undefined;
  defaultSort?: SortState;
  onSortChange?: ((sort: SortState) => void) | undefined;
  selectable?: boolean;
  selectedIds?: string[] | undefined;
  defaultSelectedIds?: string[];
  onSelectionChange?: ((ids: string[]) => void) | undefined;
  /** Adds a search box that filters the searchable columns. */
  searchable?: boolean;
  search?: string | undefined;
  defaultSearch?: string;
  onSearchChange?: ((search: string) => void) | undefined;
  searchPlaceholder?: string | undefined;
  /** Filter controls shown in the toolbar. */
  filters?: ReactNode;
  /** Buttons shown at the end of the toolbar. */
  toolbarActions?: ReactNode;
  /** Lets the reader hide columns. */
  columnToggle?: boolean;
  hiddenColumns?: string[] | undefined;
  defaultHiddenColumns?: string[];
  onHiddenColumnsChange?: ((keys: string[]) => void) | undefined;
  paginated?: boolean;
  page?: number | undefined;
  defaultPage?: number;
  onPageChange?: ((page: number) => void) | undefined;
  pageSize?: number | undefined;
  defaultPageSize?: number;
  onPageSizeChange?: ((size: number) => void) | undefined;
  /** `null` hides the page-size control. */
  pageSizeOptions?: readonly number[] | null;
  /** Total rows on the server. Set it when the server filters and pages. */
  totalRows?: number | undefined;
  loading?: boolean;
  /** Replaces the rows with an error message, e.g. after a failed request. */
  error?: ReactNode;
  /** Shown when there are no rows. An EmptyState is a good fit. */
  empty?: ReactNode;
  density?: "compact" | "comfortable";
  striped?: boolean;
  stickyHeader?: boolean;
  /** Stacks each row into a card below the medium breakpoint. */
  responsive?: boolean;
  className?: string;
};

/** The column's name as plain text, for menus and for narrow screens. */
export const labelOf = <T>(column: DataTableColumn<T>): string =>
  column.label ?? (typeof column.header === "string" ? column.header : column.key);

/** The value of a cell: the column's own getter, or the row's property of that key. */
export const readValue = <T>(column: DataTableColumn<T> | undefined, row: T): SortValue =>
  column?.value
    ? column.value(row)
    : ((row as Record<string, unknown>)[column?.key ?? ""] as SortValue);
