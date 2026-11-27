import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColorInput } from "./color-input";
import { ColorPicker } from "./color-picker";
import { DateRangePicker } from "./date-range-picker";
import { DateTimePicker } from "./date-time-picker";
import { FileUpload } from "./file-upload";
import { Rating } from "./rating";
import { TimePicker } from "./time-picker";

describe("picker and upload controls", () => {
  it("keeps a selected date range ordered", () => {
    render(
      <DateRangePicker
        label="Booking period"
        startLabel="Check in"
        endLabel="Check out"
        defaultValue={{ start: new Date(2026, 5, 10), end: new Date(2026, 5, 15) }}
      />,
    );
    expect(screen.getByRole("group", { name: "Booking period" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Check in" })).toHaveValue("2026-06-10");
    expect(screen.getByRole("textbox", { name: "Check out" })).toHaveValue("2026-06-15");
  });

  it("reports time string changes", () => {
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Start" onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText("Start"), { target: { value: "10:45" } });
    expect(onValueChange).toHaveBeenCalledWith("10:45");
  });

  it("converts local date-time input values to Date objects", () => {
    const onValueChange = vi.fn();
    render(<DateTimePicker aria-label="Meeting" onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText("Meeting"), { target: { value: "2026-06-10T10:45" } });
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 10, 10, 45));
  });

  it("reports chosen colors from both picker aliases", () => {
    const onValueChange = vi.fn();
    render(
      <>
        <ColorPicker aria-label="Brand" onValueChange={onValueChange} />
        <ColorInput aria-label="Accent" />
      </>,
    );
    fireEvent.change(screen.getByLabelText("Brand"), { target: { value: "#ff0000" } });
    expect(onValueChange).toHaveBeenCalledWith("#ff0000");
    expect(screen.getByLabelText("Accent")).toHaveAttribute("type", "color");
  });

  it("selects a rating with an accessible radio group", async () => {
    const onValueChange = vi.fn();
    render(<Rating label="Satisfaction" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Satisfaction 4" }));
    expect(onValueChange).toHaveBeenCalledWith(4);
  });

  it("adds and removes selected files without uploading them", async () => {
    const onValueChange = vi.fn();
    render(
      <FileUpload
        label="Attachments"
        description="Choose a text file."
        accept="text/plain"
        onValueChange={onValueChange}
      />,
    );
    const file = new File(["draft"], "draft.txt", { type: "text/plain" });
    await userEvent.upload(screen.getByLabelText("Attachments"), file);
    expect(onValueChange).toHaveBeenCalledWith([file]);
    await userEvent.click(screen.getByRole("button", { name: "Remove draft.txt" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });
});
