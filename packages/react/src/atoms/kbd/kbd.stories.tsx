import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Kbd } from "./kbd";

const meta = { title: "Atoms/Kbd", component: Kbd, args: { children: "Enter" } } satisfies Meta<
  typeof Kbd
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CommonShortcuts: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
    </Stack>
  ),
};
