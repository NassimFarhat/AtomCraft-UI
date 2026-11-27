import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxGroup } from "./checkbox-group";

const meta = {
  title: "Molecules/CheckboxGroup",
  component: CheckboxGroup,
  args: {
    label: "Notifications",
    options: [
      {
        value: "product",
        label: "Product updates",
        description: "Release notes and new features.",
      },
      { value: "security", label: "Security alerts", description: "Important account activity." },
      { value: "events", label: "Events", disabled: true },
    ],
  },
} satisfies Meta<typeof CheckboxGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};
export const Horizontal: Story = { args: { orientation: "horizontal" } };
