import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { SearchField } from "./search-field";

const meta = {
  title: "Molecules/SearchField",
  component: SearchField,
  args: { "aria-label": "Search projects", placeholder: "Search projects", shortcut: "Ctrl K" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "24rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack gap="3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <SearchField key={size} size={size} placeholder={`Search (${size})`} />
      ))}
    </Stack>
  ),
};
