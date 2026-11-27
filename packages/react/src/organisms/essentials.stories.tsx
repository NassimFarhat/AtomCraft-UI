import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../atoms/button";
import { Stack } from "../layout";
import {
  DataCard,
  DataList,
  DescriptionList,
  ErrorState,
  FormDescription,
  LoadingOverlay,
  OfflineIndicator,
  ProgressOverlay,
  ValidationMessage,
} from "./essentials";
import { TableColumnVisibility, TableEmptyState, TableRowActions, TableToolbar } from "./table";

const meta = { title: "Organisms/Additional Essentials" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const DataCardExample: Story = {
  render: () => (
    <DataCard title="Active users" value="1,284" description="Compared with the previous 30 days" />
  ),
};
export const DataListExample: Story = {
  render: () => (
    <DataList
      items={[
        {
          id: "core",
          title: "@atomscraft/core",
          description: "Behavior primitives",
          value: "0.1.1",
        },
        {
          id: "react",
          title: "@atomscraft/react",
          description: "Accessible React components",
          value: "0.1.1",
        },
      ]}
    />
  ),
};
export const DescriptionListExample: Story = {
  render: () => (
    <DescriptionList
      columns={2}
      items={[
        { id: "owner", term: "Owner", description: "Morgan Lee" },
        { id: "updated", term: "Last updated", description: "November 27, 2026" },
        { id: "status", term: "Status", description: "In review" },
      ]}
    />
  ),
};
export const LoadingOverlayExample: Story = {
  render: () => (
    <LoadingOverlay loading label="Loading report">
      <div style={{ minBlockSize: 180, padding: 24 }}>Report content</div>
    </LoadingOverlay>
  ),
};
export const ProgressOverlayExample: Story = {
  render: () => (
    <ProgressOverlay value={68} label="Uploading files">
      <div style={{ minBlockSize: 180, padding: 24 }}>Upload queue</div>
    </ProgressOverlay>
  ),
};
export const ErrorStateExample: Story = {
  render: () => (
    <ErrorState title="Report could not load" action={<Button>Try again</Button>}>
      Check your connection and try again.
    </ErrorState>
  ),
};
export const OfflineIndicatorExample: Story = {
  render: () => (
    <Stack gap="3">
      <OfflineIndicator online={false} onlineLabel="Connected" offlineLabel="You are offline" />
      <OfflineIndicator online onlineLabel="Connected" offlineLabel="You are offline" />
    </Stack>
  ),
};
export const FormDescriptionExample: Story = {
  render: () => (
    <Stack gap="2">
      <label htmlFor="description-example">Workspace name</label>
      <input id="description-example" />
      <FormDescription>Use a name your team will recognize.</FormDescription>
      <ValidationMessage>Enter a workspace name.</ValidationMessage>
    </Stack>
  ),
};
export const TableToolbarExample: Story = {
  render: () => (
    <TableToolbar
      search={{ value: "", onChange: () => undefined, placeholder: "Search records" }}
      columns={null}
      onToggleColumn={() => undefined}
      filters={
        <Button variant="outline" tone="neutral">
          Status
        </Button>
      }
      actions={<Button>Add record</Button>}
    />
  ),
};
export const TableColumnVisibilityExample: Story = {
  render: () => (
    <TableColumnVisibility
      label="Columns"
      columns={[
        { key: "name", label: "Name", visible: true },
        { key: "status", label: "Status", visible: true },
        { key: "updated", label: "Updated", visible: false },
      ]}
      onToggleColumn={() => undefined}
    />
  ),
};
export const TableRowActionsExample: Story = {
  render: () => (
    <TableRowActions
      label="Row actions"
      actions={[
        { id: "edit", label: "Edit", onSelect: () => undefined },
        { id: "delete", label: "Delete", onSelect: () => undefined, tone: "danger" },
      ]}
    />
  ),
};
export const TableEmptyStateExample: Story = {
  render: () => (
    <TableEmptyState
      columnCount={3}
      title="No results"
      description="Adjust the filters or create a new record."
      action={<Button>Create record</Button>}
    />
  ),
};
