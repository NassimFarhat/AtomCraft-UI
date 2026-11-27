import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "./index";

const meta = {
  title: "Molecules/Callout",
  component: Callout,
  args: { title: "Heads up", children: "Review these details before continuing." },
} satisfies Meta<typeof Callout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Informational: Story = {};
