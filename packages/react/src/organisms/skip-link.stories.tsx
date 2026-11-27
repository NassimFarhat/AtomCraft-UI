import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../layout";
import { Text } from "../atoms/text";
import { SkipLink } from "./essentials";

const meta = {
  title: "Organisms/SkipLink",
  component: SkipLink,
  args: { href: "#main-content", children: "Skip to main content" },
} satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const KeyboardAccess: Story = {
  render: (args) => (
    <Stack gap="3" style={{ inlineSize: "min(32rem, calc(100vw - 5rem))", padding: "2rem" }}>
      <SkipLink {...args} />
      <Text tone="secondary">
        Tab to reveal the skip link, then activate it to jump to the main content.
      </Text>
      <main id="main-content" tabIndex={-1}>
        <Text>Keyboard users can bypass repeated navigation and start here.</Text>
      </main>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLAnchorElement>("a")?.focus();
  },
};
