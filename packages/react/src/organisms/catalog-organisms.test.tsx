import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test/a11y";
import { Carousel, Chart, FilterBar, Kanban, Map, Wizard } from "./catalog-workflow";
import { Chat, FileManager, NotificationCenter, OnboardingTour } from "./catalog-collaboration";
import { NavigationMenu, TreeView } from "./catalog-navigation";

describe("catalog organisms", () => {
  it("keeps navigation, tree, chart and map semantics accessible", async () => {
    const { container } = render(
      <>
        <NavigationMenu
          label="Main navigation"
          items={[{ id: "docs", label: "Documentation", href: "/docs" }]}
        />
        <TreeView
          label="Files"
          nodes={[{ id: "src", label: "src", children: [{ id: "index", label: "index.ts" }] }]}
        />
        <Chart
          label="Downloads"
          categoryLabel="Month"
          valueLabel="Count"
          data={[{ label: "Jan", value: 4 }]}
        />
        <Map label="Locations" markers={[{ id: "tunis", label: "Tunis", x: 50, y: 50 }]} />
      </>,
    );
    await expectNoA11yViolations(container);
  });

  it("opens navigation submenus and supports tree arrow navigation", async () => {
    render(
      <>
        <NavigationMenu
          label="Main navigation"
          items={[
            {
              id: "products",
              label: "Products",
              href: "/products",
              children: [{ id: "components", label: "Components", href: "/components" }],
            },
          ]}
        />
        <TreeView
          label="Files"
          defaultExpandedIds={["src"]}
          nodes={[{ id: "src", label: "src", children: [{ id: "button", label: "button.tsx" }] }]}
        />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Products" }));
    expect(screen.getByRole("link", { name: "Components" })).toBeVisible();
    const treeItem = screen.getByText("src").closest("[role='treeitem']") as HTMLElement;
    treeItem.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByText("button.tsx").closest("[role='treeitem']")).toHaveFocus();
  });

  it("moves through a wizard and carousel with their controls", async () => {
    render(
      <>
        <Wizard
          label="Setup"
          previousLabel="Back"
          nextLabel="Next"
          completeLabel="Finish"
          steps={[
            { id: "one", label: "Account", content: <p>Account fields</p> },
            { id: "two", label: "Profile", content: <p>Profile fields</p> },
          ]}
        />
        <Carousel
          label="Updates"
          previousLabel="Previous"
          nextLabel="Next slide"
          slideLabel={(index, total) => `${index} of ${total}`}
          items={[<p key="one">First update</p>, <p key="two">Second update</p>]}
        />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "Profile" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByRole("group", { name: "2 of 2" })).toHaveTextContent("Second update");
  });

  it("emits Kanban moves and map marker selection", async () => {
    const onMoveCard = vi.fn();
    const onMarkerSelect = vi.fn();
    render(
      <>
        <Kanban
          label="Board"
          moveLabel="Move to"
          columns={[
            { id: "todo", title: "Todo", cards: [{ id: "task", title: "Review" }] },
            { id: "done", title: "Done", cards: [] },
          ]}
          onMoveCard={onMoveCard}
        />
        <Map
          label="Locations"
          markers={[{ id: "tunis", label: "Tunis", x: 40, y: 50 }]}
          onMarkerSelect={onMarkerSelect}
        />
        <Chart
          label="Downloads"
          categoryLabel="Month"
          valueLabel="Downloads"
          data={[{ label: "Jan", value: 4 }]}
        />
      </>,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Review Move to" }));
    await userEvent.click(await screen.findByRole("option", { name: "Done" }));
    expect(onMoveCard).toHaveBeenCalledWith("task", "done");
    await userEvent.click(screen.getByRole("button", { name: "Tunis" }));
    expect(onMarkerSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "tunis" }));
    expect(screen.getByRole("img", { name: "Downloads" })).toBeInTheDocument();
  });

  it("uses the styled SelectMenu for filter facets", async () => {
    const onFilterChange = vi.fn();
    render(
      <FilterBar
        query=""
        onQueryChange={() => undefined}
        queryLabel="Search projects"
        filters={[
          {
            id: "status",
            label: "Status",
            value: "all",
            options: [
              { value: "all", label: "All statuses" },
              { value: "active", label: "Active" },
            ],
          },
        ]}
        onFilterChange={onFilterChange}
        resetLabel="Reset filters"
      />,
    );

    expect(screen.getByRole("searchbox", { name: "Search projects" })).toHaveAttribute(
      "placeholder",
      "Search projects",
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Status" }));
    await userEvent.click(await screen.findByRole("option", { name: "Active" }));

    expect(onFilterChange).toHaveBeenCalledWith("status", "active");
    expect(document.querySelector(".ac-filter-bar select")).not.toBeInTheDocument();
  });

  it("emits chat messages and notification/file actions", async () => {
    const onSend = vi.fn();
    const onMarkRead = vi.fn();
    const onDownload = vi.fn();
    render(
      <>
        <Chat
          label="Support chat"
          messages={[]}
          inputLabel="Message"
          submitLabel="Send"
          emptyLabel="No messages"
          onSend={onSend}
        />
        <NotificationCenter
          label="Notifications"
          notifications={[{ id: "n1", title: "Update", read: false }]}
          markReadLabel="Mark read"
          dismissLabel="Dismiss"
          emptyLabel="No notifications"
          onMarkRead={onMarkRead}
        />
        <FileManager
          label="Files"
          items={[{ id: "f1", name: "report.pdf", kind: "file" }]}
          emptyLabel="No files"
          openFolderLabel="Open"
          downloadLabel="Download"
          deleteLabel="Delete"
          onDownload={onDownload}
        />
      </>,
    );
    await userEvent.type(screen.getByRole("textbox", { name: "Message" }), "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalledWith("Hello");
    await userEvent.click(screen.getByRole("button", { name: "Mark read" }));
    expect(onMarkRead).toHaveBeenCalledWith("n1");
    await userEvent.click(screen.getByRole("button", { name: "Download: report.pdf" }));
    expect(onDownload).toHaveBeenCalledWith("f1");
  });

  it("closes the onboarding tour after the final step", async () => {
    render(
      <OnboardingTour
        defaultOpen
        steps={[{ id: "one", title: "Welcome", description: "Start here." }]}
        previousLabel="Back"
        nextLabel="Next"
        finishLabel="Finish"
        skipLabel="Skip"
        stepLabel={(step, total) => `Step ${step} of ${total}`}
      />,
    );
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Welcome")).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole("button", { name: "Finish" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
