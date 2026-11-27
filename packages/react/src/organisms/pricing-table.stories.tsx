import type { Meta, StoryObj } from "@storybook/react-vite";
import { PricingTable } from "./catalog-collaboration";

const meta = {
  title: "Organisms/PricingTable",
  component: PricingTable,
  args: {
    label: "Plans",
    actionLabel: "Choose plan",
    periodLabel: "per month",
    onSelectPlan: () => undefined,
    plans: [
      {
        id: "starter",
        name: "Starter",
        amount: 0,
        currency: "USD",
        description: "For small projects.",
        features: ["Core components", "Community support"],
      },
      {
        id: "team",
        name: "Team",
        amount: 24,
        currency: "USD",
        period: "per seat / month",
        featured: true,
        description: "For growing teams.",
        features: ["All components", "Shared themes", "Priority support"],
      },
    ],
  },
} satisfies Meta<typeof PricingTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Plans: Story = {};
