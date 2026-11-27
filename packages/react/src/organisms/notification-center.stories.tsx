import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationCenter } from "./catalog-collaboration";

const meta = {
  title: "Organisms/NotificationCenter",
  component: NotificationCenter,
  args: {
    label: "Notifications",
    markReadLabel: "Mark read",
    dismissLabel: "Dismiss",
    emptyLabel: "You are all caught up.",
    notifications: [
      {
        id: "review",
        title: "Review requested",
        description: "Morgan mentioned you in the button review.",
        time: "5 minutes ago",
        read: false,
      },
      {
        id: "release",
        title: "Release complete",
        description: "Version 0.1.1 is available.",
        time: "Yesterday",
        read: true,
      },
    ],
    onMarkRead: () => undefined,
    onDismiss: () => undefined,
  },
} satisfies Meta<typeof NotificationCenter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Notifications: Story = {};
export const Empty: Story = { args: { notifications: [] } };
