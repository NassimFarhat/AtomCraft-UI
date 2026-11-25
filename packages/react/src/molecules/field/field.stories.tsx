import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../../atoms/checkbox";
import { Input } from "../../atoms/input";
import { Select } from "../../atoms/select";
import { Switch } from "../../atoms/switch";
import { Textarea } from "../../atoms/textarea";
import { IconMail } from "../../icons";
import { Stack } from "../../layout";
import { InputGroup } from "../input-group";
import { PasswordInput } from "../password-input";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { SearchField } from "../search-field";
import { Field } from "./field";

const meta = {
  title: "Molecules/Forms",
  component: Field,
  args: {
    label: "Email",
    description: "We only use it for receipts.",
    children: <Input type="email" placeholder="name@company.tn" />,
  },
  decorators: [(Story) => <div style={{ inlineSize: "24rem" }}>{Story()}</div>],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FieldPlayground: Story = {};

export const FieldStates: Story = {
  render: () => (
    <Stack gap="5">
      <Field label="Full name" hint="(optional)">
        <Input placeholder="Nassim Farhat" />
      </Field>
      <Field label="Email" required error="Enter a valid email address.">
        <Input defaultValue="nassim@" />
      </Field>
      <Field label="Bio" description="Markdown is supported.">
        <Textarea resize="auto" />
      </Field>
      <Field label="Role">
        <Select placeholder="Select a role">
          <option>Owner</option>
          <option>Admin</option>
          <option>Member</option>
        </Select>
      </Field>
      <Field label="Remember me" description="Stay signed in for 30 days." layout="inline">
        <Checkbox defaultChecked />
      </Field>
      <Field label="Product updates" layout="inline">
        <Switch />
      </Field>
    </Stack>
  ),
};

export const InputGroups: Story = {
  render: () => (
    <Stack gap="4">
      <Field label="Website">
        <InputGroup start="https://" end=".tn">
          <Input placeholder="atomcraft" />
        </InputGroup>
      </Field>
      <Field label="Work email">
        <InputGroup start={<IconMail />}>
          <Input type="email" placeholder="you@company.tn" />
        </InputGroup>
      </Field>
      <Field label="Password" description="At least 12 characters.">
        <PasswordInput />
      </Field>
      <SearchField placeholder="Search components…" shortcut="⌘K" />
    </Stack>
  ),
};

export const RadioGroups: Story = {
  render: () => (
    <Stack gap="6">
      <RadioGroup label="Notifications" defaultValue="mentions">
        <RadioGroupItem value="all" label="All new messages" />
        <RadioGroupItem value="mentions" label="Direct messages and mentions" />
        <RadioGroupItem value="none" label="Nothing" />
      </RadioGroup>
      <RadioGroup
        label="Plan"
        variant="cards"
        defaultValue="pro"
        description="You can change it at any time."
      >
        <RadioGroupItem value="starter" label="Starter" description="Free, 1 project" />
        <RadioGroupItem value="pro" label="Pro" description="49 TND / month" />
      </RadioGroup>
    </Stack>
  ),
};
