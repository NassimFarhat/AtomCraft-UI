import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IconSparkles } from "../../icons";
import { Stack } from "../../layout";
import type { Tone } from "../../types";
import { Tag } from "./tag";

const TONES: Tone[] = ["primary", "neutral", "info", "success", "warning", "danger"];

const meta = {
  title: "Atoms/Tag",
  component: Tag,
  args: { children: "Design" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <Stack direction="row" gap="2" wrap>
      {TONES.map((tone) => (
        <Tag key={tone} tone={tone}>
          {tone}
        </Tag>
      ))}
    </Stack>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack direction="row" gap="2" align="center">
      {(["solid", "soft", "outline"] as const).map((variant) => (
        <Tag key={variant} variant={variant} tone="primary">
          {variant}
        </Tag>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="2" align="center">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tag key={size} size={size} icon={<IconSparkles />}>
          {size}
        </Tag>
      ))}
    </Stack>
  ),
};

export const Removable: Story = {
  render: () => {
    const Demo = () => {
      const [tags, setTags] = useState(["Sfax", "Tunis", "Kerkennah"]);
      return (
        <Stack direction="row" gap="2" wrap>
          {tags.map((tag) => (
            <Tag
              key={tag}
              tone="primary"
              removeLabel={`Remove ${tag}`}
              onRemove={() => setTags((current) => current.filter((item) => item !== tag))}
            >
              {tag}
            </Tag>
          ))}
        </Stack>
      );
    };
    return <Demo />;
  },
};
