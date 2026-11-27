import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingOverlay } from "./essentials";

const meta = {
  title: "Organisms/LoadingOverlay",
  component: LoadingOverlay,
  args: {
    loading: true,
    label: "Loading report",
    children: <div style={{ minBlockSize: 180, padding: 24 }}>Report content</div>,
  },
} satisfies Meta<typeof LoadingOverlay>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Loading: Story = {};
export const Ready: Story = { args: { loading: false } };
