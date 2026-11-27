import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../atoms/avatar";
import { IconChart, IconHome, IconInbox, IconSettings } from "../icons";
import { Stack } from "../layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage } from "../molecules/breadcrumb";
import { NavItem } from "../molecules/nav-item";
import { Text } from "../atoms/text";
import { AppShell } from "../templates/app-shell";
import {
  Header,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarTrigger,
} from "./index";

const meta = { title: "Examples/Workspace shell" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function StorySidebar() {
  return (
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
        <Avatar name="Nassim Farhat" size="sm" status="online" />
        <Text size="sm" className="ac-nav-item__label">
          Nassim Farhat
        </Text>
      </SidebarFooter>
    </Sidebar>
  );
}

export const ResponsiveShell: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <AppShell
      sidebar={<StorySidebar />}
      header={
        <Header
          start={<SidebarTrigger />}
          brand={
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          }
          actions={<NavItem href="#docs">Documentation</NavItem>}
        />
      }
    >
      <Stack gap="4" style={{ maxInlineSize: "48rem" }}>
        <Text size="lg" weight="semibold">
          A shell that scales from a desktop workspace to a mobile drawer.
        </Text>
        <Text tone="secondary">
          Resize the canvas to verify the skip link, sidebar collapse and responsive navigation.
        </Text>
      </Stack>
    </AppShell>
  ),
};
