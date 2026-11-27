import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter } from "./meter";

const meta = {
  title: "Atoms/Meter",
  component: Meter,
  args: { "aria-label": "Storage used", min: 0, max: 100, value: 72 },
  render: (args) => (
    <div style={{ inlineSize: "24rem", maxInlineSize: "calc(100vw - var(--ac-space-12))" }}>
      <Meter {...args} />
    </div>
  ),
} satisfies Meta<typeof Meter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Storage: Story = {};
export const Thresholds: Story = { args: { low: 40, high: 80, optimum: 30, value: 88 } };
