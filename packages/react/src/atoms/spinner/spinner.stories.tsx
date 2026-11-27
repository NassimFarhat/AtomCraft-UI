import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Spinner } from "./spinner";

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
  args: { label: "Loading" },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="4" align="center">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Spinner key={size} size={size} label={`Loading (${size})`} />
      ))}
    </Stack>
  ),
};

export const Decorative: Story = { render: () => <Spinner label="" /> };
