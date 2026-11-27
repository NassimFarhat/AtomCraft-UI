import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "Molecules/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const questions = [
  ["What is AtomCraft?", "A React design system with reusable, themeable components."],
  ["Can I open more than one section?", "Yes. Set type to multiple to allow that behavior."],
  ["Can the trigger follow my heading outline?", "Set headingLevel on each AccordionTrigger."],
] as const;

export const Variants: Story = {
  render: () => (
    <Stack gap="6" style={{ maxInlineSize: "38rem" }}>
      {(["separated", "contained", "plain"] as const).map((variant) => (
        <Accordion key={variant} variant={variant} defaultValue={["question-0"]}>
          {questions.map(([question, answer], index) => (
            <AccordionItem key={question} value={`question-${index}`}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ))}
    </Stack>
  ),
};

export const MultipleOpenItems: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["shipping", "returns"]} variant="contained">
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Orders ship within two business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>Unused items can be returned within 30 days.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
