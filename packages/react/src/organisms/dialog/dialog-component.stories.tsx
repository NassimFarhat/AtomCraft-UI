import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";
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

const meta = {
  title: "Organisms/Dialog",
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
          <DialogDescription>Update the name your teammates see.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Stack gap="4">
            <Field label="Full name">
              <Input defaultValue="Amel Ben Salah" />
            </Field>
            <Field label="Username">
              <Input defaultValue="amel" />
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
