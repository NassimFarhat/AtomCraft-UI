import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../atoms/button";
import { Kbd } from "../../atoms/kbd";
import { Text } from "../../atoms/text";
import {
  IconCalendar,
  IconHome,
  IconMail,
  IconSettings,
  IconSparkles,
  IconUser,
} from "../../icons";
import { Stack } from "../../layout";
import { CommandPalette } from "./command-palette";
import type { Command } from "./commands";

const action = (label: string) => () => globalThis.console.warn(`Ran: ${label}`);

const commands: Command[] = [
  {
    id: "dashboard",
    label: "Go to dashboard",
    group: "Navigation",
    icon: <IconHome />,
    onSelect: action("dashboard"),
  },
  {
    id: "invoices",
    label: "Go to invoices",
    group: "Navigation",
    icon: <IconMail />,
    onSelect: action("invoices"),
  },
  {
    id: "settings",
    label: "Open settings",
    group: "Navigation",
    icon: <IconSettings />,
    shortcut: <Kbd>⌘,</Kbd>,
    onSelect: action("settings"),
  },
  {
    id: "invoice",
    label: "New invoice",
    group: "Create",
    icon: <IconSparkles />,
    keywords: ["bill", "facture"],
    onSelect: action("invoice"),
  },
  {
    id: "event",
    label: "New event",
    group: "Create",
    icon: <IconCalendar />,
    onSelect: action("event"),
  },
  {
    id: "invite",
    label: "Invite teammate",
    group: "Create",
    icon: <IconUser />,
    disabled: true,
    onSelect: action("invite"),
  },
];

const meta = {
  title: "Organisms/CommandPalette",
  component: CommandPalette,
  args: { commands },
  parameters: { layout: "padded" },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const Demo = () => {
      const [open, setOpen] = useState(false);
      return (
        <Stack gap="3" align="start">
          <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
            Open the palette
          </Button>
          <Text size="sm" tone="secondary">
            Or press <Kbd>⌘</Kbd> <Kbd>K</Kbd> anywhere on the page.
          </Text>
          <CommandPalette {...args} open={open} onOpenChange={setOpen} />
        </Stack>
      );
    };
    return <Demo />;
  },
};

export const Open: Story = { args: { defaultOpen: true } };
