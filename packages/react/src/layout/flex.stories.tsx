import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "./layout";

const meta = { title: "Layout/Flex", component: Flex } satisfies Meta<typeof Flex>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {
  args: {
    direction: { base: "column", md: "row" },
    gap: "3",
    children: (
      <>
        <span>Navigation</span>
        <span>Content</span>
        <span>Actions</span>
      </>
    ),
  },
};
