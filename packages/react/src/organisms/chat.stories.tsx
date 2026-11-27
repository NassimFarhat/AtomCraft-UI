import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chat } from "./catalog-collaboration";

const meta = {
  title: "Organisms/Chat",
  component: Chat,
  args: {
    label: "Project discussion",
    inputLabel: "Write a message",
    submitLabel: "Send",
    emptyLabel: "No messages yet.",
    messages: [
      {
        id: "one",
        author: "Morgan Lee",
        timestamp: "10:42 AM",
        direction: "incoming",
        body: "The latest review is ready.",
      },
      {
        id: "two",
        author: "You",
        timestamp: "10:45 AM",
        direction: "outgoing",
        body: "I will take a look today.",
      },
    ],
    onSend: () => undefined,
  },
} satisfies Meta<typeof Chat>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Conversation: Story = {};
export const Empty: Story = { args: { messages: [] } };
