import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileManager } from "./catalog-collaboration";

const meta = {
  title: "Organisms/FileManager",
  component: FileManager,
  args: {
    label: "Project files",
    emptyLabel: "This folder is empty.",
    openFolderLabel: "Open",
    downloadLabel: "Download",
    deleteLabel: "Delete",
    items: [
      { id: "design", name: "Design", kind: "folder", modified: "Today" },
      { id: "tokens", name: "tokens.json", kind: "file", size: "18 KB", modified: "Yesterday" },
    ],
    onOpenFolder: () => undefined,
    onSelect: () => undefined,
    onDownload: () => undefined,
    onDelete: () => undefined,
  },
} satisfies Meta<typeof FileManager>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FilesAndFolders: Story = {};
export const Empty: Story = { args: { items: [] } };
