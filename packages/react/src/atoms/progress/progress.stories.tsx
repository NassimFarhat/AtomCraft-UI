import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Progress } from "./progress";

const meta = {
  title: "Atoms/Progress",
  component: Progress,
  args: { "aria-label": "Upload", value: 64 },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "22rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
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
