import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Heading } from "../heading";
import { Kbd } from "../kbd";
import { Link } from "../link";
import { Text } from "./text";

const meta = {
  title: "Examples/Typography",
  component: Text,
  args: { children: "The quick brown fox jumps over the lazy dog." },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: () => (
    <Stack gap="3">
      <Heading level={1} size="display-lg">
        Build interfaces, atom by atom
      </Heading>
      <Heading level={2} size="display-sm">
        Display small
      </Heading>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Heading {level}
        </Heading>
      ))}
    </Stack>
  ),
};

export const Body: Story = {
  render: (args) => (
    <Stack gap="2">
      {(["lg", "md", "sm", "xs"] as const).map((size) => (
        <Text key={size} {...args} size={size} />
      ))}
      <Text tone="secondary">Secondary text for supporting content.</Text>
      <Text tone="tertiary">Tertiary text, for hints.</Text>
      <Text tone="danger" weight="medium">
        Danger text, always with an explicit message.
      </Text>
      <Text truncate style={{ inlineSize: "16rem" }}>
        A very long line that is truncated with an ellipsis when it does not fit.
      </Text>
    </Stack>
  ),
};

export const LinksAndKeys: Story = {
  render: () => (
    <Stack gap="2">
      <Text>
        Read the <Link href="#guide">getting started guide</Link> or the{" "}
        <Link href="https://www.w3.org/WAI/ARIA/apg/" external>
          ARIA patterns
        </Link>
        .
      </Text>
      <Text tone="secondary">
        Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> to search.
      </Text>
    </Stack>
  ),
};
