import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "./rating";

const meta = {
  title: "Molecules/Rating",
  component: Rating,
  args: { label: "Product rating" },
} satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FiveStars: Story = { args: { defaultValue: 4 } };
export const Disabled: Story = { args: { defaultValue: 3, disabled: true } };
