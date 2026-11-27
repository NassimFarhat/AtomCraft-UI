import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconArrowUp, IconUser } from "../../icons";
import { Stat } from "./stat";

const meta = {
  title: "Molecules/Stat",
  component: Stat,
  args: { label: "Monthly revenue", value: "$24,800" },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetricCards: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "var(--ac-space-4)",
        maxInlineSize: "38rem",
      }}
    >
      <Stat
        label="Monthly revenue"
        value="$24,800"
        delta="+12.4%"
        trend="up"
        caption="vs last month"
      />
      <Stat label="Active members" value="1,284" icon={<IconUser />} />
      <Stat label="Failed jobs" value="18" delta="-3.1%" trend="down" invertTrend />
      <Stat label="Conversion" value="4.8%" delta="+0.2%" trend="up" icon={<IconArrowUp />} />
    </div>
  ),
};
