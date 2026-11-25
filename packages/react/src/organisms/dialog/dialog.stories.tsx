import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "./alert-dialog";
import { Input } from "../../atoms/input";
import { Text } from "../../atoms/text";
import { Stack } from "../../layout";
import { Field } from "../../molecules/field";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { SheetContent } from "./sheet";

const meta = {
  title: "Organisms/Dialog & Sheet",
  component: Dialog,
  args: { children: null },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditProfile: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Changes are visible to your whole workspace.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Stack gap="4">
            <Field label="Name">
              <Input defaultValue="Nassim Farhat" />
            </Field>
            <Field label="Username">
              <Input defaultValue="@nassim" />
            </Field>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" tone="neutral">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmDeletion: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button tone="danger" variant="soft">
          Delete project
        </Button>
      </DialogTrigger>
      <DialogContent alert size="sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete “Atlas”?</DialogTitle>
          <DialogDescription>
            The project and its 24 files will be deleted. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" tone="neutral">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button tone="danger">Delete project</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** The same confirmation as above, as one AlertDialog instead of six parts. */
export const AlertDialogStory: Story = {
  name: "Alert dialog",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button tone="danger" variant="soft">
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title="Delete “Atlas”?"
        description="The project and its 24 files will be deleted. This cannot be undone."
        confirmLabel="Delete project"
        onConfirm={() => undefined}
      />
    </AlertDialog>
  ),
};

export const Sheets: Story = {
  render: () => (
    <Stack direction="row" gap="2">
      {(["start", "end", "bottom"] as const).map((side) => (
        <Dialog key={side}>
          <DialogTrigger>
            <Button variant="outline" tone="neutral">
              Open {side}
            </Button>
          </DialogTrigger>
          <SheetContent side={side}>
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
              <DialogDescription>Narrow down the results.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Text tone="secondary">
                Sheet content slides from the {side} edge and follows the reading direction.
              </Text>
            </DialogBody>
          </SheetContent>
        </Dialog>
      ))}
    </Stack>
  ),
};
