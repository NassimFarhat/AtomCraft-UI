import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { IconInbox } from "../../icons";
import { Stack } from "../../layout";
import { EmptyState } from "../empty-state";
import { toast } from "../toast";
import { Alert } from "./alert";

const meta = {
  title: "Molecules/Feedback",
  component: Alert,
  args: {
    title: "Update available",
    children: "Version 1.1 adds the Combobox and DatePicker components.",
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "info", "success", "warning", "danger"] },
    variant: { control: "inline-radio", options: ["soft", "outline", "solid"] },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AlertPlayground: Story = {};

export const Alerts: Story = {
  render: () => (
    <Stack gap="3" style={{ maxInlineSize: "40rem" }}>
      <Alert tone="info" title="Heads up">
        Billing moves to the first day of each month.
      </Alert>
      <Alert tone="success" title="Payment received" onDismiss={() => undefined}>
        Invoice #2041 has been paid.
      </Alert>
      <Alert
        tone="warning"
        variant="outline"
        title="Storage almost full"
        actions={
          <Button size="sm" variant="outline" tone="neutral">
            Upgrade
          </Button>
        }
      >
        You have used 92% of your 10 GB.
      </Alert>
      <Alert tone="danger" variant="solid" title="Your session expired">
        Sign in again to continue.
      </Alert>
    </Stack>
  ),
};

export const Toasts: Story = {
  render: () => (
    <Stack direction="row" gap="2" wrap>
      <Button variant="outline" tone="neutral" onClick={() => toast("Draft saved")}>
        Neutral
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.success("Profile updated", { description: "Your changes are live." })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast.error("Upload failed", {
            description: "report.pdf is too large.",
            action: { label: "Retry", onClick: () => undefined },
          })
        }
      >
        Error with action
      </Button>
    </Stack>
  ),
};

export const Empty: Story = {
  render: () => (
    <EmptyState
      icon={<IconInbox />}
      title="No invoices yet"
      description="Invoices appear here once a customer pays. Create one to get started."
      actions={
        <>
          <Button>Create invoice</Button>
          <Button variant="ghost" tone="neutral">
            Import CSV
          </Button>
        </>
      }
    />
  ),
};
