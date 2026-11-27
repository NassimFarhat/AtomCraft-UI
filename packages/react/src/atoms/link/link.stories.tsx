import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Link } from "./link";

const meta = {
  title: "Atoms/Link",
  component: Link,
  args: { href: "#link-example", children: "Read the guide" },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TonesAndUnderlines: Story = {
  render: () => (
    <Stack gap="3" align="start">
      <Link href="#primary">Primary link</Link>
      <Link href="#neutral" tone="neutral" underline="always">
        Neutral, always underlined
      </Link>
      <Link href="#plain" underline="none">
        No underline
      </Link>
      <Link href="https://example.com" external>
        External link
      </Link>
    </Stack>
  ),
};
