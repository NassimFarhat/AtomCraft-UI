import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconCheck, IconPlus, IconSearch } from "../icons";
import { Grid, Stack } from "../layout";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Button, IconButton } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Kbd } from "./kbd";
import { Label } from "./label";
import { Logo } from "./logo";
import { Progress } from "./progress";
import { Radio } from "./radio";
import { Select } from "./select";
import { Slider } from "./slider";
import { Switch } from "./switch";
import { Tag } from "./tag";
import { Text } from "./text";
import { Toggle } from "./toggle";

/**
 * One page with every atom in its interactive states, for visual review of the design
 * system across Mode, Theme, Density, Shape and Contrast (Storybook toolbar).
 */
const meta = {
  title: "Examples/Atom states",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ["solid", "soft", "outline", "ghost", "link"] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack direction={{ base: "column", md: "row" }} gap="3" align="center">
      <Text size="xs" tone="tertiary" style={{ inlineSize: "7rem", flexShrink: 0 }}>
        {label}
      </Text>
      <Stack direction="row" gap="2" align="center" wrap>
        {children}
      </Stack>
    </Stack>
  );
}

export const Buttons: Story = {
  render: () => (
    <Stack gap="4">
      {VARIANTS.map((variant) => (
        <Row key={variant} label={variant}>
          <Button variant={variant}>Continue</Button>
          <Button variant={variant} tone="neutral">
            Neutral
          </Button>
          <Button variant={variant} tone="danger">
            Delete
          </Button>
          <Button variant={variant} loading>
            Saving
          </Button>
          <Button variant={variant} disabled>
            Disabled
          </Button>
        </Row>
      ))}
      <Row label="sizes">
        <Button size="xs">Extra small</Button>
        <Button size="sm">
          <IconPlus /> Small
        </Button>
        <Button>
          <IconPlus /> Medium
        </Button>
        <Button size="lg">
          <IconPlus /> Large
        </Button>
        <IconButton label="Search">
          <IconSearch />
        </IconButton>
        <IconButton label="Confirm" variant="solid" tone="primary">
          <IconCheck />
        </IconButton>
      </Row>
      <Row label="toggle">
        <Toggle>Bold</Toggle>
        <Toggle defaultPressed>Italic</Toggle>
        <Toggle disabled>Strike</Toggle>
      </Row>
    </Stack>
  ),
};

export const FormControls: Story = {
  render: () => (
    <Grid minItemWidth="16rem" gap="6" style={{ maxInlineSize: "56rem" }}>
      <Stack gap="2">
        <Label htmlFor="states-default">Default</Label>
        <Input id="states-default" placeholder="name@company.com" />
      </Stack>
      <Stack gap="2">
        <Label htmlFor="states-invalid" required>
          Invalid
        </Label>
        <Input id="states-invalid" invalid defaultValue="not-an-email" />
      </Stack>
      <Stack gap="2">
        <Label htmlFor="states-disabled">Disabled</Label>
        <Input id="states-disabled" disabled defaultValue="Locked value" />
      </Stack>
      <Stack gap="2">
        <Label htmlFor="states-readonly" hint="Read only">
          Workspace ID
        </Label>
        <Input id="states-readonly" readOnly defaultValue="ws_29f8a1" />
      </Stack>
      <Stack gap="2">
        <Label htmlFor="states-select">Select</Label>
        <Select id="states-select" defaultValue="pro">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </Select>
      </Stack>
      <Stack gap="2">
        <Label id="states-slider-label">Volume</Label>
        <Slider labelledBy="states-slider-label" defaultValue={64} />
      </Stack>
    </Grid>
  ),
};

export const ChoiceControls: Story = {
  render: () => (
    <Stack gap="4">
      <Row label="checkbox">
        <Checkbox aria-label="Unchecked" />
        <Checkbox aria-label="Checked" defaultChecked />
        <Checkbox aria-label="Invalid" invalid />
        <Checkbox aria-label="Disabled" disabled />
        <Checkbox aria-label="Disabled checked" disabled defaultChecked />
      </Row>
      <Row label="radio">
        <Radio name="states-radio" aria-label="Option A" />
        <Radio name="states-radio" aria-label="Option B" defaultChecked />
        <Radio aria-label="Disabled" disabled />
      </Row>
      <Row label="switch">
        <Switch aria-label="Off" />
        <Switch aria-label="On" defaultChecked />
        <Switch aria-label="Small" size="sm" defaultChecked />
        <Switch aria-label="Large" size="lg" defaultChecked />
        <Switch aria-label="Disabled" disabled />
      </Row>
    </Stack>
  ),
};

export const DisplayAtoms: Story = {
  render: () => (
    <Stack gap="4">
      <Row label="badge">
        <Badge>Neutral</Badge>
        <Badge tone="primary">Primary</Badge>
        <Badge tone="success" dot>
          Live
        </Badge>
        <Badge tone="warning" variant="outline">
          Pending
        </Badge>
        <Badge tone="danger" variant="solid">
          12
        </Badge>
      </Row>
      <Row label="tag">
        <Tag onRemove={() => undefined} removeLabel="Remove design">
          Design
        </Tag>
        <Tag tone="primary" variant="solid">
          Solid
        </Tag>
        <Tag tone="info" variant="outline">
          Outline
        </Tag>
        <Tag disabled>Disabled</Tag>
      </Row>
      <Row label="avatar">
        <Avatar name="Ada Lovelace" status="online" statusLabel="Online" />
        <Avatar name="Grace Hopper" tone="primary" />
        <Avatar name="Alan Turing" shape="square" size="lg" />
      </Row>
      <Row label="progress">
        <div style={{ inlineSize: "16rem" }}>
          <Progress value={62} aria-label="Upload progress" />
        </div>
      </Row>
      <Row label="logo + kbd">
        <Logo mark="A">AtomCraft</Logo>
        <Text size="sm" tone="secondary">
          Search <Kbd>⌘</Kbd> <Kbd>K</Kbd>
        </Text>
      </Row>
    </Stack>
  ),
};
