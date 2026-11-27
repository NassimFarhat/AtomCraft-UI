import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../field";
import { PhoneInput } from "./phone-input";

const meta = { title: "Molecules/PhoneInput", component: PhoneInput } satisfies Meta<
  typeof PhoneInput
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ContactNumber: Story = {
  render: () => (
    <Field label="Phone number" description="Include the country calling code.">
      <PhoneInput autoComplete="tel" placeholder="+1 555 0100" />
    </Field>
  ),
};
