import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Field } from "../field";
import { PasswordInput } from "./password-input";

const meta = { title: "Molecules/PasswordInput", component: PasswordInput } satisfies Meta<
  typeof PasswordInput
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stack gap="4" style={{ inlineSize: "22rem", maxInlineSize: "calc(100vw - 5rem)" }}>
      <Field label="Password" description="Use at least 12 characters.">
        <PasswordInput aria-label="Password" placeholder="Enter your password" />
      </Field>
      <Field label="Current password">
        <PasswordInput aria-label="Current password" autoComplete="current-password" />
      </Field>
    </Stack>
  ),
};
