import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "./alert-dialog";

const meta = {
  title: "Organisms/AlertDialog",
  component: AlertDialog,
  args: { children: null },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DestructiveConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button tone="danger" variant="soft">
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title="Delete Atlas?"
        description="The project and its files will be permanently removed."
        confirmLabel="Delete project"
        onConfirm={() => undefined}
      />
    </AlertDialog>
  ),
};
