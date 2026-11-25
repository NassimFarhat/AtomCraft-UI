import { useMemo, useState } from "react";
import { useControllableState } from "../../hooks";
import { useAtomCraft } from "../../provider";
import { filterRows, pageCountOf, pageSlice } from "./filtering";
import { nextSort, sortRows } from "./sorting";
import type { SortState, SortValue } from "./sorting";
import { withDefaults } from "../../utils";
import { labelOf, readValue } from "./types";
import type { DataTableColumn, DataTableProps } from "./types";

export type TableDataOptions<T> = {
  rows: readonly T[];
  /** Values a column exposes for sorting, searching and display. */
  readValue: (key: string, row: T) => SortValue;
  searchableKeys: readonly string[];
  sort: SortState | undefined;
  defaultSort: SortState;
  onSortChange: ((sort: SortState) => void) | undefined;
  search: string | undefined;
  defaultSearch: string;
  onSearchChange: ((search: string) => void) | undefined;
  paginated: boolean;
  page: number | undefined;
  defaultPage: number;
  onPageChange: ((page: number) => void) | undefined;
  pageSize: number | undefined;
  defaultPageSize: number;
  onPageSizeChange: ((size: number) => void) | undefined;
  /** Total row count when the server does the paging. */
  totalRows: number | undefined;
};

/**
 * Derives what the table shows: filter, then sort, then page.
 *
 * With `totalRows` set, the rows are taken as the current page already prepared
 * by the server, and only the page controls are driven here.
 */
export function useDataTableRows<T>(options: TableDataOptions<T>) {
  const { locale } = useAtomCraft();
  const [sort, setSort] = useControllableState<SortState>({
    value: options.sort,
    defaultValue: options.defaultSort,
    onChange: options.onSortChange,
  });
  const [search, setSearch] = useControllableState({
    value: options.search,
    defaultValue: options.defaultSearch,
    onChange: options.onSearchChange,
  });
  const [page, setPage] = useControllableState({
    value: options.page,
    defaultValue: options.defaultPage,
    onChange: options.onPageChange,
  });
  const [pageSize, setPageSize] = useControllableState({
    value: options.pageSize,
    defaultValue: options.defaultPageSize,
    onChange: options.onPageSizeChange,
  });

  const serverSide = options.totalRows !== undefined;
  const { rows, readValue, searchableKeys } = options;

  const prepared = useMemo(() => {
    if (serverSide) return [...rows];
    const filtered = filterRows(rows, search, (row) =>
      searchableKeys.map((key) => readValue(key, row)),
    );
    return sortRows(filtered, sort, (row, key) => readValue(key, row), locale);
  }, [rows, search, searchableKeys, readValue, sort, locale, serverSide]);

  const total = options.totalRows ?? prepared.length;
  const pageCount = pageCountOf(total, pageSize);
  const current = Math.min(page, pageCount);
  const visible =
    options.paginated && !serverSide ? pageSlice(prepared, current, pageSize) : prepared;

  return {
    rows: visible,
    total,
    page: current,
    pageCount,
    pageSize,
    search,
    sort,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    toggleSort: (key: string) => setSort(nextSort(sort, key)),
  };
}

export type DataTableRows<T> = ReturnType<typeof useDataTableRows<T>>;

export type SelectionOptions = {
  selectedIds: string[] | undefined;
  defaultSelectedIds: string[] | undefined;
  onSelectionChange: ((ids: string[]) => void) | undefined;
};

/** Row selection over the ids currently shown, with a tri-state header box. */
export function useSelection(ids: readonly string[], options: SelectionOptions) {
  const [selected, setSelected] = useControllableState({
    value: options.selectedIds,
    defaultValue: options.defaultSelectedIds ?? [],
    onChange: options.onSelectionChange,
  });
  const allSelected = ids.length > 0 && ids.every((id) => selected.includes(id));
  const someSelected = !allSelected && ids.some((id) => selected.includes(id));
  return {
    selected,
    allSelected,
    someSelected,
    toggleAll: () => setSelected(allSelected ? [] : [...ids]),
    toggle: (id: string) =>
      setSelected((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
      ),
  };
}

export type TableSelection = ReturnType<typeof useSelection>;

/** Which columns are shown, owned by the table or controlled from outside. */
function useColumnVisibility<T>(props: {
  columns: readonly DataTableColumn<T>[];
  hiddenColumns?: string[] | undefined;
  defaultHiddenColumns: readonly string[];
  onHiddenColumnsChange?: ((keys: string[]) => void) | undefined;
}) {
  const [hidden, setHidden] = useControllableState<readonly string[]>({
    value: props.hiddenColumns,
    defaultValue: props.defaultHiddenColumns,
    onChange: props.onHiddenColumnsChange as ((keys: readonly string[]) => void) | undefined,
  });
  return {
    columns: props.columns.filter((column) => !hidden.includes(column.key)),
    toggles: props.columns
      .filter((column) => column.hidable !== false)
      .map((column) => ({
        key: column.key,
        label: labelOf(column),
        visible: !hidden.includes(column.key),
      })),
    toggle: (key: string) =>
      setHidden((current) =>
        current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
      ),
  };
}

const DEFAULT_PAGE_SIZES = [10, 25, 50] as const;

/** Every optional behaviour of the table, resolved once. */
type DataTableDefaults = {
  hideCaption: boolean;
  selectable: boolean;
  searchable: boolean;
  columnToggle: boolean;
  paginated: boolean;
  loading: boolean;
  responsive: boolean;
  defaultSort: SortState;
  defaultSearch: string;
  defaultPage: number;
  defaultSelectedIds: string[];
  defaultHiddenColumns: string[];
};

const DATA_TABLE_DEFAULTS: DataTableDefaults = {
  hideCaption: false,
  selectable: false,
  searchable: false,
  columnToggle: false,
  paginated: false,
  loading: false,
  responsive: true,
  defaultSort: null,
  defaultSearch: "",
  defaultPage: 1,
  defaultSelectedIds: [],
  defaultHiddenColumns: [],
};

/**
 * Everything the DataTable needs to render: the visible columns, the rows after
 * filter, sort and paging, the selection, and whether a toolbar is needed.
 */
export function useDataTableModel<T>(props: DataTableProps<T>) {
  const settings = withDefaults(props, DATA_TABLE_DEFAULTS);
  const { columns, rows } = settings;
  const visibility = useColumnVisibility(settings);
  const [sizes] = useState(() => settings.pageSizeOptions ?? DEFAULT_PAGE_SIZES);

  const data = useDataTableRows({
    rows,
    readValue: (key, row) =>
      readValue(
        columns.find((column) => column.key === key),
        row,
      ),
    searchableKeys: columns
      .filter((column) => column.searchable !== false)
      .map((column) => column.key),
    sort: settings.sort,
    defaultSort: settings.defaultSort,
    onSortChange: settings.onSortChange,
    search: settings.search,
    defaultSearch: settings.defaultSearch,
    onSearchChange: settings.onSearchChange,
    paginated: settings.paginated,
    page: settings.page,
    defaultPage: settings.defaultPage,
    onPageChange: settings.onPageChange,
    pageSize: settings.pageSize,
    defaultPageSize: settings.defaultPageSize ?? sizes[0] ?? 10,
    onPageSizeChange: settings.onPageSizeChange,
    totalRows: settings.totalRows,
  });

  const selection = useSelection(data.rows.map(settings.getRowId), {
    selectedIds: settings.selectedIds,
    defaultSelectedIds: settings.defaultSelectedIds,
    onSelectionChange: settings.onSelectionChange,
  });

  return {
    settings,
    visibility,
    data,
    selection: settings.selectable ? selection : null,
    pageSizes: settings.pageSizeOptions === null ? null : sizes,
    hasToolbar: Boolean(
      settings.searchable || settings.columnToggle || settings.filters || settings.toolbarActions,
    ),
    showFooter: Boolean(settings.paginated && !settings.loading && !settings.error),
  };
}
