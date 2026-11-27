import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../../atoms/input";
import { Stack } from "../../layout";
import { Field } from "../field";
import { InputGroup } from "./input-group";

const meta = {
  title: "Molecules/InputGroup",
  component: InputGroup,
  args: { children: <Input aria-label="Value" /> },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Addons: Story = {
  render: () => (
    <Stack gap="4" style={{ inlineSize: "22rem", maxInlineSize: "calc(100vw - 5rem)" }}>
      <Field label="Website">
        <InputGroup start="https://">
          <Input aria-label="Website address" placeholder="example" />
        </InputGroup>
      </Field>
      <Field label="Monthly price">
        <InputGroup start="$" end="/ month">
          <Input aria-label="Monthly price" inputMode="decimal" placeholder="0.00" />
        </InputGroup>
      </Field>
    </Stack>
  ),
};
