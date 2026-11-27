import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Label } from "../label";
import { Textarea } from "./textarea";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  args: { "aria-label": "Message", placeholder: "Write a message..." },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StatesAndResize: Story = {
  render: () => (
    <Stack gap="4" style={{ inlineSize: "22rem", maxInlineSize: "calc(100vw - 5rem)" }}>
      <Stack gap="2">
        <Label htmlFor="textarea-message">Message</Label>
        <Textarea id="textarea-message" rows={4} placeholder="Write a message..." />
      </Stack>
      <Textarea aria-label="Invalid message" invalid defaultValue="Please review this value." />
      <Textarea aria-label="Fixed-size notes" resize="none" defaultValue="Resize is disabled." />
    </Stack>
  ),
};
