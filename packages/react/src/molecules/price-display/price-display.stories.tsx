import type { Meta, StoryObj } from "@storybook/react-vite";
import { PriceDisplay } from "./price-display";

const meta = {
  title: "Molecules/PriceDisplay",
  component: PriceDisplay,
  args: { amount: 24.99, currency: "USD" },
} satisfies Meta<typeof PriceDisplay>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Currency: Story = {};
export const Discounted: Story = {
  args: { amount: 18, previousAmount: 24, currency: "EUR", locale: "fr-FR" },
};
