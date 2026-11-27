import type { Meta, StoryObj } from "@storybook/react-vite";
import { DescriptionList } from "./essentials";

const meta = {
  title: "Organisms/DescriptionList",
  component: DescriptionList,
  args: {
    columns: 2,
    items: [
      { id: "owner", term: "Owner", description: "Morgan Lee" },
      { id: "updated", term: "Last updated", description: "November 27, 2026" },
      { id: "status", term: "Status", description: "In review" },
    ],
  },
} satisfies Meta<typeof DescriptionList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Details: Story = {};
