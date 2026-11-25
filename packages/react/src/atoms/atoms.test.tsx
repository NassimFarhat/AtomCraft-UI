import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { IconPlus } from "../icons";
import { AtomCraftProvider } from "../provider";
import { expectNoA11yViolations } from "../test/a11y";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Heading,
  IconButton,
  Input,
  Label,
  Link,
  Progress,
  Radio,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Text,
  Textarea,
} from "./index";

describe("Button", () => {
  it("uses safe defaults: type button, solid, primary, md", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-variant", "solid");
    expect(button).toHaveAttribute("data-tone", "primary");
    expect(button).toHaveAttribute("data-size", "md");
  });

  it("is activated with Enter and Space", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("is disabled and busy while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders its child with the button styles when asChild is set", () => {
    render(
      <Button asChild variant="outline" tone="neutral">
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveClass("ac-button");
    expect(link).toHaveAttribute("data-variant", "outline");
  });
});

describe("IconButton", () => {
  it("takes its accessible name from the label", () => {
    render(
      <IconButton label="Add item">
        <IconPlus />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Add item" })).toHaveAttribute("data-icon-only");
  });
});

describe("form atoms", () => {
  it("marks Input, Textarea and Select invalid", () => {
    render(
      <>
        <Input aria-label="Email" invalid />
        <Textarea aria-label="Bio" invalid />
        <Select aria-label="Country" invalid>
          <option>TN</option>
        </Select>
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInvalid();
    expect(screen.getByRole("textbox", { name: "Bio" })).toBeInvalid();
    expect(screen.getByRole("combobox", { name: "Country" })).toBeInvalid();
  });

  it("starts the Select on its placeholder", () => {
    render(
      <Select aria-label="Plan" placeholder="Choose a plan">
        <option value="pro">Pro</option>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toHaveDisplayValue("Choose a plan");
  });

  it("toggles a Checkbox with Space and exposes the mixed state", async () => {
    render(
      <>
        <Checkbox aria-label="Accept" />
        <Checkbox aria-label="All" indeterminate />
      </>,
    );
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "All" })).toBePartiallyChecked();
  });

  it("keeps Radio a real radio input", async () => {
    render(<Radio aria-label="Monthly" name="billing" />);
    await userEvent.click(screen.getByRole("radio", { name: "Monthly" }));
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("names a control with Label and hides the required marker from the name", () => {
    render(
      <>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input id="email" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
  });
});

describe("Switch", () => {
  it("toggles itself when uncontrolled", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Wi-Fi" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("follows its parent when controlled", async () => {
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return <Switch aria-label="Wi-Fi" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("does not move when the parent ignores the change", async () => {
    render(<Switch aria-label="Wi-Fi" checked={false} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });
});

describe("display atoms", () => {
  it("falls back to initials when the avatar image fails, and names the status", () => {
    const { container } = render(
      <Avatar name="Nassim Farhat" src="/broken.png" status="online" statusLabel="En ligne" />,
    );
    fireEvent.error(container.querySelector("img") as HTMLImageElement);
    expect(screen.getByRole("img", { name: "Nassim Farhat (En ligne)" })).toHaveTextContent("NF");
  });

  it("announces the spinner with the translated default label", () => {
    render(
      <AtomCraftProvider locale="fr">
        <Spinner />
      </AtomCraftProvider>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Chargement");
  });

  it("exposes determinate and indeterminate progress", () => {
    render(
      <>
        <Progress aria-label="Upload" value={40} />
        <Progress aria-label="Sync" />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
    expect(screen.getByRole("progressbar", { name: "Sync" })).not.toHaveAttribute("aria-valuenow");
  });

  it("makes a labeled separator decorative and keeps its text", () => {
    render(<Separator>or</Separator>);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(screen.getByText("or")).toBeInTheDocument();
  });

  it("keeps the outline level apart from the visual size", () => {
    render(
      <Heading level={1} size="display-lg">
        AtomCraft
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("data-size", "display-lg");
  });

  it("opens external links safely and says so", () => {
    render(
      <Link href="https://atomcraft.dev" external>
        Docs
      </Link>,
    );
    const link = screen.getByRole("link", { name: /^Docs\s?\(opens in a new tab\)$/ });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <Badge dot tone="success">
          Active
        </Badge>
        <Text tone="secondary">Body</Text>
        <Skeleton />
        <Button loading>Save</Button>
        <Switch aria-label="Notifications" defaultChecked />
        <Checkbox aria-label="Terms" />
        <Avatar name="Ada Lovelace" />
      </main>,
    );
    await expectNoA11yViolations(container);
  });
});
