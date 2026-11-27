import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./heading";
import { Kbd } from "./kbd";
import { Label } from "./label";
import { Link } from "./link";
import { Radio } from "./radio";
import { Select } from "./select";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { Switch } from "./switch";
import { Textarea } from "./textarea";
import { Stack } from "../layout";
import { Text } from "./text";

const meta = { title: "Examples/Atoms in context" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextAndNativeControls: Story = {
  render: () => (
    <Stack gap="6" style={{ maxInlineSize: "32rem" }}>
      <Stack gap="2">
        <Heading level={2}>Quietly composable</Heading>
        <Text tone="secondary">
          Native controls stay native while the visual language remains consistent.
        </Text>
        <Text size="sm" tone="tertiary">
          Press <Kbd>⌘K</Kbd> to open the command palette or{" "}
          <Link external href="#docs">
            read the docs
          </Link>
          .
        </Text>
      </Stack>
      <Stack gap="2">
        <Label htmlFor="story-select" required>
          Workspace
        </Label>
        <Select id="story-select" defaultValue="design" placeholder="Choose a workspace">
          <option value="design">Design systems</option>
          <option value="product">Product engineering</option>
        </Select>
      </Stack>
      <Stack gap="2">
        <Label htmlFor="story-notes" hint="Optional">
          Notes
        </Label>
        <Textarea id="story-notes" placeholder="Add context for your teammates" />
      </Stack>
      <Stack direction="row" gap="4" align="center">
        <Stack direction="row" gap="2" align="center">
          <Radio name="story-plan" value="pro" defaultChecked aria-label="Pro plan" />
          <Text as="span">Pro plan</Text>
        </Stack>
        <Stack direction="row" gap="2" align="center">
          <Switch aria-label="Enable notifications" defaultChecked />
          <Text as="span">Notifications</Text>
        </Stack>
      </Stack>
      <Separator>or continue with a saved preset</Separator>
    </Stack>
  ),
};

export const LoadingAndPlaceholderStates: Story = {
  render: () => (
    <Stack gap="4" style={{ maxInlineSize: "28rem" }}>
      <Stack direction="row" gap="3" align="center">
        <Spinner />
        <Spinner size="lg" label="Loading preview" />
        <Text size="sm" tone="secondary">
          Fetching the latest preview…
        </Text>
      </Stack>
      <Stack gap="2">
        <Skeleton width="70%" />
        <Skeleton width="92%" />
        <Skeleton shape="rect" />
      </Stack>
    </Stack>
  ),
};

export const ValidationAndDisabledStates: Story = {
  render: () => (
    <Stack gap="4" style={{ maxInlineSize: "28rem" }}>
      <Stack gap="2">
        <Label htmlFor="invalid-select">Plan</Label>
        <Select id="invalid-select" invalid defaultValue="">
          <option value="">Choose a plan</option>
          <option value="team">Team</option>
        </Select>
      </Stack>
      <Textarea
        aria-label="Read-only reason"
        disabled
        value="This field is unavailable."
        readOnly
      />
      <Switch aria-label="Disabled setting" disabled />
    </Stack>
  ),
};
