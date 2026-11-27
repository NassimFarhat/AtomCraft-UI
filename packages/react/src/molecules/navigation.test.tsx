import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../test/a11y";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "./breadcrumb";
import { NavItem } from "./nav-item";
import { Pagination } from "./pagination";
import { Stat } from "./stat";
import { Toaster, toast } from "./toast";

describe("Pagination", () => {
  it("marks the current page and disables the edge buttons", async () => {
    const onPageChange = vi.fn();
    render(<Pagination totalPages={10} onPageChange={onPageChange} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });
});

describe("Breadcrumb and NavItem", () => {
  it("expose the current location", async () => {
    const { container } = render(
      <>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        <nav aria-label="Main">
          <NavItem href="/inbox" active badge={3}>
            Inbox
          </NavItem>
        </nav>
      </>,
    );
    expect(screen.getByText("Settings")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^Inbox\s?3$/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expectNoA11yViolations(container);
  });
});

describe("Stat", () => {
  it("does not rely on color only: the delta keeps its text and an arrow", () => {
    render(<Stat label="Revenue" value="12 400 TND" delta="+8%" trend="up" />);
    const delta = screen.getByText("+8%").closest("[data-tone]") as HTMLElement;
    expect(delta).toHaveAttribute("data-tone", "success");
    expect(delta.querySelector("svg")).not.toBeNull();
  });
});

describe("Toast", () => {
  it("announces toasts, keeps actionable ones and dismisses on demand", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Saved", { description: "Your profile is up to date." });
      toast.error("Upload failed", { action: { label: "Retry", onClick: vi.fn() } });
    });
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    expect(screen.getByRole("alert")).toHaveTextContent("Upload failed");
    await userEvent.click(screen.getAllByRole("button", { name: "Dismiss" })[0] as HTMLElement);
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    act(() => toast.dismiss());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("updates a persistent loading toast when a promise settles", async () => {
    render(<Toaster />);
    await act(async () => {
      await toast.promise(Promise.resolve("release.zip"), {
        loading: { title: "Uploading", description: "Please wait." },
        success: (fileName) => ({ title: "Upload complete", description: fileName }),
        error: "Upload failed",
      });
    });

    expect(screen.getByRole("status")).toHaveTextContent("Upload complete");
    expect(screen.getByRole("status")).toHaveTextContent("release.zip");
    act(() => toast.dismiss());
  });

  it("shows promise errors and preserves the rejected value", async () => {
    const failure = new Error("The connection was interrupted.");
    render(<Toaster />);
    let caught: unknown;
    await act(async () => {
      try {
        await toast.promise(Promise.reject(failure), {
          loading: "Saving...",
          success: "Saved",
          error: (error) => ({
            title: "Save failed",
            description: error instanceof Error ? error.message : String(error),
          }),
        });
      } catch (error) {
        caught = error;
      }
    });

    expect(caught).toBe(failure);
    expect(screen.getByRole("alert")).toHaveTextContent("Save failed");
    expect(screen.getByRole("alert")).toHaveTextContent(failure.message);
    act(() => toast.dismiss());
  });

  it("limits the visible stack and runs dismissal callbacks", () => {
    const onDismiss = vi.fn();
    render(<Toaster limit={1} newestOnTop />);
    act(() => {
      toast("Earlier notification", { onDismiss });
      toast("Latest notification");
    });

    expect(screen.queryByText("Earlier notification")).not.toBeInTheDocument();
    expect(screen.getByText("Latest notification")).toBeInTheDocument();
    act(() => toast.dismiss());
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

describe("bidirectional text", () => {
  it("isolates metric values so numbers keep their order in RTL", () => {
    render(<Stat label="Revenue" value="48 290 TND" delta="+12.4%" trend="up" />);
    expect(screen.getByText("48 290 TND").tagName).toBe("BDI");
    expect(screen.getByText("+12.4%").tagName).toBe("BDI");
  });
});
