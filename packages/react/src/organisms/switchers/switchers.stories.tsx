import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../../atoms/text";
import { Stack } from "../../layout";
import { AtomCraftProvider } from "../../provider";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";

const meta = {
  title: "Organisms/Switchers",
  component: ThemeSwitcher,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Both switchers write to the nearest AtomCraftProvider, so this story brings
 * its own: the panel below changes mode and direction on its own, while the
 * rest of Storybook keeps following the toolbar.
 */
export const Default: Story = {
  render: () => (
    <AtomCraftProvider defaultMode="light" defaultLocale="en" theme="indigo">
      <Stack
        gap="4"
        style={{
          padding: "var(--ac-space-6)",
          borderRadius: "var(--ac-radius-card)",
          background: "var(--ac-color-bg-surface)",
          color: "var(--ac-color-text-primary)",
        }}
      >
        <Stack direction="row" gap="2" align="center" wrap>
          <ThemeSwitcher />
          <LocaleSwitcher />
          <ThemeSwitcher compact />
          <LocaleSwitcher compact />
        </Stack>
        <Text size="sm" tone="secondary">
          The mode, the language and the text direction all come from the provider.
        </Text>
      </Stack>
    </AtomCraftProvider>
  ),
};
