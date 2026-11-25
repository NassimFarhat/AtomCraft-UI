import { IconButton } from "../../atoms/button";
import { Select } from "../../atoms/select";
import { IconChevronsLeft, IconChevronsRight } from "../../icons";
import { Pagination } from "../../molecules/pagination";
import { formatMessage, useMessages } from "../../provider";

export type DataTableFooterProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  pageSizeOptions: readonly number[] | null;
  onPageSizeChange: (size: number) => void;
  /** Rows selected across the table, shown instead of the page status. */
  selectedCount: number;
  totalRows: number;
};

type PageSizeProps = {
  pageSize: number;
  options: readonly number[];
  onChange: (size: number) => void;
};

function PageSizeControl({ pageSize, options, onChange }: PageSizeProps) {
  const messages = useMessages();
  return (
    <label className="ac-data-table__page-size">
      <span className="ac-data-table__page-size-label">{messages.rowsPerPage}</span>
      <Select
        size="sm"
        value={String(pageSize)}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </label>
  );
}

/** Page size, page status and the page controls under the table. */
export function DataTableFooter({
  page,
  pageCount,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  selectedCount,
  totalRows,
}: DataTableFooterProps) {
  const messages = useMessages();
  const status =
    selectedCount > 0
      ? formatMessage(messages.selectionCount, { count: selectedCount, total: totalRows })
      : formatMessage(messages.pageOfPages, { page, pages: pageCount });
  return (
    <div data-slot="data-table-footer" className="ac-data-table__footer">
      <div className="ac-data-table__status" aria-live="polite">
        {status}
      </div>
      <div className="ac-data-table__pages">
        {pageSizeOptions && (
          <PageSizeControl
            pageSize={pageSize}
            options={pageSizeOptions}
            onChange={onPageSizeChange}
          />
        )}
        <IconButton
          label={messages.firstPage}
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        >
          <IconChevronsLeft />
        </IconButton>
        <Pagination
          totalPages={pageCount}
          page={page}
          siblings={0}
          onPageChange={onPageChange}
          className="ac-data-table__pagination"
        />
        <IconButton
          label={messages.lastPage}
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(pageCount)}
        >
          <IconChevronsRight />
        </IconButton>
      </div>
    </div>
  );
}
