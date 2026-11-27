import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableColumnVisibility } from "./table";

const meta = {
  title: "Organisms/TableColumnVisibility",
  component: TableColumnVisibility,
  args: {
    label: "Columns",
    columns: [
      { key: "name", label: "Name", visible: true },
      { key: "status", label: "Status", visible: true },
      { key: "updated", label: "Updated", visible: false },
    ],
    onToggleColumn: () => undefined,
  },
} satisfies Meta<typeof TableColumnVisibility>;
export default meta;
type Story = StoryObj<typeof meta>;
export const VisibilityMenu: Story = {};
