import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "./toast";

describe("Toast", () => {
  it("renders tone, message content, action and dismiss callbacks accessibly", async () => {
    const onAction = vi.fn();
    const onDismiss = vi.fn();
    render(
      <ol>
        <Toast
          title="Upload failed"
          description="Check your connection and try again."
          tone="danger"
          action={{ label: "Retry", onClick: onAction }}
          onDismiss={onDismiss}
          dismissLabel="Dismiss notification"
          duration={5000}
          progress
        />
      </ol>,
    );

    const toast = screen.getByRole("alert");
    expect(toast).toHaveAttribute("data-tone", "danger");
    expect(toast).toHaveAttribute("data-slot", "toast");
    expect(screen.getByText("Check your connection and try again.")).toBeInTheDocument();
    expect(toast.querySelector(".ac-toast__progress")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    await userEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("uses a polite status role and omits dismissal when no callback is supplied", () => {
    render(
      <ol>
        <Toast title="Draft saved" tone="success" />
      </ol>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Draft saved");
    expect(screen.queryByRole("button", { name: /dismiss/i })).not.toBeInTheDocument();
  });
});
