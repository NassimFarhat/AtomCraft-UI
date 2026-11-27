import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroup } from "./checkbox-group";
import { NumberInput } from "./number-input";
import { OTPInput } from "./otp-input";
import { PhoneInput } from "./phone-input";
import { QuantityInput } from "./quantity-input";
import { TagInput } from "./tag-input";

describe("form control additions", () => {
  it("increments and clamps a numeric value", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberInput
        aria-label="Quantity"
        decreaseLabel="Decrease quantity"
        increaseLabel="Increase quantity"
        defaultValue={2}
        min={0}
        max={3}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(3);
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("provides the phone input hints through the native input", () => {
    render(<PhoneInput aria-label="Phone number" />);
    expect(screen.getByRole("textbox", { name: "Phone number" })).toHaveAttribute(
      "autocomplete",
      "tel",
    );
  });

  it("moves OTP focus and distributes pasted digits", async () => {
    const onValueChange = vi.fn();
    render(<OTPInput label="Code" length={4} onValueChange={onValueChange} />);
    const first = screen.getByRole("textbox", { name: "Code 1" });
    await userEvent.type(first, "1");
    expect(screen.getByRole("textbox", { name: "Code 2" })).toHaveFocus();
    fireEvent.paste(screen.getByRole("textbox", { name: "Code 2" }), {
      clipboardData: { getData: () => "234" },
    });
    expect(onValueChange).toHaveBeenLastCalledWith("1234");
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();
  });

  it("reports checkbox group selection changes", async () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        label="Preferences"
        options={[{ value: "weekly", label: "Weekly summary" }]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Weekly summary" }));
    expect(onValueChange).toHaveBeenCalledWith(["weekly"]);
  });

  it("adds and removes tags through keyboard and accessible actions", async () => {
    const onValueChange = vi.fn();
    render(
      <TagInput aria-label="Add tag" defaultValue={["Design"]} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole("textbox", { name: "Add tag" });
    await userEvent.type(input, "Research{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(["Design", "Research"]);
    await userEvent.click(screen.getByRole("button", { name: "Remove Design" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["Research"]);
  });

  it("sets quantity defaults while allowing caller-provided labels", () => {
    render(
      <QuantityInput
        aria-label="Seats"
        decreaseLabel="Remove seat"
        increaseLabel="Add seat"
        defaultValue={1}
      />,
    );
    expect(screen.getByRole("spinbutton", { name: "Seats" })).toHaveAttribute("min", "0");
    expect(screen.getByRole("button", { name: "Add seat" })).toBeInTheDocument();
  });
});
