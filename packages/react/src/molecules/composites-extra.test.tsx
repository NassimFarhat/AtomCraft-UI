import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../atoms/button";
import { ButtonGroup } from "./button-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { CustomSelect } from "./custom-select";
import { SegmentedControl } from "./segmented-control";
import { SplitButton } from "./split-button";
import { Stepper } from "./stepper";
import { ToggleGroup } from "./toggle-group";

describe("selection and action composites", () => {
  it("groups related buttons with a named group role", () => {
    render(
      <ButtonGroup aria-label="Document actions">
        <Button>Save</Button>
        <Button>Publish</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group", { name: "Document actions" })).toBeInTheDocument();
  });

  it("supports radio semantics and arrow-key selection in a segmented control", async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        label="View"
        defaultValue="grid"
        onValueChange={onValueChange}
        options={[
          { value: "grid", label: "Grid" },
          { value: "list", label: "List" },
        ]}
      />,
    );
    const grid = screen.getByRole("radio", { name: "Grid" });
    await userEvent.click(grid);
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "List" })).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenLastCalledWith("list");
  });

  it("supports multiple independent values in ToggleGroup", async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        label="Formatting"
        type="multiple"
        onValueChange={onValueChange}
        options={[
          { value: "bold", label: "Bold" },
          { value: "italic", label: "Italic" },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    await userEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["bold", "italic"]);
  });

  it("composes a primary action with a related menu", async () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <SplitButton
        label="Save"
        menuLabel="More save options"
        onClick={onClick}
        actions={[{ id: "draft", label: "Save as draft", onSelect }]}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("button", { name: "More save options" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Save as draft" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("reuses the custom select popup for the CustomSelect alias", async () => {
    render(
      <CustomSelect
        aria-label="Role"
        options={[
          { value: "editor", label: "Editor" },
          { value: "viewer", label: "Viewer" },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole("combobox", { name: "Role" }));
    await userEvent.click(await screen.findByRole("option", { name: "Editor" }));
    expect(screen.getByRole("combobox", { name: "Role" })).toHaveTextContent("Editor");
  });

  it("exposes the current workflow step and a working disclosure", async () => {
    render(
      <>
        <Stepper
          label="Setup"
          currentStep={2}
          steps={[
            { id: "one", label: "Account" },
            { id: "two", label: "Profile" },
          ]}
        />
        <Collapsible>
          <CollapsibleTrigger>Advanced</CollapsibleTrigger>
          <CollapsibleContent>Advanced preferences</CollapsibleContent>
        </Collapsible>
      </>,
    );
    expect(screen.getByText("Profile").closest("li")).toHaveAttribute("aria-current", "step");
    const content = screen.getByText("Advanced preferences");
    expect(content).not.toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Advanced" }));
    expect(content).toBeVisible();
  });
});
