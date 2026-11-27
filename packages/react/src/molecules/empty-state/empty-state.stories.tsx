import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { IconInbox, IconSearch } from "../../icons";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  args: { title: "No items yet", description: "Items will appear here when they are available." },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoItems: Story = {
  render: () => (
    <EmptyState
      icon={<IconInbox />}
      title="No invoices yet"
      description="Invoices will appear here after a customer completes a payment."
      actions={<Button>Create invoice</Button>}
    />
  ),
};

export const NoSearchResults: Story = {
  render: () => (
    <EmptyState
      icon={<IconSearch />}
      title="No matching projects"
      description="Try another name or clear the current filters."
      actions={
        <Button variant="outline" tone="neutral">
          Clear filters
        </Button>
      }
    />
  ),
};
