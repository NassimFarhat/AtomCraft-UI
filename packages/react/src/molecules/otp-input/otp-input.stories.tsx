import type { Meta, StoryObj } from "@storybook/react-vite";
import { OTPInput } from "./otp-input";

const meta = {
  title: "Molecules/OTPInput",
  component: OTPInput,
  args: { label: "Verification code", length: 6, inputMode: "numeric" },
} satisfies Meta<typeof OTPInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SixDigits: Story = {};
export const Invalid: Story = { args: { invalid: true } };
