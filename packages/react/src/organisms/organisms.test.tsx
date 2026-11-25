import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../atoms/button";
import { IconHome } from "../icons";
import { expectNoA11yViolations } from "../test/a11y";
import { AppShell } from "../templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Header } from "./header";
import { Sidebar, SidebarContent, SidebarGroup, SidebarItem, SidebarTrigger } from "./sidebar";
import { DataTable } from "./table";
import { nextSort, sortRows } from "./table/sorting";

describe("Dialog", () => {
  it("opens from its trigger, is named and described, and closes with the close button", async () => {
    render(
      <Dialog>
        <DialogTrigger>
          <Button>Delete project</Button>
        </DialogTrigger>
        <DialogContent alert>
          <DialogHeader>
            <DialogTitle>Delete “Atlas”?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button tone="danger">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Delete project" });
    await userEvent.click(trigger);
    const dialog = screen.getByRole("alertdialog", { name: "Delete “Atlas”?" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("AppShell, Header and Sidebar", () => {
  const renderShell = () =>
    render(
      <AppShell
        header={
          <Header
            brand="AtomCraft"
            start={<SidebarTrigger />}
            actions={<Button size="sm">New</Button>}
          />
        }
        sidebar={
          <Sidebar>
            <SidebarContent>
              <SidebarGroup label="Workspace">
                <SidebarItem href="/" icon={<IconHome />} tooltip="Home" active>
                  Home
                </SidebarItem>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        }
      >
        <h1>Dashboard</h1>
      </AppShell>,
    );

  it("provides landmarks, a skip link and a collapsible navigation", async () => {
    const { container } = renderShell();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav).toHaveAttribute("data-state", "expanded");
    await userEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(nav).toHaveAttribute("data-state", "collapsed");
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    await expectNoA11yViolations(container);
  });
});

type Member = { id: string; name: string; role: string; seats: number };
const members: Member[] = [
  { id: "1", name: "Zied", role: "Owner", seats: 3 },
  { id: "2", name: "Amel", role: "Admin", seats: 12 },
  { id: "3", name: "Émna", role: "Member", seats: 2 },
];
const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role" },
  { key: "seats", header: "Seats", sortable: true, align: "end" as const },
];

describe("DataTable", () => {
  const names = () =>
    screen
      .getAllByRole("row")
      .slice(1)
      .map((row) => within(row).getAllByRole("cell")[1]?.textContent);

  it("sorts with aria-sort: ascending, descending, then unsorted", async () => {
    render(
      <DataTable
        caption="Team"
        columns={columns}
        rows={members}
        getRowId={(row) => row.id}
        selectable
      />,
    );
    const header = screen.getByRole("columnheader", { name: /Name/ });
    await userEvent.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(names()).toEqual(["Amel", "Émna", "Zied"]);
    await userEvent.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(within(header).getByRole("button"));
    expect(header).not.toHaveAttribute("aria-sort");
  });

  it("selects rows and reflects partial selection in the header checkbox", async () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        caption="Team"
        columns={columns}
        rows={members}
        getRowId={(row) => row.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    const [selectAll, firstRow] = screen.getAllByRole("checkbox");
    await userEvent.click(firstRow as HTMLElement);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["1"]);
    expect(selectAll).toBePartiallyChecked();
    await userEvent.click(selectAll as HTMLElement);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["1", "2", "3"]);
  });

  it("shows the empty state and the loading state", () => {
    const { rerender } = render(
      <DataTable caption="Team" columns={columns} rows={[]} getRowId={(row: Member) => row.id} />,
    );
    expect(screen.getByText("No results")).toBeInTheDocument();
    rerender(
      <DataTable
        caption="Team"
        columns={columns}
        rows={[]}
        getRowId={(row: Member) => row.id}
        loading
      />,
    );
    expect(screen.getAllByRole("rowgroup")[1]).toHaveAttribute("aria-busy", "true");
  });
});

describe("sorting helpers", () => {
  it("cycles the sort state", () => {
    expect(nextSort(null, "name")).toEqual({ key: "name", direction: "ascending" });
    expect(nextSort({ key: "name", direction: "descending" }, "name")).toBeNull();
  });

  it("sorts numbers numerically and puts empty values last", () => {
    const rows = [{ v: 10 }, { v: null }, { v: 9 }];
    const sorted = sortRows(rows, { key: "v", direction: "ascending" }, (row) => row.v, "en");
    expect(sorted.map((row) => row.v)).toEqual([9, 10, null]);
  });
});
