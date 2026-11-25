import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test/a11y";
import { DataTable } from "./table";
import type { DataTableColumn } from "./table";
import { pageCountOf, pageSlice, rowMatches } from "./table";

type Invoice = { id: string; customer: string; amount: number };

const invoices: Invoice[] = Array.from({ length: 12 }, (_, index) => ({
  id: `INV-${2040 + index}`,
  customer: index % 2 === 0 ? "Sfax Digital" : "Carthage Labs",
  amount: (index + 1) * 100,
}));

const columns: DataTableColumn<Invoice>[] = [
  { key: "id", header: "Invoice", sortable: true, hidable: false },
  { key: "customer", header: "Customer", sortable: true },
  { key: "amount", header: "Amount", sortable: true, align: "end", searchable: false },
];

const table = (props: Partial<Parameters<typeof DataTable<Invoice>>[0]> = {}) => (
  <DataTable
    caption="Invoices"
    columns={columns}
    rows={invoices}
    getRowId={(row) => row.id}
    {...props}
  />
);

describe("DataTable helpers", () => {
  it("matches a row on any searchable value", () => {
    expect(rowMatches(["Sfax Digital", 100], "sfax")).toBe(true);
    expect(rowMatches(["Sfax Digital", null], "tunis")).toBe(false);
    expect(rowMatches([], "")).toBe(true);
  });

  it("slices pages and counts them, never below one", () => {
    expect(pageSlice([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
    expect(pageCountOf(12, 5)).toBe(3);
    expect(pageCountOf(0, 10)).toBe(1);
  });
});

describe("DataTable", () => {
  it("sorts when a header is pressed, three states deep", async () => {
    render(table());
    const header = screen.getByRole("button", { name: /Invoice/ });

    await userEvent.click(header);
    expect(screen.getByRole("columnheader", { name: /Invoice/ })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await userEvent.click(header);
    expect(screen.getByRole("columnheader", { name: /Invoice/ })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
    await userEvent.click(header);
    expect(screen.getByRole("columnheader", { name: /Invoice/ })).not.toHaveAttribute("aria-sort");
  });

  it("filters on the searchable columns only", async () => {
    render(table({ searchable: true }));
    await userEvent.type(screen.getByRole("searchbox"), "carthage");
    expect(screen.getAllByRole("row")).toHaveLength(7);

    await userEvent.clear(screen.getByRole("searchbox"));
    await userEvent.type(screen.getByRole("searchbox"), "1200");
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("hides a column from the column menu, keeping the pinned ones", async () => {
    render(table({ columnToggle: true }));
    await userEvent.click(screen.getByRole("button", { name: "Columns" }));
    const menu = screen.getByRole("menu");
    expect(
      within(menu).queryByRole("menuitemcheckbox", { name: "Invoice" }),
    ).not.toBeInTheDocument();

    await userEvent.click(within(menu).getByRole("menuitemcheckbox", { name: "Customer" }));
    expect(screen.queryByRole("columnheader", { name: /Customer/ })).not.toBeInTheDocument();
  });

  it("pages through the rows and changes the page size", async () => {
    render(table({ paginated: true, defaultPageSize: 10 }));
    expect(screen.getAllByRole("row")).toHaveLength(11);
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getAllByRole("row")).toHaveLength(3);

    await userEvent.selectOptions(screen.getByRole("combobox", { name: /Rows per page/ }), "25");
    expect(screen.getAllByRole("row")).toHaveLength(13);
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("goes back to the first page when the search changes", async () => {
    render(table({ paginated: true, searchable: true, defaultPageSize: 5 }));
    await userEvent.click(screen.getByRole("button", { name: "Page 3" }));
    await userEvent.type(screen.getByRole("searchbox"), "sfax");
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("reports the selection instead of the page status", async () => {
    const onSelectionChange = vi.fn();
    render(table({ selectable: true, paginated: true, onSelectionChange }));
    await userEvent.click(
      screen.getAllByRole("checkbox", { name: "Select row" })[0] as HTMLElement,
    );

    expect(onSelectionChange).toHaveBeenCalledWith(["INV-2040"]);
    expect(screen.getByText("1 of 12 selected")).toBeInTheDocument();
  });

  it("shows the error instead of the rows", () => {
    render(table({ error: "Could not load invoices" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load invoices");
    expect(screen.queryByText("Sfax Digital")).not.toBeInTheDocument();
  });

  it("shows placeholders while loading", () => {
    const { container } = render(table({ loading: true }));
    expect(container.querySelector("[aria-busy='true']")).toBeInTheDocument();
    expect(container.querySelectorAll(".ac-skeleton").length).toBeGreaterThan(0);
  });

  it("labels every cell, which is what the stacked layout shows", () => {
    const { container } = render(table());
    const cell = container.querySelector('[data-slot="table-cell"]');
    expect(cell).toHaveAttribute("data-label", "Invoice");
  });

  it("leaves filtering and paging to the server when totalRows is given", async () => {
    const onPageChange = vi.fn();
    render(
      table({
        rows: invoices.slice(0, 3),
        totalRows: 40,
        paginated: true,
        defaultPageSize: 10,
        onPageChange,
      }),
    );
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByText("Page 1 of 4")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("has no accessibility violations with the toolbar and the footer", async () => {
    const { container } = render(
      table({ searchable: true, columnToggle: true, paginated: true, selectable: true }),
    );
    await expectNoA11yViolations(container);
  });
});
