import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../atoms/avatar";
import { Text } from "../../atoms/text";
import { IconChart, IconHome, IconInbox, IconSettings } from "../../icons";
import { Stack } from "../../layout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";

const meta = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkspaceNavigation: Story = {
  render: () => (
    <SidebarProvider>
      <div style={{ display: "flex", minBlockSize: "28rem" }}>
        <Sidebar>
          <SidebarHeader>
            <Avatar name="AtomCraft" fallback="AC" size="sm" tone="primary" shape="square" />
            <Text weight="semibold" className="ac-nav-item__label">
              AtomCraft
            </Text>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Workspace">
              <SidebarItem href="#overview" icon={<IconHome />} tooltip="Overview" active>
                Overview
              </SidebarItem>
              <SidebarItem href="#analytics" icon={<IconChart />} tooltip="Analytics">
                Analytics
              </SidebarItem>
              <SidebarItem href="#inbox" icon={<IconInbox />} tooltip="Inbox" badge={3}>
                Inbox
              </SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Manage">
              <SidebarItem href="#settings" icon={<IconSettings />} tooltip="Settings">
                Settings
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Avatar name="Amel Ben Salah" size="sm" status="online" />
            <Text size="sm" className="ac-nav-item__label">
              Amel Ben Salah
            </Text>
          </SidebarFooter>
        </Sidebar>
        <main
          style={{
            flex: 1,
            padding: "var(--ac-space-6)",
            background: "var(--ac-color-bg-surface)",
            color: "var(--ac-color-text-primary)",
          }}
        >
          <Stack gap="4">
            <SidebarTrigger />
            <Text size="lg" weight="semibold">
              Workspace overview
            </Text>
            <Text tone="secondary">
              Use the trigger to collapse the desktop navigation or open the mobile drawer.
            </Text>
          </Stack>
        </main>
      </div>
    </SidebarProvider>
  ),
};
