import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../atoms/avatar";
import { Stack } from "../../layout";
import { AvatarGroup } from "./avatar-group";

const meta = {
  title: "Molecules/AvatarGroup",
  component: AvatarGroup,
  args: { children: <Avatar name="Amel Ben Salah" /> },
  parameters: { layout: "padded" },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const team = [
  <Avatar key="amel" name="Amel Ben Salah" />,
  <Avatar key="zied" name="Zied Trabelsi" tone="info" />,
  <Avatar key="emna" name="Emna Gharbi" tone="success" />,
  <Avatar key="youssef" name="Youssef Kchaou" tone="warning" />,
  <Avatar key="mariem" name="Mariem Gharbi" tone="danger" />,
];

export const Default: Story = {
  render: () => (
    <Stack gap="5">
      <AvatarGroup max={3} overflowLabel={(count) => `${count} more teammates`}>
        {team}
      </AvatarGroup>
      <AvatarGroup size="sm" max={4} overflowLabel={(count) => `${count} more teammates`}>
        {team}
      </AvatarGroup>
    </Stack>
  ),
};
