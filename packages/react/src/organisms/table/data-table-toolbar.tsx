import type { ReactNode } from "react";
import { Button } from "../../atoms/button";
import { IconColumns } from "../../icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../molecules/dropdown-menu";
import { SearchField } from "../../molecules/search-field";
import { useMessages } from "../../provider";

export type ColumnToggle = {
  key: string;
  label: string;
  visible: boolean;
};

export type DataTableToolbarProps = {
  search: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string | undefined;
  } | null;
  columns: readonly ColumnToggle[] | null;
  onToggleColumn: (key: string) => void;
  /** Filter controls, such as a SelectMenu per facet. */
  filters: ReactNode;
  /** Buttons on the trailing side, such as "Add". */
  actions: ReactNode;
};

/** Search, filters, column visibility and actions above the table. */
export function DataTableToolbar({
  search,
  columns,
  onToggleColumn,
  filters,
  actions,
}: DataTableToolbarProps) {
  const messages = useMessages();
  return (
    <div data-slot="data-table-toolbar" className="ac-data-table__toolbar">
      <div className="ac-data-table__filters">
        {search && (
          <SearchField
            value={search.value}
            placeholder={search.placeholder ?? messages.search}
            className="ac-data-table__search"
            onValueChange={search.onChange}
          />
        )}
        {filters}
      </div>
      <div className="ac-data-table__actions">
        {actions}
        {columns && (
          <DropdownMenu align="end">
            <DropdownMenuTrigger>
              <Button variant="outline" tone="neutral" size="sm">
                <IconColumns />
                {messages.columns}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent aria-label={messages.columns}>
              <DropdownMenuLabel>{messages.columns}</DropdownMenuLabel>
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
        )}
      </div>
    </div>
  );
}

export type TableToolbarProps = DataTableToolbarProps;
export const TableToolbar = DataTableToolbar;
