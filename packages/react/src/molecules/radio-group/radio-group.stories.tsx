import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Molecules/RadioGroup",
  component: RadioGroup,
  args: {
    label: "Deployment target",
    children: <RadioGroupItem value="cloud" label="Cloud" />,
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: () => (
    <RadioGroup label="Deployment target" defaultValue="cloud" description="Choose one option.">
      <RadioGroupItem value="cloud" label="Cloud" description="Managed infrastructure" />
      <RadioGroupItem value="self-hosted" label="Self-hosted" description="Run it yourself" />
    </RadioGroup>
  ),
};

export const Cards: Story = {
  render: () => (
    <Stack style={{ maxInlineSize: "34rem" }}>
      <RadioGroup label="Plan" defaultValue="team" variant="cards" orientation="horizontal">
        <RadioGroupItem value="starter" label="Starter" description="For personal projects" />
        <RadioGroupItem value="team" label="Team" description="For a growing team" />
        <RadioGroupItem value="enterprise" label="Enterprise" description="For larger orgs" />
      </RadioGroup>
    </Stack>
  ),
};
