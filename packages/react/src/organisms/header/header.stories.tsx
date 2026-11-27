import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../atoms/avatar";
import { Button } from "../../atoms/button";
import { Text } from "../../atoms/text";
import { IconChart, IconHome, IconInbox } from "../../icons";
import { Stack } from "../../layout";
import { NavItem } from "../../molecules/nav-item";
import { Header } from "./header";

const meta = {
  title: "Organisms/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResponsiveNavigation: Story = {
  render: () => (
    <Stack gap="6" style={{ inlineSize: "100%" }}>
      <Header
        sticky={false}
        brand={<Text weight="semibold">AtomCraft</Text>}
        actions={
          <Stack direction="row" gap="2" align="center">
            <Button variant="outline" tone="neutral" size="sm">
              Documentation
            </Button>
            <Avatar name="Amel Ben Salah" size="sm" />
          </Stack>
        }
      >
        <NavItem href="#overview" icon={<IconHome />} active>
          Overview
        </NavItem>
        <NavItem href="#analytics" icon={<IconChart />}>
          Analytics
        </NavItem>
        <NavItem href="#inbox" icon={<IconInbox />}>
          Inbox
        </NavItem>
      </Header>
      <Text tone="secondary" style={{ paddingInline: "var(--ac-space-6)" }}>
        Resize the preview to see navigation move into the header menu on narrow screens.
      </Text>
    </Stack>
  ),
};
