import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload } from "./file-upload";

const meta = {
  title: "Molecules/FileUpload",
  component: FileUpload,
  args: {
    label: "Add release files",
    description: "Choose files or drop them here. PDF files only.",
    accept: ".pdf,application/pdf",
    maxFiles: 3,
  },
} satisfies Meta<typeof FileUpload>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleDocuments: Story = {};
export const SingleImage: Story = {
  args: {
    label: "Upload a preview image",
    description: "One image file.",
    accept: "image/*",
    multiple: false,
  },
};
