import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { toast } from "./toast-store";
import { Button } from "../../atoms/button";
import { Stack } from "../../layout";
import { Toast } from "./toast";

const meta = {
  title: "Molecules/Toast",
  component: Toast,
  args: {
    title: "Changes saved",
    description: "Your work is up to date.",
    tone: "success",
    onDismiss: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "A presentational toast surface for short feedback messages. Queueing, timing and placement are provided by the Toaster organism; see Organisms/Toaster for its controls and behavior.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Feedback: Story = {
  render: () => (
    <Stack direction="row" gap="2" wrap>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast("Draft saved", { description: "Your changes are saved locally." })}
      >
        Neutral
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.success("Profile updated", { description: "Your changes are live." })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast.warning("Unsaved changes", { description: "Save before leaving this page." })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast.error("Upload failed", {
            description: "The file is too large.",
            action: { label: "Retry", onClick: () => undefined },
          })
        }
      >
        Error with action
      </Button>
    </Stack>
  ),
};

export const Surface: Story = {
  render: (toastProps) => (
    <ol className="ac-toaster__list" style={{ maxInlineSize: "24rem", listStyle: "none" }}>
      <Toast {...toastProps} duration={5000} progress />
    </ol>
  ),
};

export const PromiseStates: Story = {
  render: () => (
    <Stack direction="row" gap="2" wrap>
      <Button
        variant="solid"
        tone="primary"
        onClick={() => {
          const request = new Promise<{ fileName: string }>((resolve) => {
            window.setTimeout(() => resolve({ fileName: "atomcraft-release.zip" }), 1400);
          });
          void toast.promise(request, {
            loading: {
              title: "Uploading package",
              description: "Preparing the release artifact...",
            },
            success: ({ fileName }) => ({ title: "Upload complete", description: fileName }),
            error: "Upload failed",
          });
        }}
      >
        Resolve promise
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => {
          const request = new Promise<never>((_, reject) => {
            window.setTimeout(
              () => reject(new Error("The network connection was interrupted.")),
              1400,
            );
          });
          void toast
            .promise(request, {
              loading: "Saving changes...",
              success: "Changes saved",
              error: (error) => ({
                title: "Could not save",
                description: error instanceof Error ? error.message : String(error),
              }),
            })
            .catch(() => undefined);
        }}
      >
        Reject promise
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => {
          const id = toast.loading("Processing export", { description: "This can take a moment." });
          window.setTimeout(
            () =>
              toast.update(id, "Export ready", { tone: "success", loading: false, duration: 4500 }),
            1800,
          );
        }}
      >
        Update loading toast
      </Button>
    </Stack>
  ),
};
