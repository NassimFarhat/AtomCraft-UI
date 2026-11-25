import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AtomCraftProvider } from "../provider";
import { expectNoA11yViolations } from "../test/a11y";
import { Calendar } from "./calendar";
import { Combobox, MultiSelect } from "./combobox";
import { DatePicker } from "./date-picker";
import { Field } from "./field";
import type { ListOption } from "./listbox";
import { SelectMenu } from "./select-menu";

const cities: ListOption[] = [
  { value: "sfax", label: "Sfax", group: "Tunisia" },
  { value: "tunis", label: "Tunis", group: "Tunisia" },
  { value: "kerkennah", label: "Kerkennah", group: "Tunisia", description: "Islands" },
  { value: "lyon", label: "Lyon", group: "France" },
  { value: "paris", label: "Paris", group: "France", disabled: true },
];

describe("Combobox", () => {
  it("filters as you type and chooses with Enter", async () => {
    const onValueChange = vi.fn();
    render(<Combobox options={cities} aria-label="City" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox", { name: "City" });

    await userEvent.type(input, "ker");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("kerkennah");
    expect(input).toHaveValue("Kerkennah");
  });

  it("matches without accents or case", async () => {
    render(
      <Combobox options={[{ value: "medina", label: "Médina Studio" }]} aria-label="Customer" />,
    );
    await userEvent.type(screen.getByRole("combobox"), "MEDI");
    expect(screen.getByRole("option", { name: /Médina Studio/ })).toBeInTheDocument();
  });

  it("opens with the arrow keys and skips disabled options", async () => {
    render(<Combobox options={cities} aria-label="City" />);
    const input = screen.getByRole("combobox");
    input.focus();

    await userEvent.keyboard("{ArrowUp}");
    const listbox = screen.getByRole("listbox");
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(within(listbox).getByRole("option", { name: "Lyon" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(input.getAttribute("aria-activedescendant")).toBe(
      within(listbox).getByRole("option", { name: "Lyon" }).id,
    );
  });

  it("closes on Escape and clears the selection with the clear button", async () => {
    render(<Combobox options={cities} aria-label="City" defaultValue="sfax" clearable />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(input).toHaveValue("");
  });

  it("works inside a Field, which labels and describes it", () => {
    render(
      <Field label="City" error="Pick a city">
        <Combobox options={cities} />
      </Field>,
    );
    const input = screen.getByRole("combobox", { name: "City" });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("Pick a city");
  });

  it("submits the value, not the label", async () => {
    render(<Combobox options={cities} aria-label="City" name="city" defaultValue="tunis" />);
    expect(document.querySelector('input[name="city"]')).toHaveValue("tunis");
  });

  it("has no accessibility violations when open", async () => {
    const { container } = render(<Combobox options={cities} aria-label="City" />);
    await userEvent.click(screen.getByRole("combobox"));
    await expectNoA11yViolations(container);
  });
});

describe("MultiSelect", () => {
  it("keeps the list open, shows tags and removes the last with Backspace", async () => {
    const onValuesChange = vi.fn();
    render(<MultiSelect options={cities} aria-label="Cities" onValuesChange={onValuesChange} />);
    const input = screen.getByRole("combobox", { name: "Cities" });
    await userEvent.click(input);
    await userEvent.click(screen.getByRole("option", { name: "Sfax" }));
    await userEvent.click(screen.getByRole("option", { name: "Tunis" }));

    expect(onValuesChange).toHaveBeenLastCalledWith(["sfax", "tunis"]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Remove Sfax" }));
    expect(onValuesChange).toHaveBeenLastCalledWith(["tunis"]);

    input.focus();
    await userEvent.keyboard("{Backspace}");
    expect(onValuesChange).toHaveBeenLastCalledWith([]);
  });

  it("marks the list as multi-selectable", async () => {
    render(<MultiSelect options={cities} aria-label="Cities" defaultValues={["sfax"]} />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    expect(screen.getByRole("option", { name: "Sfax" })).toHaveAttribute("aria-selected", "true");
  });

  it("shows a count instead of tags beyond maxTags", async () => {
    render(
      <MultiSelect
        options={cities}
        aria-label="Cities"
        maxTags={1}
        defaultValues={["sfax", "tunis"]}
      />,
    );
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });
});

describe("SelectMenu", () => {
  it("opens, selects with the keyboard and closes", async () => {
    const onValueChange = vi.fn();
    render(<SelectMenu options={cities} aria-label="City" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "City" });
    expect(trigger).toHaveTextContent("Select an option");

    await userEvent.click(trigger);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("tunis");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent("Tunis");
  });

  it("jumps to an option when its first letters are typed", async () => {
    const onValueChange = vi.fn();
    render(<SelectMenu options={cities} aria-label="City" onValueChange={onValueChange} />);
    screen.getByRole("combobox").focus();
    await userEvent.keyboard("ly");
    expect(onValueChange).toHaveBeenCalledWith("lyon");
  });

  it("has no accessibility violations when open", async () => {
    const { container } = render(<SelectMenu options={cities} aria-label="City" />);
    await userEvent.click(screen.getByRole("combobox"));
    await expectNoA11yViolations(container);
  });
});

describe("Calendar", () => {
  const march = new Date(2026, 2, 15);

  it("renders a grid where only the focused day is tabbable", () => {
    render(<Calendar defaultValue={march} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
    const days = screen
      .getAllByRole("button")
      .filter((day) => day.dataset["slot"] === "calendar-day");
    expect(days.filter((day) => day.tabIndex === 0)).toHaveLength(1);
  });

  it("moves by day, week and month with the keyboard", async () => {
    render(<Calendar defaultValue={march} />);
    const day = screen.getByRole("button", {
      name: /15 March 2026|March 15, 2026|Sunday, March 15, 2026/,
    });
    day.focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveAccessibleName(/16/);
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveAccessibleName(/23/);
    await userEvent.keyboard("{PageUp}");
    expect(document.activeElement).toHaveAccessibleName(/February/);
  });

  it("selects a day and reports it", async () => {
    const onValueChange = vi.fn();
    render(<Calendar defaultMonth={march} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: /March 20, 2026|20 March 2026/ }));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 2, 20));
  });

  it("blocks days outside the bounds", async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar defaultMonth={march} min={new Date(2026, 2, 10)} onValueChange={onValueChange} />,
    );
    const blocked = screen.getByRole("button", { name: /March 5, 2026|5 March 2026/ });
    expect(blocked).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(blocked);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("reads the month in the current locale", () => {
    render(
      <AtomCraftProvider locale="fr">
        <Calendar defaultMonth={march} />
      </AtomCraftProvider>,
    );
    expect(screen.getByText("mars 2026")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Calendar defaultValue={march} />);
    await expectNoA11yViolations(container);
  });
});

describe("DatePicker", () => {
  it("accepts a typed ISO date and keeps a half-typed one", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due date" onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox", { name: "Due date" });

    await userEvent.type(input, "2026-11-2");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("2026-11-2");
    await userEvent.type(input, "4");
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 10, 24));
  });

  it("picks a date from the calendar and closes", async () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        aria-label="Due date"
        defaultValue={new Date(2026, 2, 15)}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open the calendar" }));
    const dialog = screen.getByRole("dialog", { name: "Calendar" });
    await userEvent.click(
      within(dialog).getByRole("button", { name: /March 20, 2026|20 March 2026/ }),
    );

    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 2, 20));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Due date" })).toHaveValue("2026-03-20");
  });

  it("clears the value when the text is emptied", async () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        aria-label="Due date"
        defaultValue={new Date(2026, 2, 15)}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.clear(screen.getByRole("textbox", { name: "Due date" }));
    expect(onValueChange).toHaveBeenCalledWith(null);
  });
});
