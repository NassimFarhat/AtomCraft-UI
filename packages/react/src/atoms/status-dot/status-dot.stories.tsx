import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "../../layout";
import { StatusDot } from "./status-dot";

const meta = {
  title: "Atoms/StatusDot",
  component: StatusDot,
  args: { status: "online", label: "Online" },
} satisfies Meta<typeof StatusDot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Presence: Story = {
  render: () => (
    <Flex wrap gap="4">
      <StatusDot status="online" label="Online" />
      <StatusDot status="away" label="Away" />
      <StatusDot status="busy" label="Busy" />
      <StatusDot status="offline" label="Offline" />
      <StatusDot status="unknown" label="Status unknown" />
    </Flex>
  ),
};
