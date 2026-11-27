import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "./segmented-control";

const meta = {
  title: "Molecules/SegmentedControl",
  component: SegmentedControl,
  args: {
    label: "Preview mode",
    options: [
      { value: "preview", label: "Preview" },
      { value: "code", label: "Code" },
      { value: "details", label: "Details" },
    ],
    defaultValue: "preview",
  },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Modes: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
