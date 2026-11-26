import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";

const writeText = vi.fn(() => Promise.resolve());

beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

describe("CopyButton", () => {
  it("copies the value and confirms it", async () => {
    render(<CopyButton value="pnpm add @atomscraft/react" />);
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("pnpm add @atomscraft/react");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });

  it("reports a failure instead of pretending it worked", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    render(<CopyButton value="x" />);
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByText("Copy failed")).toBeInTheDocument();
  });

  it("takes a visible label", async () => {
    render(<CopyButton value="x">Copy code</CopyButton>);
    expect(screen.getByRole("button", { name: /Copy code/ })).toBeInTheDocument();
  });
});

describe("CodeBlock", () => {
  const code = "const a = 1;\nconst b = 2;\n";

  it("shows the code, the file name and the language", () => {
    render(<CodeBlock code={code} filename="demo.ts" language="ts" />);
    expect(screen.getByText("demo.ts")).toBeInTheDocument();
    expect(screen.getByText("ts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("keeps every line, without the trailing blank one", () => {
    const { container } = render(<CodeBlock code={code} copyable={false} />);
    expect(container.querySelectorAll(".ac-code-block__line")).toHaveLength(2);
    expect(container.querySelector("code")?.textContent).toBe(code);
  });

  it("drops the header when there is nothing to put in it", () => {
    const { container } = render(<CodeBlock code={code} copyable={false} />);
    expect(container.querySelector(".ac-code-block__header")).toBeNull();
  });
});
