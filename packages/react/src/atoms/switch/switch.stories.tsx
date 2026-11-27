import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Switch } from "./switch";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  args: { "aria-label": "Enable notifications" },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StatesAndTones: Story = {
  render: () => (
    <Stack gap="3">
      <Switch aria-label="Notifications" defaultChecked />
      <Switch aria-label="Unavailable option" disabled />
      <Switch aria-label="Danger setting" tone="danger" defaultChecked />
      <Switch aria-label="Large switch" size="lg" />
    </Stack>
  ),
};
