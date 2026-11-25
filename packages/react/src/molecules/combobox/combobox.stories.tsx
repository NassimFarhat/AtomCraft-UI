import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IconHome, IconMail, IconUser } from "../../icons";
import { Stack } from "../../layout";
import { Field } from "../field";
import type { ListOption } from "../listbox";
import { SelectMenu } from "../select-menu";
import { Combobox } from "./combobox";
import { MultiSelect } from "./multi-select";

const cities: ListOption[] = [
  { value: "sfax", label: "Sfax", group: "Tunisia" },
  { value: "tunis", label: "Tunis", group: "Tunisia" },
  { value: "sousse", label: "Sousse", group: "Tunisia" },
  { value: "kerkennah", label: "Kerkennah", group: "Tunisia", description: "Islands" },
  { value: "lyon", label: "Lyon", group: "France" },
  { value: "paris", label: "Paris", group: "France" },
  { value: "marseille", label: "Marseille", group: "France", disabled: true },
];

const roles: ListOption[] = [
  { value: "owner", label: "Owner", description: "Full access", icon: <IconUser /> },
  { value: "editor", label: "Editor", description: "Can change content", icon: <IconHome /> },
  { value: "viewer", label: "Viewer", description: "Read only", icon: <IconMail /> },
];

const meta = {
  title: "Molecules/Combobox",
  component: Combobox,
  args: { options: cities, "aria-label": "City" },
  decorators: [(Story) => <div style={{ inlineSize: "20rem" }}>{Story()}</div>],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clearable: Story = { args: { defaultValue: "sfax", clearable: true } };

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Combobox key={size} {...args} size={size} placeholder={`Size ${size}`} />
      ))}
    </Stack>
  ),
};

export const InAField: Story = {
  render: (args) => (
    <Field label="City" description="Type to filter the list." error="Pick a city">
      <Combobox {...args} />
    </Field>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "tunis" } };

export const Multiple: Story = {
  render: () => {
    const Demo = () => {
      const [values, setValues] = useState<string[]>(["sfax"]);
      return (
        <Field label="Cities" description="Choose as many as you need.">
          <MultiSelect options={cities} values={values} onValuesChange={setValues} />
        </Field>
      );
    };
    return <Demo />;
  },
};

/** The custom select: no search box, options with icons and descriptions. */
export const SelectMenuOptions: Story = {
  render: () => (
    <Field label="Role">
      <SelectMenu options={roles} defaultValue="editor" />
    </Field>
  ),
};
