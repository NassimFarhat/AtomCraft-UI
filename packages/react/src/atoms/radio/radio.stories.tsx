import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Text } from "../text";
import { Radio } from "./radio";

const meta = {
  title: "Atoms/Radio",
  component: Radio,
  args: { name: "plan", value: "team", "aria-label": "Team plan" },
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const GroupedOptions: Story = {
  render: () => (
    <Stack gap="3">
      <Text as="span">Choose a plan</Text>
      <Stack direction="row" gap="4">
        <label>
          <Radio name="radio-plan" value="starter" defaultChecked /> Starter
        </label>
        <label>
          <Radio name="radio-plan" value="team" /> Team
        </label>
        <label>
          <Radio name="radio-plan" value="enterprise" disabled /> Enterprise
        </label>
      </Stack>
    </Stack>
  ),
};
