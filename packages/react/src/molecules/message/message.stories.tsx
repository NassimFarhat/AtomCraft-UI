import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Message } from "./message";

const meta = {
  title: "Molecules/Message",
  component: Message,
  args: {
    author: "Morgan Lee",
    timestamp: "10:42 AM",
    children: "The latest design review is ready for feedback.",
  },
} satisfies Meta<typeof Message>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Incoming: Story = {};
export const Conversation: Story = {
  render: () => (
    <Stack gap="3" style={{ maxInlineSize: "32rem" }}>
      <Message author="Morgan Lee" timestamp="10:42 AM">
        The latest design review is ready for feedback.
      </Message>
      <Message author="You" timestamp="10:45 AM" direction="outgoing">
        I will take a look this afternoon.
      </Message>
    </Stack>
  ),
};
