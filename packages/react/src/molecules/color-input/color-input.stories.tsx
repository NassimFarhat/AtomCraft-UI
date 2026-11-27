import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorInput } from "./index";

const meta = {
  title: "Molecules/ColorInput",
  component: ColorInput,
  args: { "aria-label": "Selected color", defaultValue: "#4f46e5" },
} satisfies Meta<typeof ColorInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NativeColorControl: Story = {};
