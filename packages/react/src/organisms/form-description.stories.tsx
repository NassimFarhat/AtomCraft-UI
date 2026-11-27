import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormDescription } from "./essentials";

const meta = {
  title: "Organisms/FormDescription",
  component: FormDescription,
  args: { children: "Use a name your team will recognize." },
} satisfies Meta<typeof FormDescription>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HelperText: Story = {};
