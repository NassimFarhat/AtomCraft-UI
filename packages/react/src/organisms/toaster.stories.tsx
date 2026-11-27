import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../atoms/button";
import { Stack } from "../layout";
import { toast } from "../molecules/toast";
import type { ToasterProps } from "../molecules/toast";
import { Toaster } from "../molecules/toast";

const positions: NonNullable<ToasterProps["position"]>[] = [
  "top-start",
  "top-center",
  "top-end",
  "bottom-start",
  "bottom-center",
  "bottom-end",
];

const meta = {
  title: "Organisms/Toaster",
  component: Toaster,
  args: {
    position: "bottom-end",
    limit: 5,
    newestOnTop: false,
    pauseOnHover: true,
    pauseOnFocus: true,
  },
  argTypes: {
    position: {
      control: { type: "select" },
      options: positions,
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Mount one Toaster near the application root. The Controls panel configures placement, visible stack limit, ordering, and hover/focus timer behavior.",
      },
    },
  },
  render: () => (
    <Stack direction="row" gap="2" wrap>
      <Button onClick={() => toast("Draft saved", { description: "Your changes are saved." })}>
        Show neutral toast
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.success("Profile updated", { description: "Your changes are live." })}
      >
        Show success toast
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast.error("Upload failed", {
            description: "The file could not be uploaded.",
            action: { label: "Retry", onClick: () => undefined },
          })
        }
      >
        Show actionable error
      </Button>
    </Stack>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Feedback: Story = {};
