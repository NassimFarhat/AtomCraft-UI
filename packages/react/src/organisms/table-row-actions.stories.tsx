import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableRowActions } from "./table";

const meta = {
  title: "Organisms/TableRowActions",
  component: TableRowActions,
  args: {
    label: "Row actions",
    actions: [
      { id: "edit", label: "Edit", onSelect: () => undefined },
      { id: "delete", label: "Delete", onSelect: () => undefined, tone: "danger" },
    ],
  },
} satisfies Meta<typeof TableRowActions>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Actions: Story = {};
