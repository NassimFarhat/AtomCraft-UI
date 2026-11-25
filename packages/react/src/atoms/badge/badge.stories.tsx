import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconCircleCheck } from "../../icons";
import { Stack } from "../../layout";
import { Badge } from "./badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "New" },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "soft", "outline"] },
    tone: {
      control: "inline-radio",
      options: ["primary", "neutral", "info", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VariantsByTone: Story = {
  render: () => (
    <Stack gap="3">
      {(["solid", "soft", "outline"] as const).map((variant) => (
        <Stack key={variant} direction="row" gap="2" wrap>
          {(["primary", "neutral", "info", "success", "warning", "danger"] as const).map((tone) => (
            <Badge key={tone} variant={variant} tone={tone}>
              {tone}
            </Badge>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const WithDotAndIcon: Story = {
  render: () => (
    <Stack direction="row" gap="2" align="center">
      <Badge dot tone="success">
        Operational
      </Badge>
      <Badge dot tone="warning">
        Degraded
      </Badge>
      <Badge tone="primary" variant="solid">
        <IconCircleCheck /> Verified
      </Badge>
      <Badge size="sm">v1.0</Badge>
      <Badge size="lg" variant="outline">
        Large
      </Badge>
    </Stack>
  ),
};
