import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Container,
  Heading,
  PricingTable,
  SegmentedControl,
  Stack,
  Text,
  toast,
} from "@atomscraft/react";
import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

/**
 * Pricing page block: a gradient hero, a billing-period switch, the PricingTable with a
 * featured plan, and an FAQ.
 */
const meta = { title: "Blocks/Pricing page", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const gradientText: CSSProperties = {
  backgroundImage: "var(--ac-gradient-brand-text)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

const FAQ = [
  [
    "Can I switch plans later?",
    "Yes. Upgrades apply immediately; downgrades take effect at the end of the billing period.",
  ],
  [
    "Is the component library free?",
    "The packages are MIT licensed. Paid plans add hosted themes, shared tokens and support.",
  ],
  [
    "Do you offer discounts for education?",
    "Students and teachers get the Team plan free. Contact us with your school email.",
  ],
] as const;

function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const yearly = billing === "yearly";
  return (
    <div style={{ backgroundImage: "var(--ac-gradient-brand-glow)" }}>
      <Container size="xl" style={{ paddingBlock: "var(--ac-layout-section)" }}>
        <Stack gap="12" align="center">
          <Stack gap="4" align="center" style={{ textAlign: "center", maxInlineSize: "40rem" }}>
            <Badge tone="primary" variant="outline">
              Pricing
            </Badge>
            <Heading level={1} size="display-md">
              Simple plans for <span style={gradientText}>every team</span>
            </Heading>
            <Text size="lg" tone="secondary">
              Start free, then grow into shared themes and priority support.
            </Text>
            <Stack direction="row" gap="3" align="center">
              <SegmentedControl
                label="Billing period"
                value={billing}
                onValueChange={(value) => setBilling(value as "monthly" | "yearly")}
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ]}
              />
              <Badge tone="success" dot>
                Save 20%
              </Badge>
            </Stack>
          </Stack>

          <PricingTable
            label="Plans"
            actionLabel="Choose plan"
            periodLabel={yearly ? "per year" : "per month"}
            onSelectPlan={(id) => toast.success("Plan selected", { description: id })}
            plans={[
              {
                id: "starter",
                name: "Starter",
                amount: 0,
                currency: "USD",
                description: "For personal projects.",
                features: ["All atoms and molecules", "Light and dark themes", "Community support"],
              },
              {
                id: "team",
                name: "Team",
                amount: yearly ? 230 : 24,
                currency: "USD",
                period: yearly ? "per seat / year" : "per seat / month",
                featured: true,
                description: "For product teams shipping together.",
                features: ["Everything in Starter", "Shared brand themes", "Priority support"],
              },
              {
                id: "enterprise",
                name: "Enterprise",
                amount: yearly ? 1150 : 120,
                currency: "USD",
                description: "For organisations with many products.",
                features: [
                  "Everything in Team",
                  "Custom token pipelines",
                  "Dedicated success team",
                ],
              },
            ]}
          />

          <Stack gap="4" style={{ inlineSize: "min(40rem, 100%)" }}>
            <Heading level={2} size="3" style={{ textAlign: "center" }}>
              Frequently asked questions
            </Heading>
            <Accordion variant="separated" defaultValue={["faq-0"]}>
              {FAQ.map(([question, answer], index) => (
                <AccordionItem key={question} value={`faq-${index}`}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}

export const PricingAndFaq: Story = { render: () => <PricingPage /> };
