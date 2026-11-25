import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Separator } from "../separator";
import { Skeleton } from "../skeleton";
import { Spinner } from "../spinner";
import { Progress } from "./progress";
import { ProgressCircle } from "./progress-circle";

const meta = {
  title: "Atoms/Feedback",
  component: Progress,
  args: { "aria-label": "Upload", value: 64 },
  decorators: [(Story) => <div style={{ inlineSize: "22rem" }}>{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgressBars: Story = {
  render: () => (
    <Stack gap="4">
      <Progress aria-label="Storage" value={72} />
      <Progress aria-label="Quota" value={92} tone="danger" size="lg" />
      <Progress aria-label="Done" value={100} tone="success" size="sm" />
      <Progress aria-label="Syncing" />
    </Stack>
  ),
};

export const Spinners: Story = {
  render: () => (
    <Stack direction="row" gap="4" align="center">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </Stack>
  ),
};

export const Skeletons: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center">
      <Skeleton shape="circle" />
      <Stack gap="2" style={{ flex: 1 }}>
        <Skeleton width="60%" />
        <Skeleton width="90%" />
      </Stack>
    </Stack>
  ),
};

export const Separators: Story = {
  render: () => (
    <Stack gap="4">
      <Separator />
      <Separator>or continue with</Separator>
      <Stack direction="row" gap="3" align="center" style={{ blockSize: "1.25rem" }}>
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
      </Stack>
    </Stack>
  ),
};

export const ProgressCircles: Story = {
  render: () => (
    <Stack direction="row" gap="4" align="center">
      <ProgressCircle aria-label="Storage" value={25} showValue />
      <ProgressCircle aria-label="Quota" value={80} tone="warning" size="lg" showValue />
      <ProgressCircle aria-label="Done" value={100} tone="success" size="sm" />
      <ProgressCircle aria-label="Syncing" />
    </Stack>
  ),
};
