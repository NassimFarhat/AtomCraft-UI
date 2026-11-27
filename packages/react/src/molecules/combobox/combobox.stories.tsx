import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stack } from "../../layout";
import { Field } from "../field";
import type { ListOption } from "../listbox";
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

const meta = {
  title: "Molecules/Combobox",
  component: Combobox,
  args: { options: cities, "aria-label": "City" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "20rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
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
