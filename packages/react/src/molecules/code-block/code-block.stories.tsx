import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { CopyButton } from "../copy-button";
import { CodeBlock } from "./code-block";

const install = "pnpm add @atomscraft/react @atomscraft/css";

const usage = `import "@atomscraft/css";
import { AtomCraftProvider, Button } from "@atomscraft/react";

export function App() {
  return (
    <AtomCraftProvider locale="fr" theme="indigo">
      <Button tone="primary">Envoyer</Button>
    </AtomCraftProvider>
  );
}
`;

const meta = {
  title: "Molecules/CodeBlock",
  component: CodeBlock,
  args: { code: usage, language: "tsx", filename: "app.tsx" },
  parameters: { layout: "padded" },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLineNumbers: Story = { args: { showLineNumbers: true } };

export const Scrollable: Story = { args: { showLineNumbers: true, maxLines: 5 } };

export const Minimal: Story = {
  render: () => <CodeBlock code={install} />,
};

export const CopyButtons: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="center">
      <CopyButton value={install} />
      <CopyButton value={install} variant="outline">
        Copy command
      </CopyButton>
    </Stack>
  ),
};
