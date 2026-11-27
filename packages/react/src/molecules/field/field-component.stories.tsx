import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../../atoms/input";
import { Select } from "../../atoms/select";
import { Stack } from "../../layout";
import { Field } from "./field";

const meta = {
  title: "Molecules/Field",
  component: Field,
  args: {
    label: "Email address",
    description: "We use this address for account updates.",
    children: <Input type="email" placeholder="name@company.com" />,
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "24rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="4">
      <Field label="Full name" hint="Optional">
        <Input placeholder="Your name" />
      </Field>
      <Field label="Email" required error="Enter a valid email address.">
        <Input defaultValue="name@" />
      </Field>
      <Field label="Workspace role" description="You can change this later.">
        <Select defaultValue="editor">
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </Select>
      </Field>
    </Stack>
  ),
};
