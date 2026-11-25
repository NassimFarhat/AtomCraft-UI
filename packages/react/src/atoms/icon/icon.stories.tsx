import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../text";
import { Icon, iconNames } from "./icon";

const meta = {
  title: "Foundations/Icons",
  component: Icon,
  args: { name: "Sparkles" },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Icon key={size} name={args.name} size={size} />
      ))}
    </div>
  ),
};

/** Every icon of the built-in set, as `Icon` renders them by name. */
export const BuiltInSet: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "var(--ac-space-4)",
        gridTemplateColumns: "repeat(auto-fill, minmax(7rem, 1fr))",
      }}
    >
      {iconNames.map((name) => (
        <div key={name} style={{ display: "grid", gap: "0.5rem", justifyItems: "center" }}>
          <Icon name={name} size="lg" />
          <Text size="sm" tone="secondary">
            {name}
          </Text>
        </div>
      ))}
    </div>
  ),
};
