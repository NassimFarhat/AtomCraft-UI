import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../atoms/avatar";
import { ListItem } from "./list-item";

const meta = {
  title: "Molecules/ListItem",
  component: ListItem,
  args: {
    children: "Design system review",
    description: "Updated 20 minutes ago",
    trailing: "Today",
  },
} satisfies Meta<typeof ListItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithLeading: Story = {
  args: { leading: <Avatar name="Alex Morgan" size="sm" />, selected: true },
};
