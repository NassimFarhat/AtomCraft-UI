import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Slot } from "./slot";

describe("Slot", () => {
  it("renders the child element and merges class names", () => {
    render(
      <Slot className="from-slot">
        <a href="/home" className="from-child">
          Home
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveClass("from-slot", "from-child");
  });

  it("lets plain child props win over slot props", () => {
    render(
      <Slot id="slot-id" title="slot">
        <span id="child-id">content</span>
      </Slot>,
    );
    expect(screen.getByText("content")).toHaveAttribute("id", "child-id");
    expect(screen.getByText("content")).toHaveAttribute("title", "slot");
  });

  it("calls both event handlers, child first", async () => {
    const calls: string[] = [];
    render(
      <Slot onClick={() => calls.push("slot")}>
        <button type="button" onClick={() => calls.push("child")}>
          Go
        </button>
      </Slot>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(calls).toEqual(["child", "slot"]);
  });

  it("forwards its ref and keeps the child ref", () => {
    const slotRef = createRef<HTMLElement>();
    const childRef = vi.fn();
    render(
      <Slot ref={slotRef}>
        <button type="button" ref={childRef}>
          Go
        </button>
      </Slot>,
    );
    expect(slotRef.current).toBe(screen.getByRole("button"));
    expect(childRef).toHaveBeenCalledWith(screen.getByRole("button"));
  });
});
