import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "./color-picker";

const meta = {
  title: "Molecules/ColorPicker",
  component: ColorPicker,
  args: { "aria-label": "Brand color", defaultValue: "#4f46e5" },
} satisfies Meta<typeof ColorPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BrandColor: Story = {};
