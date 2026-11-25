import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./popover";
import { Tooltip } from "./tooltip";

describe("Tooltip", () => {
  it("describes its trigger on focus and hides on Escape", async () => {
    render(
      <Tooltip content="Copy to clipboard">
        <Button>Copy</Button>
      </Tooltip>,
    );
    await userEvent.tab();
    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    expect(screen.getByRole("button", { name: "Copy" })).toHaveAccessibleDescription(
      "Copy to clipboard",
    );
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

describe("Popover", () => {
  it("moves focus inside on open and back to the trigger on Escape", async () => {
    render(
      <Popover>
        <PopoverTrigger>
          <Button>Share</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Share options">
          <PopoverClose>
            <Button>Done</Button>
          </PopoverClose>
        </PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Share" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Share options" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("DropdownMenu", () => {
  const renderMenu = (onSelect = vi.fn()) =>
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => onSelect("edit")}>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSelect("duplicate")}>Duplicate</DropdownMenuItem>
          <DropdownMenuItem disabled>Archive</DropdownMenuItem>
          <DropdownMenuItem tone="danger" onSelect={() => onSelect("delete")}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

  it("opens with ArrowDown on the first item and moves with arrows, skipping disabled items", async () => {
    renderMenu();
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("supports typeahead, selects with Enter, closes and restores focus", async () => {
    const onSelect = vi.fn();
    renderMenu(onSelect);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.keyboard("d");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("duplicate");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions" })).toHaveFocus();
  });

  it("closes on Escape", async () => {
    renderMenu();
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
