import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AtomCraftProvider } from "../provider";
import { expectNoA11yViolations } from "../test/a11y";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const renderTabs = (dir: "ltr" | "rtl" = "ltr") =>
  render(
    <AtomCraftProvider dir={dir}>
      <Tabs defaultValue="account">
        <TabsList aria-label="Settings">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="billing">Billing panel</TabsContent>
        <TabsContent value="team">Team panel</TabsContent>
      </Tabs>
    </AtomCraftProvider>,
  );

describe("Tabs", () => {
  it("links tabs and panels and shows only the active panel", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Account" })).toHaveTextContent("Account panel");
    expect(screen.queryByText("Billing panel")).not.toBeVisible();
  });

  it("moves and selects with arrows, Home and End (one tab stop)", async () => {
    renderTabs();
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Team" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Team" })).toHaveAttribute("tabindex", "-1");
  });

  it("follows the reading direction in RTL", async () => {
    renderTabs("rtl");
    await userEvent.tab();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveFocus();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderTabs();
    await expectNoA11yViolations(container);
  });
});

describe("Accordion", () => {
  const renderAccordion = (type: "single" | "multiple", onValueChange = vi.fn()) =>
    render(
      <Accordion type={type} onValueChange={onValueChange}>
        <AccordionItem value="a">
          <AccordionTrigger>What is AtomCraft?</AccordionTrigger>
          <AccordionContent>A design system.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Is it free?</AccordionTrigger>
          <AccordionContent>Yes, MIT.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

  it("keeps a single item open and announces the state", async () => {
    renderAccordion("single");
    const first = screen.getByRole("button", { name: "What is AtomCraft?" });
    const second = screen.getByRole("button", { name: "Is it free?" });
    await userEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "What is AtomCraft?" })).toBeVisible();
    await userEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("opens several items in multiple mode and moves between headers with arrows", async () => {
    const onValueChange = vi.fn();
    renderAccordion("multiple", onValueChange);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
  });
});
