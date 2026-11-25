import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../../atoms/text";
import { IconBell, IconSettings, IconUser } from "../../icons";
import { Stack } from "../../layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Molecules/Tabs & Accordion",
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

const faq = [
  ["What is AtomCraft?", "A zero-dependency design system for React, Next.js and any front-end."],
  ["Is it accessible?", "Every component follows WAI-ARIA patterns and is tested with axe."],
  [
    "Can I customize it?",
    "Change brand, density and shape with tokens, without touching component code.",
  ],
] as const;

export const AccordionVariants: Story = {
  render: () => (
    <Stack gap="8" style={{ maxInlineSize: "36rem" }}>
      {(["separated", "contained", "plain"] as const).map((variant) => (
        <Accordion key={variant} variant={variant} defaultValue={["item-0"]}>
          {faq.map(([question, answer], index) => (
            <AccordionItem key={question} value={`item-${index}`}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ))}
    </Stack>
  ),
};
