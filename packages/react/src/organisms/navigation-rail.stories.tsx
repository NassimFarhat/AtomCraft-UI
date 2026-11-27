import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconChart, IconHome, IconInbox } from "../icons";
import { NavigationRail } from "./essentials";

const meta = {
  title: "Organisms/NavigationRail",
  component: NavigationRail,
  args: {
    label: "Workspace",
    items: [
      { id: "home", label: "Home", href: "#home", icon: <IconHome />, current: true },
      { id: "analytics", label: "Analytics", href: "#analytics", icon: <IconChart /> },
      { id: "inbox", label: "Inbox", href: "#inbox", icon: <IconInbox />, badge: 3 },
    ],
  },
} satisfies Meta<typeof NavigationRail>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Expanded: Story = {};
export const Collapsed: Story = { args: { collapsed: true } };
