import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Code, ColorSwatch, Image, Logo, Meter, StatusDot, Toggle } from "./index";

describe("additional atom primitives", () => {
  it("renders inline Code semantically", () => {
    render(<Code>pnpm build</Code>);
    expect(screen.getByText("pnpm build").tagName).toBe("CODE");
  });

  it("toggles its pressed state and reports the new value", () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
    const toggle = screen.getByRole("button", { name: "Bold" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("keeps a controlled Toggle controlled", () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Italic
      </Toggle>,
    );
    const toggle = screen.getByRole("button", { name: "Italic" });
    fireEvent.click(toggle);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("exposes ColorSwatch selection and caller-provided color", () => {
    const onSelectedChange = vi.fn();
    render(
      <ColorSwatch color="rebeccapurple" label="Violet" onSelectedChange={onSelectedChange} />,
    );
    const swatch = screen.getByRole("button", { name: "Violet" });
    expect(swatch).toHaveAttribute("aria-pressed", "false");
    expect(swatch.style.getPropertyValue("--_swatch-color")).toBe("rebeccapurple");
    fireEvent.click(swatch);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it("uses the supplied accessible label for a status", () => {
    render(<StatusDot status="online" label="Connected" />);
    expect(screen.getByRole("img", { name: "Connected" })).toHaveAttribute("data-tone", "success");
  });

  it("forwards native meter semantics", () => {
    render(<Meter aria-label="Storage used" min={0} max={100} value={60} />);
    expect(screen.getByRole("meter", { name: "Storage used" })).toHaveAttribute("value", "60");
  });

  it("renders a caller-provided image fallback after a load error", () => {
    render(<Image src="/broken.png" alt="Profile photo" fallback="Photo unavailable" />);
    fireEvent.error(screen.getByRole("img", { name: "Profile photo" }));
    expect(screen.getByRole("img", { name: "Profile photo" })).toHaveTextContent(
      "Photo unavailable",
    );
  });

  it("renders a customizable brand lockup", () => {
    render(<Logo mark={<span>AC</span>}>AtomCraft</Logo>);
    expect(screen.getByText("AtomCraft")).toBeInTheDocument();
    expect(screen.getByText("AC").parentElement).toHaveAttribute("aria-hidden", "true");
  });
});
