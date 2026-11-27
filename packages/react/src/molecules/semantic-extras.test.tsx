import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Banner } from "./banner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { HoverCard } from "./hover-card";
import { ListItem } from "./list-item";
import { Message } from "./message";
import { PriceDisplay } from "./price-display";
import { PromptInput } from "./prompt-input";

describe("new molecule catalogue entries", () => {
  it("announces banners with the supplied status role and tone", () => {
    render(
      <Banner title="Maintenance" tone="warning">
        A short service interruption is planned.
      </Banner>,
    );
    expect(screen.getByRole("status", { name: "Maintenance" })).toHaveAttribute(
      "data-tone",
      "warning",
    );
  });

  it("provides a named hover card and restores focus on Escape", async () => {
    render(
      <HoverCard label="Profile preview" defaultOpen content={<a href="/profile">View profile</a>}>
        <button>Open profile</button>
      </HoverCard>,
    );
    expect(screen.getByRole("dialog", { name: "Profile preview" })).toBeInTheDocument();
    await userEvent.tab();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Profile preview" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open profile" })).toHaveFocus();
  });

  it("opens a context menu and activates an item", async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <button>Canvas</button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Duplicate</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: screen.getByRole("button", { name: "Canvas" }),
    });
    await userEvent.click(await screen.findByRole("menuitem", { name: "Duplicate" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("marks selected list rows and preserves message direction", () => {
    render(
      <>
        <ul>
          <ListItem selected description="Updated recently">
            Design review
          </ListItem>
        </ul>
        <Message direction="outgoing" author="You">
          Looks good.
        </Message>
      </>,
    );
    expect(screen.getByText("Design review").closest("li")).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(screen.getByText("Looks good.").closest("article")).toHaveAttribute(
      "data-direction",
      "outgoing",
    );
  });

  it("formats localized prices and submits prompt text", async () => {
    const onSubmit = vi.fn();
    render(
      <>
        <PriceDisplay amount={1234.5} currency="EUR" locale="de-DE" />
        <PromptInput inputLabel="Message" submitLabel="Send" onSubmit={onSubmit} />
      </>,
    );
    expect(screen.getByText(/1\.234,50/)).toBeInTheDocument();
    await userEvent.type(screen.getByRole("textbox", { name: "Message" }), "Hello team");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit.mock.calls[0]?.[0]).toBe("Hello team");
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("");
  });
});
