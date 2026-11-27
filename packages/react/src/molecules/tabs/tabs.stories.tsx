import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../../atoms/text";
import { IconBell, IconSettings, IconUser } from "../../icons";
import { Stack } from "../../layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  args: { defaultValue: "account" },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const panels = (
  <>
    <TabsContent value="account">
      <Text tone="secondary">Update your name, email and avatar.</Text>
    </TabsContent>
    <TabsContent value="notifications">
      <Text tone="secondary">Choose what you want to be notified about.</Text>
    </TabsContent>
    <TabsContent value="settings">
      <Text tone="secondary">Workspace preferences and integrations.</Text>
    </TabsContent>
  </>
);

const triggers = (
  <>
    <TabsTrigger value="account">
      <IconUser /> Account
    </TabsTrigger>
    <TabsTrigger value="notifications">
      <IconBell /> Notifications
    </TabsTrigger>
    <TabsTrigger value="settings">
      <IconSettings /> Settings
    </TabsTrigger>
  </>
);

export const Variants: Story = {
  render: () => (
    <Stack gap="8">
      {(["line", "pills", "segmented"] as const).map((variant) => (
        <Tabs key={variant} defaultValue="account" variant={variant}>
          <TabsList aria-label={`${variant} tabs`}>{triggers}</TabsList>
          {panels}
        </Tabs>
      ))}
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical" variant="pills">
      <TabsList aria-label="Settings sections">{triggers}</TabsList>
      {panels}
    </Tabs>
  ),
};
