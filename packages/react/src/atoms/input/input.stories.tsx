import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Select } from "../select";
import { Textarea } from "../textarea";
import { Input } from "./input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  args: { "aria-label": "Email", placeholder: "name@company.tn" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
  decorators: [(Story) => <div style={{ inlineSize: "20rem" }}>{Story()}</div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="3">
      <Input aria-label="Default" placeholder="Default" />
      <Input aria-label="Filled" defaultValue="nassim@atomcraft.dev" />
      <Input aria-label="Invalid" invalid defaultValue="not-an-email" />
      <Input aria-label="Read only" readOnly defaultValue="Read only value" />
      <Input aria-label="Disabled" disabled placeholder="Disabled" />
      <Input aria-label="File" type="file" />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Input key={size} aria-label={`Size ${size}`} size={size} placeholder={`Size ${size}`} />
      ))}
    </Stack>
  ),
};

export const TextareaAndSelect: Story = {
  render: () => (
    <Stack gap="3">
      <Textarea
        aria-label="Message"
        placeholder="Write a message… (grows with content)"
        resize="auto"
      />
      <Select aria-label="Country" placeholder="Choose a country">
        <option value="tn">Tunisia</option>
        <option value="fr">France</option>
        <option value="ma">Morocco</option>
      </Select>
      <Select aria-label="Role" invalid defaultValue="">
        <option value="" disabled>
          Invalid select
        </option>
      </Select>
    </Stack>
  ),
};
