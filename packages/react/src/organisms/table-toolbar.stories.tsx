import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../atoms/button";
import { TableToolbar } from "./table";

const meta = {
  title: "Organisms/TableToolbar",
  component: TableToolbar,
  args: {
    search: { value: "", onChange: () => undefined, placeholder: "Search records" },
    columns: null,
    onToggleColumn: () => undefined,
    filters: (
      <Button variant="outline" tone="neutral">
        Status
      </Button>
    ),
    actions: <Button>Add record</Button>,
  },
} satisfies Meta<typeof TableToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SearchFiltersAndActions: Story = {};
