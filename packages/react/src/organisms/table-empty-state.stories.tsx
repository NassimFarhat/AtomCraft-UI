import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../atoms/button";
import { TableEmptyState } from "./table";

const meta = {
  title: "Organisms/TableEmptyState",
  component: TableEmptyState,
  args: {
    columnCount: 3,
    title: "No results",
    description: "Adjust the filters or create a new record.",
    action: <Button>Create record</Button>,
  },
} satisfies Meta<typeof TableEmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NoResults: Story = {};
