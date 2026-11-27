import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../atoms/badge";
import { IconChart, IconHome, IconInbox, IconSettings } from "../../icons";
import { Stack } from "../../layout";
import { NavItem } from "./nav-item";

const meta = { title: "Molecules/NavItem", component: NavItem } satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NavigationStates: Story = {
  render: () => (
    <Stack gap="2" style={{ inlineSize: "16rem" }}>
      <NavItem href="#overview" icon={<IconHome />} active>
        Overview
      </NavItem>
      <NavItem href="#analytics" icon={<IconChart />}>
        Analytics
      </NavItem>
      <NavItem href="#inbox" icon={<IconInbox />} badge={<Badge>3</Badge>}>
        Inbox
      </NavItem>
      <NavItem href="#settings" icon={<IconSettings />}>
        Settings
      </NavItem>
    </Stack>
  ),
};
