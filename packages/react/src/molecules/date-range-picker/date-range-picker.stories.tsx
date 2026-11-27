import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./date-range-picker";

const meta = {
  title: "Molecules/DateRangePicker",
  component: DateRangePicker,
  args: { label: "Project window", startLabel: "Start date", endLabel: "End date" },
} satisfies Meta<typeof DateRangePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Range: Story = {};
