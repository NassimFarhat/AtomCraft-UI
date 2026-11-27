import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { ProgressCircle } from "./progress-circle";

const meta = {
  title: "Atoms/ProgressCircle",
  component: ProgressCircle,
  args: { "aria-label": "Storage", value: 25, showValue: true },
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ValuesAndStates: Story = {
  render: () => (
    <Stack direction="row" gap="4" align="center">
      <ProgressCircle aria-label="Storage" value={25} showValue />
      <ProgressCircle aria-label="Quota" value={80} tone="warning" size="lg" showValue />
      <ProgressCircle aria-label="Done" value={100} tone="success" size="sm" />
      <ProgressCircle aria-label="Syncing" />
    </Stack>
  ),
};
