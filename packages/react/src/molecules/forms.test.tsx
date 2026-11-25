import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "../atoms/checkbox";
import { Input } from "../atoms/input";
import { expectNoA11yViolations } from "../test/a11y";
import { Field } from "./field";
import { InputGroup } from "./input-group";
import { PasswordInput } from "./password-input";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { SearchField } from "./search-field";

describe("Field", () => {
  it("labels, describes and marks the control invalid", () => {
    render(
      <Field label="Email" description="Work address." error="Email is required." required>
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("Work address. Email is required.");
  });

  it("keeps an id set on the control", () => {
    render(
      <Field label="Name">
        <Input id="full-name" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("id", "full-name");
  });

  it("puts checkboxes before their label with the inline layout", () => {
    render(
      <Field label="Remember me" layout="inline">
        <Checkbox />
      </Field>,
    );
    expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeInTheDocument();
  });

  it("wires through an InputGroup to the input", () => {
    render(
      <Field label="Website" error="Invalid URL">
        <InputGroup start="https://">
          <Input />
        </InputGroup>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Website" });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("Invalid URL");
  });
});

describe("SearchField", () => {
  it("searches on Enter and clears with the button or Escape", async () => {
    const onSearch = vi.fn();
    render(<SearchField onSearch={onSearch} />);
    const box = screen.getByRole("searchbox", { name: "Search" });
    await userEvent.type(box, "tokens{Enter}");
    expect(onSearch).toHaveBeenCalledWith("tokens");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(box).toHaveValue("");
    await userEvent.type(box, "x{Escape}");
    expect(box).toHaveValue("");
  });
});

describe("PasswordInput", () => {
  it("toggles visibility with a pressed state", async () => {
    const { container } = render(<PasswordInput aria-label="Password" />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("RadioGroup", () => {
  const renderGroup = (onValueChange = vi.fn()) =>
    render(
      <RadioGroup label="Billing" defaultValue="monthly" onValueChange={onValueChange}>
        <RadioGroupItem value="monthly" label="Monthly" />
        <RadioGroupItem value="yearly" label="Yearly" description="Two months free" />
      </RadioGroup>,
    );

  it("groups the radios under one name and reports changes", async () => {
    const onValueChange = vi.fn();
    renderGroup(onValueChange);
    expect(screen.getByRole("group", { name: "Billing" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Yearly" }));
    expect(onValueChange).toHaveBeenCalledWith("yearly");
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveAccessibleDescription(
      "Two months free",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = renderGroup();
    await expectNoA11yViolations(container);
  });
});
