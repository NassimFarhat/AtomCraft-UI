import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell } from "./app-shell";
import { Button } from "../../atoms/button";
import { Text } from "../../atoms/text";

const meta = { title: "Templates/AppShell" } satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyRegions: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <AppShell
      header={<header style={{ padding: "var(--ac-space-4)" }}>Project header</header>}
      sidebar={<nav aria-label="Project navigation">Project navigation</nav>}
    >
      <Text size="lg" weight="semibold">
        Main content
      </Text>
      <Button style={{ marginBlockStart: "var(--ac-space-4)" }}>Continue</Button>
    </AppShell>
  ),
};
