import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataCard } from "./essentials";

const meta = {
  title: "Organisms/DataCard",
  component: DataCard,
  args: {
    title: "Active users",
    value: "1,284",
    description: "Compared with the previous 30 days",
  },
} satisfies Meta<typeof DataCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Metric: Story = {};
