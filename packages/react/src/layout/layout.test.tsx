import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AtomCraftProvider } from "../provider";
import { useMessages } from "../provider";
import { Container, Grid, Stack } from "./layout";

describe("layout primitives", () => {
  it("map props to token-based CSS variables", () => {
    render(
      <Container size="md" data-testid="container">
        <Stack gap="6" direction={{ base: "column", md: "row" }} data-testid="stack" />
        <Grid columns={{ base: 1, lg: 3 }} data-testid="grid" />
        <Grid minItemWidth="16rem" data-testid="fluid" />
      </Container>,
    );
    const stack = screen.getByTestId("stack");
    expect(stack.style.getPropertyValue("--_gap")).toBe("var(--ac-space-6)");
    expect(stack.style.getPropertyValue("--_direction-md")).toBe("row");
    expect(screen.getByTestId("grid").style.getPropertyValue("--_columns-lg")).toBe("3");
    expect(screen.getByTestId("fluid")).toHaveAttribute("data-fluid");
    expect(screen.getByTestId("container")).toHaveAttribute("data-size", "md");
  });
});

describe("AtomCraftProvider", () => {
  function Close() {
    return <span>{useMessages().close}</span>;
  }

  it("derives RTL from Arabic locales and translates built-in labels", () => {
    const { container } = render(
      <AtomCraftProvider locale="ar-TN" mode="dark" theme="emerald">
        <Close />
      </AtomCraftProvider>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("dir", "rtl");
    expect(root).toHaveAttribute("lang", "ar-TN");
    expect(root).toHaveAttribute("data-ac-mode", "dark");
    expect(root).toHaveAttribute("data-ac-theme", "emerald");
  });

  it("lets the application override any label", () => {
    render(
      <AtomCraftProvider messages={{ close: "Done" }}>
        <Close />
      </AtomCraftProvider>,
    );
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});
