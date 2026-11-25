import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Field } from "../molecules/field";
import { AtomCraftProvider } from "../provider";
import { expectNoA11yViolations } from "../test/a11y";
import { CommandPalette } from "./command-palette";
import type { Command } from "./command-palette";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "./dialog";
import { ErrorSummary, Form, FormActions, FormSection } from "./form";
import { LocaleSwitcher, ThemeSwitcher } from "./switchers";

describe("AlertDialog", () => {
  it("is an alertdialog that needs an explicit choice", async () => {
    const onConfirm = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title="Delete invoice?"
          description="This cannot be undone."
          confirmLabel="Delete invoice"
          onConfirm={onConfirm}
        />
      </AlertDialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    const dialog = screen.getByRole("alertdialog", { name: "Delete invoice?" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    expect(within(dialog).queryByRole("button", { name: "Close" })).not.toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole("button", { name: "Delete invoice" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("closes on Cancel without confirming", async () => {
    const onConfirm = vi.fn();
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent title="Leave?" description="Changes are lost." onConfirm={onConfirm} />
      </AlertDialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});

describe("CommandPalette", () => {
  const commands = (run = vi.fn()): Command[] => [
    { id: "home", label: "Go to dashboard", group: "Navigation", onSelect: run },
    { id: "invoice", label: "New invoice", group: "Create", onSelect: run },
    { id: "team", label: "Invite teammate", group: "Create", disabled: true, onSelect: run },
    { id: "theme", label: "Switch appearance", keywords: ["dark", "theme"], onSelect: run },
  ];

  it("opens with Ctrl+K and filters on keywords", async () => {
    render(<CommandPalette commands={commands()} />);
    await userEvent.keyboard("{Control>}k{/Control}");

    const search = screen.getByRole("combobox", { name: "Command palette" });
    await userEvent.type(search, "dark");
    expect(screen.getByRole("option", { name: "Switch appearance" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("runs the active command with Enter and closes", async () => {
    const run = vi.fn();
    render(<CommandPalette commands={commands(run)} defaultOpen />);
    /** The dialog autofocuses the box in a browser; jsdom needs the click. */
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(run).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("skips disabled commands and says when nothing matches", async () => {
    const run = vi.fn();
    render(<CommandPalette commands={commands(run)} defaultOpen />);
    const search = screen.getByRole("combobox");

    await userEvent.type(search, "invit");
    await userEvent.keyboard("{Enter}");
    expect(run).not.toHaveBeenCalled();

    await userEvent.clear(search);
    await userEvent.type(search, "zzz");
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<CommandPalette commands={commands()} defaultOpen />);
    await expectNoA11yViolations(container);
  });
});

describe("Form and ErrorSummary", () => {
  it("lists the errors and sends focus to the field", async () => {
    render(
      <Form>
        <ErrorSummary
          errors={[{ fieldId: "email", label: "Email", message: "Email is required" }]}
        />
        <Field label="Email" error="Email is required">
          <Input id="email" />
        </Field>
        <FormActions>
          <Button type="submit">Save</Button>
        </FormActions>
      </Form>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("1 field needs your attention");
    expect(alert).toHaveFocus();

    await userEvent.click(screen.getByRole("link", { name: "Email: Email is required" }));
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveFocus();
  });

  it("uses the plural wording for several errors", () => {
    render(
      <ErrorSummary
        errors={[
          { fieldId: "a", label: "Email", message: "Required" },
          { fieldId: "b", label: "Name", message: "Required" },
        ]}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("2 fields need your attention");
  });

  it("renders nothing without errors", () => {
    render(<ErrorSummary errors={[]} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("groups fields under a legend and does not use native validation", () => {
    const { container } = render(
      <Form>
        <FormSection title="Billing" description="Where the invoice goes.">
          <Field label="Company">
            <Input />
          </Field>
        </FormSection>
      </Form>,
    );
    expect(screen.getByRole("group", { name: /Billing/ })).toBeInTheDocument();
    expect(container.querySelector("form")).toHaveAttribute("novalidate");
  });
});

describe("ThemeSwitcher and LocaleSwitcher", () => {
  it("switches the colour mode of the provider", async () => {
    const { container } = render(
      <AtomCraftProvider defaultMode="light">
        <ThemeSwitcher />
      </AtomCraftProvider>,
    );
    expect(container.querySelector(".ac-root")).toHaveAttribute("data-ac-mode", "light");

    await userEvent.click(screen.getByRole("button", { name: /Light/ }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));
    expect(container.querySelector(".ac-root")).toHaveAttribute("data-ac-mode", "dark");
  });

  it("switches the locale, which switches the direction and the labels", async () => {
    const { container } = render(
      <AtomCraftProvider defaultLocale="en">
        <LocaleSwitcher />
      </AtomCraftProvider>,
    );
    expect(container.querySelector(".ac-root")).toHaveAttribute("dir", "ltr");

    await userEvent.click(screen.getByRole("button", { name: /English/ }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: "العربية" }));

    const root = container.querySelector(".ac-root");
    expect(root).toHaveAttribute("dir", "rtl");
    expect(root).toHaveAttribute("lang", "ar");
    expect(screen.getByRole("button", { name: /العربية/ })).toBeInTheDocument();
  });
});
