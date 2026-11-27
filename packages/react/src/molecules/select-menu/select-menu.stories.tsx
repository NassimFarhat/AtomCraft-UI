import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconHome, IconMail, IconUser } from "../../icons";
import { Field } from "../field";
import type { ListOption } from "../listbox";
import { SelectMenu } from "./select-menu";

const roles: ListOption[] = [
  { value: "owner", label: "Owner", description: "Full access", icon: <IconUser /> },
  { value: "editor", label: "Editor", description: "Can change content", icon: <IconHome /> },
  { value: "viewer", label: "Viewer", description: "Read only", icon: <IconMail /> },
];

const meta = {
  title: "Molecules/SelectMenu",
  component: SelectMenu,
  args: {
    "aria-label": "Choose a role",
    options: roles,
    defaultValue: "editor",
    placeholder: "Choose a role",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "22rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A fully styled single-choice menu. Use this component when option rows need AtomCraft colors, descriptions, icons or grouping.",
      },
    },
  },
} satisfies Meta<typeof SelectMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InAField: Story = {
  render: () => (
    <Field label="Workspace role" description="Choose what this person can access.">
      <SelectMenu options={roles} defaultValue="editor" />
    </Field>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const WithFormName: Story = { args: { name: "workspace-role" } };
