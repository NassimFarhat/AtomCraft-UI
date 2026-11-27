import type { Meta, StoryObj } from "@storybook/react-vite";
import { PromptInput } from "./prompt-input";

const meta = {
  title: "Molecules/PromptInput",
  component: PromptInput,
  args: {
    inputLabel: "Message",
    submitLabel: "Send",
    placeholder: "Write a message…",
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof PromptInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Composer: Story = {};
export const ShiftEnterForNewline: Story = {
  args: { enterToSubmit: true, placeholder: "Press Enter to send, Shift+Enter for a new line" },
};
