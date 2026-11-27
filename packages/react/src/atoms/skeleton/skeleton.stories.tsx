import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Skeleton } from "./skeleton";

const meta = { title: "Atoms/Skeleton", component: Skeleton } satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextLines: Story = {
  render: () => (
    <Stack gap="2" style={{ inlineSize: "22rem", maxInlineSize: "calc(100vw - 5rem)" }}>
      <Skeleton width="70%" />
      <Skeleton width="92%" />
      <Skeleton width="54%" />
    </Stack>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center">
      <Skeleton shape="circle" width="3rem" height="3rem" />
      <Skeleton shape="rect" width="8rem" height="4rem" />
      <Skeleton shape="text" width="8rem" />
    </Stack>
  ),
};
