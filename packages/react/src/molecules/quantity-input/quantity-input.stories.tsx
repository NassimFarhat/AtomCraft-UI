import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuantityInput } from "./quantity-input";

const meta = {
  title: "Molecules/QuantityInput",
  component: QuantityInput,
  args: {
    "aria-label": "Items",
    decreaseLabel: "Decrease items",
    increaseLabel: "Increase items",
  },
} satisfies Meta<typeof QuantityInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Items: Story = { args: { defaultValue: 1, max: 20 } };
