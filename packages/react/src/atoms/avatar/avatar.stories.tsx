import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Avatar } from "./avatar";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  args: { name: "Nassim Farhat" },
  argTypes: { size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SizesAndTones: Story = {
  render: () => (
    <Stack gap="4">
      <Stack direction="row" gap="3" align="center">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} name="Amel Ben Salah" size={size} tone="primary" />
        ))}
      </Stack>
      <Stack direction="row" gap="3" align="center">
        {(["neutral", "info", "success", "warning", "danger"] as const).map((tone) => (
          <Avatar key={tone} name={`Team ${tone}`} tone={tone} shape="square" />
        ))}
      </Stack>
    </Stack>
  ),
};

export const Status: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center">
      {(["online", "away", "busy", "offline"] as const).map((status) => (
        <Avatar key={status} name="Zied Trabelsi" status={status} size="lg" />
      ))}
    </Stack>
  ),
};
