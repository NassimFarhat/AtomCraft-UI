import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressOverlay } from "./essentials";

const meta = {
  title: "Organisms/ProgressOverlay",
  component: ProgressOverlay,
  args: {
    value: 68,
    label: "Uploading files",
    children: <div style={{ minBlockSize: 180, padding: 24 }}>Upload queue</div>,
  },
} satisfies Meta<typeof ProgressOverlay>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Upload: Story = {};
