import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommentsThread } from "./catalog-collaboration";

const meta = {
  title: "Organisms/CommentsThread",
  component: CommentsThread,
  args: {
    label: "Design review comments",
    inputLabel: "Add a comment",
    submitLabel: "Comment",
    emptyLabel: "Start the discussion.",
    comments: [
      {
        id: "one",
        author: "Morgan Lee",
        timestamp: "10:42 AM",
        body: "The spacing looks consistent across the states.",
      },
    ],
    onAddComment: () => undefined,
  },
} satisfies Meta<typeof CommentsThread>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Discussion: Story = {};
export const Empty: Story = { args: { comments: [] } };
