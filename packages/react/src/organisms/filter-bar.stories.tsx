import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar } from "./catalog-workflow";

const meta = {
  title: "Organisms/FilterBar",
  component: FilterBar,
  args: {
    query: "",
    onQueryChange: () => undefined,
    queryLabel: "Search projects",
    filters: [
      {
        id: "status",
        label: "Status",
        value: "all",
        options: [
          { value: "all", label: "All statuses" },
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ],
      },
    ],
    onFilterChange: () => undefined,
    resetLabel: "Reset filters",
    onReset: () => undefined,
  },
} satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SearchAndFacets: Story = {};
