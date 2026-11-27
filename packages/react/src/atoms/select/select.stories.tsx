import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Label } from "../label";
import { Select } from "./select";

const meta = {
  title: "Atoms/Select",
  component: Select,
  args: { "aria-label": "Workspace" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "20rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Native HTML select. The closed control uses AtomCraft styles, while the opened option popup is drawn by the browser and operating system. For a fully themed popup, use the SelectMenu molecule.",
      },
    },
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NativeControl: Story = {
  render: (args) => (
    <Select {...args} defaultValue="design">
      <option value="design">Design systems</option>
      <option value="product">Product engineering</option>
    </Select>
  ),
};

export const States: Story = {
  render: () => (
    <Stack gap="4" style={{ inlineSize: "20rem", maxInlineSize: "calc(100vw - 5rem)" }}>
      <Stack gap="2">
        <Label htmlFor="select-default">Workspace</Label>
        <Select id="select-default" placeholder="Choose a workspace">
          <option value="design">Design systems</option>
          <option value="product">Product engineering</option>
        </Select>
      </Stack>
      <Select aria-label="Invalid plan" invalid defaultValue="">
        <option value="">Choose a plan</option>
        <option value="team">Team</option>
      </Select>
      <Select aria-label="Disabled plan" disabled defaultValue="team">
        <option value="team">Team</option>
      </Select>
    </Stack>
  ),
};
