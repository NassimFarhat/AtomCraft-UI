import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup } from "./toggle-group";

const meta = {
  title: "Molecules/ToggleGroup",
  component: ToggleGroup,
  args: {
    label: "Text formatting",
    options: [
      { value: "bold", label: "Bold" },
      { value: "italic", label: "Italic" },
      { value: "underline", label: "Underline" },
    ],
  },
} satisfies Meta<typeof ToggleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { args: { defaultValue: ["bold"] } };
export const Multiple: Story = { args: { type: "multiple", defaultValue: ["bold", "italic"] } };
