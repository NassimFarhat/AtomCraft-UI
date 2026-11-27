import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Atoms/Checkbox",
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
