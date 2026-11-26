import { cn, dataAttr } from "@atomscraft/core";
import { DataTableBody, DataTableHead } from "./data-table-parts";
import { DataTableFooter } from "./data-table-footer";
import { DataTableToolbar } from "./data-table-toolbar";
import { Table, TableCaption } from "./table";
import { useDataTableModel } from "./use-data-table";
import type { DataTableProps } from "./types";

/**
 * Table driven by a column definition: sorting, search, column visibility,
 * selection and paging. Data comes in, events go out; nothing is fetched here.
 *
 * Set `totalRows` to let a server do the filtering, sorting and paging.
 */
export function DataTable<T>(props: DataTableProps<T>) {
  const { settings, visibility, data, selection, ...model } = useDataTableModel(props);
  const search = settings.searchable
    ? { value: data.search, onChange: data.setSearch, placeholder: settings.searchPlaceholder }
    : null;

  return (
    <div
      data-slot="data-table"
      data-responsive={dataAttr(settings.responsive)}
      className={cn("ac-data-table", settings.className)}
    >
      {model.hasToolbar && (
        <DataTableToolbar
          search={search}
          columns={settings.columnToggle ? visibility.toggles : null}
          onToggleColumn={visibility.toggle}
          filters={settings.filters}
          actions={settings.toolbarActions}
        />
      )}
      <Table
        density={settings.density}
        striped={settings.striped}
        stickyHeader={settings.stickyHeader}
      >
        <TableCaption hidden={settings.hideCaption}>{settings.caption}</TableCaption>
        <DataTableHead
          columns={visibility.columns}
          sort={data.sort}
          onSort={data.toggleSort}
          selection={selection}
        />
        <DataTableBody
          columns={visibility.columns}
          rows={data.rows}
          getRowId={settings.getRowId}
          selection={selection}
          loading={settings.loading}
          error={settings.error}
          empty={settings.empty}
        />
      </Table>
      {model.showFooter && (
        <DataTableFooter
          page={data.page}
          pageCount={data.pageCount}
          onPageChange={data.setPage}
          pageSize={data.pageSize}
          pageSizeOptions={model.pageSizes}
          onPageSizeChange={data.setPageSize}
          selectedCount={selection?.selected.length ?? 0}
          totalRows={data.total}
        />
      )}
    </div>
  );
}
