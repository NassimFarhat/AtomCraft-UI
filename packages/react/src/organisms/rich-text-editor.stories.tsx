import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichTextEditor } from "./catalog-collaboration";

const meta = {
  title: "Organisms/RichTextEditor",
  component: RichTextEditor,
  args: {
    label: "Release notes",
    placeholder: "Write with Markdown formatting…",
    formatLabels: { bold: "Bold", italic: "Italic", bulletList: "Bullet list" },
    defaultValue: "Highlights\n\nNew component examples are ready for review.",
  },
} satisfies Meta<typeof RichTextEditor>;
export default meta;
type Story = StoryObj<typeof meta>;
export const MarkdownEditor: Story = {};
