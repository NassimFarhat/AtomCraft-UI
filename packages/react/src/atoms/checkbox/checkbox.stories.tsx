import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Label } from "../label";
import { Radio } from "../radio";
import { Switch } from "../switch";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Atoms/Checkbox, Radio & Switch",
  component: Checkbox,
  args: { "aria-label": "Accept the terms" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkboxes: Story = {
  render: () => (
    <Stack direction="row" gap="4" align="center">
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Mixed" indeterminate />
      <Checkbox aria-label="Invalid" invalid />
      <Checkbox aria-label="Disabled" disabled />
      <Checkbox aria-label="Disabled checked" disabled defaultChecked />
      <Checkbox aria-label="Success" tone="success" defaultChecked />
      <Checkbox aria-label="Large" size="lg" defaultChecked />
    </Stack>
  ),
};

export const Radios: Story = {
  render: () => (
    <Stack direction="row" gap="4" align="center">
      <Radio name="demo" aria-label="First" defaultChecked />
      <Radio name="demo" aria-label="Second" />
      <Radio name="demo" aria-label="Third" tone="success" />
      <Radio name="other" aria-label="Disabled" disabled />
      <Radio name="large" aria-label="Large" size="lg" defaultChecked />
    </Stack>
  ),
};

export const Switches: Story = {
  render: () => (
    <Stack gap="3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Stack key={size} direction="row" gap="3" align="center">
          <Switch id={`switch-${size}`} size={size} defaultChecked />
          <Label htmlFor={`switch-${size}`}>Notifications ({size})</Label>
        </Stack>
      ))}
      <Stack direction="row" gap="3" align="center">
        <Switch id="switch-danger" tone="danger" defaultChecked />
        <Label htmlFor="switch-danger">Danger tone</Label>
      </Stack>
      <Stack direction="row" gap="3" align="center">
        <Switch id="switch-disabled" disabled />
        <Label htmlFor="switch-disabled">Disabled</Label>
      </Stack>
    </Stack>
  ),
};
