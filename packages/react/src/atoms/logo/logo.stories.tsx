import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconSparkles } from "../../icons";
import { Logo } from "./logo";

const meta = {
  title: "Atoms/Logo",
  component: Logo,
  args: { children: "AtomCraft" },
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Wordmark: Story = { args: { mark: <IconSparkles /> } };
export const TextOnly: Story = {};
