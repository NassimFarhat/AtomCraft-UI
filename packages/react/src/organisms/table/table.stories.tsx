import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../atoms/avatar";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { IconInbox, IconPlus } from "../../icons";
import { Stack } from "../../layout";
import { EmptyState } from "../../molecules/empty-state";
import { SelectMenu } from "../../molecules/select-menu";
import { DataTable } from "./data-table";
import type { DataTableColumn } from "./types";

type Invoice = {
  id: string;
  customer: string;
  status: "paid" | "pending" | "overdue";
  amount: number;
  date: string;
};

const invoices: Invoice[] = [
  { id: "INV-2041", customer: "Sfax Digital", status: "paid", amount: 1840, date: "2026-11-02" },
  {
    id: "INV-2042",
    customer: "Carthage Labs",
    status: "pending",
    amount: 920.5,
    date: "2026-11-08",
  },
  {
    id: "INV-2043",
    customer: "Médina Studio",
    status: "overdue",
    amount: 4300,
    date: "2026-10-21",
  },
  {
    id: "INV-2044",
    customer: "Atlas Logistics",
    status: "paid",
    amount: 12750,
    date: "2026-11-15",
  },
  {
    id: "INV-2045",
    customer: "Kerkennah Fish Co.",
    status: "pending",
    amount: 640,
    date: "2026-11-19",
  },
];

const STATUS_TONE = { paid: "success", pending: "warning", overdue: "danger" } as const;
const money = new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND" });
const date = new Intl.DateTimeFormat("fr-TN", { dateStyle: "medium" });

const columns: DataTableColumn<Invoice>[] = [
  { key: "id", header: "Invoice", sortable: true },
  {
    key: "customer",
    header: "Customer",
    sortable: true,
    cell: (row) => (
      <Stack direction="row" gap="2" align="center">
        <Avatar name={row.customer} size="xs" tone="primary" />
        {row.customer}
      </Stack>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <Badge dot tone={STATUS_TONE[row.status]}>
        {row.status}
      </Badge>
    ),
  },
  { key: "date", header: "Date", sortable: true, cell: (row) => date.format(new Date(row.date)) },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    align: "end",
    cell: (row) => money.format(row.amount),
  },
];

const meta = {
  title: "Organisms/DataTable",
  component: DataTable<Invoice>,
  args: { caption: "Recent invoices", columns, rows: invoices, getRowId: (row: Invoice) => row.id },
  parameters: { layout: "padded" },
} satisfies Meta<typeof DataTable<Invoice>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Invoices: Story = {
  args: { selectable: true, defaultSort: { key: "date", direction: "descending" } },
};
export const Compact: Story = { args: { density: "compact", striped: true } };
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = {
  args: {
    rows: [],
    empty: (
      <EmptyState
        icon={<IconInbox />}
        title="No invoices"
        description="Try another filter."
        actions={<Button size="sm">Clear filters</Button>}
      />
    ),
  },
};

/** Everything a working table needs: search, facets, columns, paging and selection. */
export const WithToolbar: Story = {
  args: {
    selectable: true,
    searchable: true,
    columnToggle: true,
    paginated: true,
    defaultPageSize: 10,
    searchPlaceholder: "Search invoices",
    filters: (
      <SelectMenu
        aria-label="Status"
        size="sm"
        placeholder="Any status"
        options={[
          { value: "paid", label: "Paid" },
          { value: "pending", label: "Pending" },
          { value: "overdue", label: "Overdue" },
        ]}
      />
    ),
    toolbarActions: (
      <Button size="sm">
        <IconPlus /> New invoice
      </Button>
    ),
  },
};

export const Failed: Story = {
  args: { error: "The invoices could not be loaded. Check your connection and try again." },
};
