import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Input } from "../input";
import { Label } from "./label";

const meta = {
  title: "Atoms/Label",
  component: Label,
  args: { children: "Email address" },
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const RequiredAndOptional: Story = {
  render: () => (
    <Stack gap="4" style={{ inlineSize: "20rem", maxInlineSize: "calc(100vw - 5rem)" }}>
      <Stack gap="2">
        <Label htmlFor="label-required" required>
          Email
        </Label>
        <Input id="label-required" type="email" />
      </Stack>
      <Stack gap="2">
        <Label htmlFor="label-optional" hint="Optional">
          Company
        </Label>
        <Input id="label-optional" />
      </Stack>
    </Stack>
  ),
};
