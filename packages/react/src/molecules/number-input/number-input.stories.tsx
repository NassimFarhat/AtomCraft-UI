import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberInput } from "./number-input";

const meta = {
  title: "Molecules/NumberInput",
  component: NumberInput,
  args: { decreaseLabel: "Decrease quantity", increaseLabel: "Increase quantity", min: 0 },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "20rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
} satisfies Meta<typeof NumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Quantity: Story = { args: { defaultValue: 2 } };
export const Bounded: Story = { args: { defaultValue: 4, min: 1, max: 8, step: 1 } };
