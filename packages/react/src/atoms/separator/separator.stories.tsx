import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Separator } from "./separator";

const meta = {
  title: "Atoms/Separator",
  component: Separator,
  render: (args) => (
    <div style={{ inlineSize: "32rem", maxInlineSize: "calc(100vw - var(--ac-space-12))" }}>
      <Separator {...args} />
    </div>
  ),
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Labeled: Story = {
  render: () => (
    <div style={{ inlineSize: "32rem", maxInlineSize: "calc(100vw - var(--ac-space-12))" }}>
      <Separator>or continue with</Separator>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center" style={{ blockSize: "3rem" }}>
      <span>Components</span>
      <Separator orientation="vertical" />
      <span>Foundations</span>
    </Stack>
  ),
};
