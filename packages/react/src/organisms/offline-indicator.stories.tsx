import type { Meta, StoryObj } from "@storybook/react-vite";
import { OfflineIndicator } from "./essentials";

const meta = {
  title: "Organisms/OfflineIndicator",
  component: OfflineIndicator,
  args: { online: false, onlineLabel: "Connected", offlineLabel: "You are offline" },
} satisfies Meta<typeof OfflineIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Offline: Story = {};
export const Online: Story = { args: { online: true } };
