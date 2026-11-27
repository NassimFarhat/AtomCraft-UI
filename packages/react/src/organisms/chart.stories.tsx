import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "./catalog-workflow";

const meta = {
  title: "Organisms/Chart",
  component: Chart,
  args: {
    label: "Weekly package installs",
    categoryLabel: "Day",
    valueLabel: "Installs",
    data: [
      { label: "Mon", value: 120 },
      { label: "Tue", value: 160 },
      { label: "Wed", value: 142 },
      { label: "Thu", value: 210 },
      { label: "Fri", value: 188 },
    ],
  },
} satisfies Meta<typeof Chart>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Bars: Story = {};
export const Line: Story = { args: { type: "line" } };
