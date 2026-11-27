import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  args: { totalPages: 12, defaultPage: 5 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = { args: { totalPages: 5, defaultPage: 2, siblings: 0 } };

export const BoundaryPages: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--ac-space-4)" }}>
      <Pagination totalPages={8} defaultPage={1} />
      <Pagination totalPages={8} defaultPage={8} />
    </div>
  ),
};
