import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { CopyButton } from "./copy-button";

const meta = {
  title: "Molecules/CopyButton",
  component: CopyButton,
  args: { value: "@atomscraft/react", label: "Copy package name" },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center">
      <CopyButton value="@atomscraft/react" label="Copy package name" />
      <CopyButton value="pnpm add @atomscraft/react" variant="outline" tone="neutral">
        Copy install command
      </CopyButton>
    </Stack>
  ),
};
