import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { IconArrowDown, IconPlus, IconSparkles, IconTrash } from "../../icons";
import { Stack } from "../../layout";
import { Button, IconButton } from "./button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Save changes", onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "soft", "outline", "ghost", "link"] },
    tone: {
      control: "inline-radio",
      options: ["primary", "neutral", "info", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const VARIANTS = ["solid", "soft", "outline", "ghost", "link"] as const;
const TONES = ["primary", "neutral", "info", "success", "warning", "danger"] as const;

export const VariantsByTone: Story = {
  render: (args) => (
    <Stack gap="3">
      {TONES.map((tone) => (
        <Stack key={tone} direction="row" gap="3" align="center" wrap>
          {VARIANTS.map((variant) => (
            <Button key={variant} {...args} variant={variant} tone={tone}>
              {tone} {variant}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="3" align="center">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          Size {size}
        </Button>
      ))}
    </Stack>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Stack direction="row" gap="3" align="center" wrap>
      <Button {...args}>
        <IconPlus /> New project
      </Button>
      <Button {...args} variant="soft">
        <IconSparkles /> Generate with AI
      </Button>
      <Button {...args} variant="outline" tone="neutral">
        Export <IconArrowDown />
      </Button>
      <Button {...args} variant="soft" tone="danger">
        <IconTrash /> Delete
      </Button>
    </Stack>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <Stack direction="row" gap="2" align="center">
      {VARIANTS.slice(0, 4).map((variant) => (
        <IconButton key={variant} label={`Add (${variant})`} variant={variant} tone="primary">
          <IconPlus />
        </IconButton>
      ))}
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack direction="row" gap="3" align="center">
      <Button {...args}>Default</Button>
      <Button {...args} loading>
        Saving
      </Button>
      <Button {...args} disabled>
        Disabled
      </Button>
    </Stack>
  ),
};

export const Block: Story = { args: { block: true }, parameters: { layout: "padded" } };

export const AsLink: Story = {
  args: {
    asChild: true,
    variant: "outline",
    tone: "neutral",
    children: <a href="#docs">Read the docs</a>,
  },
};
