import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconHome, IconInbox, IconSettings } from "../icons";
import { BottomNavigation } from "./catalog-navigation";

const meta = {
  title: "Organisms/BottomNavigation",
  component: BottomNavigation,
  args: {
    label: "Mobile navigation",
    items: [
      { id: "home", label: "Home", href: "#home", icon: <IconHome />, current: true },
      { id: "inbox", label: "Inbox", href: "#inbox", icon: <IconInbox />, badge: 3 },
      { id: "settings", label: "Settings", href: "#settings", icon: <IconSettings /> },
    ],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof BottomNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
