import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { Stack } from "../../layout";
import { Alert } from "./alert";

const meta = {
  title: "Molecules/Alert",
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
