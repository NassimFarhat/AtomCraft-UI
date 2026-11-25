import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AtomCraftProvider } from "../provider";
import { expectNoA11yViolations } from "../test/a11y";
import { Icon, iconNames } from "./icon";
import { ProgressCircle } from "./progress";
import { Slider, SliderRange } from "./slider";
import { Tag } from "./tag";

describe("Icon", () => {
  it("renders a built-in icon by name, hidden unless it is named", () => {
    const { container } = render(<Icon name="Check" />);
    expect(container.querySelector('[data-icon="Check"]')).toHaveAttribute("aria-hidden", "true");
    render(<Icon name="Search" label="Search" />);
    expect(screen.getByRole("img", { name: "Search" })).toBeInTheDocument();
  });

  it("lists every built-in name", () => {
    expect(iconNames).toContain("ChevronDown");
    expect(iconNames.length).toBeGreaterThan(40);
  });
});

describe("Slider", () => {
  it("exposes the APG slider role and value", () => {
    render(<Slider label="Volume" defaultValue={40} max={80} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("aria-valuenow", "40");
    expect(slider).toHaveAttribute("aria-valuemax", "80");
  });

  it("moves with the arrow, Page, Home and End keys", async () => {
    const onValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={50} step={5} onValueChange={onValueChange} />);
    const slider = screen.getByRole("slider");
    slider.focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(55);
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(onValueChange).toHaveBeenLastCalledWith(45);
    await userEvent.keyboard("{PageUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(95);
    await userEvent.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    await userEvent.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith(100);
  });

  it("mirrors the horizontal arrows in a right-to-left layout", async () => {
    const onValueChange = vi.fn();
    render(
      <AtomCraftProvider locale="ar">
        <Slider label="الصوت" defaultValue={50} step={10} onValueChange={onValueChange} />
      </AtomCraftProvider>,
    );
    screen.getByRole("slider").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(40);
  });

  it("stays inside its bounds and submits its value", async () => {
    render(<Slider label="Volume" defaultValue={0} name="volume" />);
    const slider = screen.getByRole("slider");
    slider.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(slider).toHaveAttribute("aria-valuenow", "0");
    expect(document.querySelector('input[name="volume"]')).toHaveValue("0");
  });

  it("ignores the keyboard when disabled", async () => {
    const onValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={10} disabled onValueChange={onValueChange} />);
    screen.getByRole("slider").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Slider label="Volume" defaultValue={30} marks={[{ value: 0, label: "0" }]} />,
    );
    await expectNoA11yViolations(container);
  });
});

describe("SliderRange", () => {
  it("names both thumbs and keeps them from crossing", async () => {
    const onValueChange = vi.fn();
    render(
      <SliderRange
        labels={["Minimum", "Maximum"]}
        defaultValue={[20, 25]}
        step={5}
        onValueChange={onValueChange}
      />,
    );
    const [start, end] = screen.getAllByRole("slider");
    expect(start).toHaveAccessibleName("Minimum");
    expect(end).toHaveAccessibleName("Maximum");
    expect(start).toHaveAttribute("aria-valuemax", "25");

    start?.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([25, 25]);
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
});

describe("Tag", () => {
  it("removes itself through a named button", async () => {
    const onRemove = vi.fn();
    render(
      <Tag removeLabel="Remove Design" onRemove={onRemove}>
        Design
      </Tag>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove Design" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("has no remove button without a handler", () => {
    render(<Tag>Design</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("ProgressCircle", () => {
  it("reports its value, and none while indeterminate", () => {
    render(<ProgressCircle value={25} aria-label="Upload" showValue />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "25");
    expect(bar).toHaveTextContent("25%");

    render(<ProgressCircle aria-label="Loading" />);
    expect(screen.getByRole("progressbar", { name: "Loading" })).not.toHaveAttribute(
      "aria-valuenow",
    );
  });
});
