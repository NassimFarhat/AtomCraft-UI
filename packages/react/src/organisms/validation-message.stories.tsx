import type { Meta, StoryObj } from "@storybook/react-vite";
import { ValidationMessage } from "./essentials";

const meta = {
  title: "Organisms/ValidationMessage",
  component: ValidationMessage,
  args: { children: "Enter a workspace name." },
} satisfies Meta<typeof ValidationMessage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Error: Story = {};
export const Warning: Story = {
  args: { tone: "warning", children: "This name is already in use." },
};
