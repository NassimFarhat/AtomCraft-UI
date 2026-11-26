import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../atoms/avatar";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { IconArrowUp, IconCheck, IconSearch, IconSparkles } from "../icons";
import { Stack } from "../layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Alert } from "./alert";
import { AvatarGroup } from "./avatar-group";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "./breadcrumb";
import { CopyButton } from "./copy-button";
import { DatePicker } from "./date-picker";
import { EmptyState } from "./empty-state";
import { InputGroup } from "./input-group";
import { NavItem } from "./nav-item";
import { PasswordInput } from "./password-input";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./popover";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { SearchField } from "./search-field";
import { SelectMenu } from "./select-menu";
import { Stat } from "./stat";
import { Tooltip } from "./tooltip";
import { toast } from "./toast";

const meta = { title: "Molecules/Library" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const planOptions = [
  { value: "starter", label: "Starter", description: "For a small personal project" },
  { value: "pro", label: "Pro", description: "For a growing product team" },
  { value: "team", label: "Team", description: "For multiple workspaces", group: "Recommended" },
];

export const NavigationAndFeedback: Story = {
  render: () => (
    <Stack gap="6" style={{ maxInlineSize: "44rem" }}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#workspace">Workspace</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stack direction="row" gap="4" align="center" wrap>
        <AvatarGroup max={3} overflowLabel={(count) => `${count} more teammates`}>
          <Avatar name="Amel Ben Salah" />
          <Avatar name="Zied Trabelsi" tone="info" />
          <Avatar name="Emna Gharbi" tone="success" />
          <Avatar name="Youssef Kchaou" tone="warning" />
        </AvatarGroup>
        <NavItem href="#overview" active badge={8}>
          Overview
        </NavItem>
        <Stat
          label="Conversion"
          value="24.8%"
          delta="+4.2%"
          trend="up"
          caption="vs last month"
          icon={<IconArrowUp />}
        />
      </Stack>
      <Alert
        tone="success"
        title="Your workspace is ready"
        actions={<Button size="sm">Invite teammates</Button>}
      >
        Everyone can now access the latest project resources.
      </Alert>
      <EmptyState
        icon={<IconSearch />}
        title="No saved views yet"
        description="Create a view to return to the filters you use most."
        actions={<Button variant="soft">Create a view</Button>}
      />
    </Stack>
  ),
};

export const FormControls: Story = {
  render: () => (
    <Stack gap="5" style={{ maxInlineSize: "32rem" }}>
      <InputGroup start="$" end="/month">
        <Input aria-label="Monthly budget" inputMode="decimal" placeholder="0.00" />
      </InputGroup>
      <PasswordInput aria-label="Password" placeholder="Enter your password" />
      <SearchField placeholder="Search projects" shortcut="⌘K" />
      <SelectMenu options={planOptions} defaultValue="pro" aria-label="Plan" />
      <DatePicker defaultValue={new Date(2026, 1, 23)} showFormatHint aria-label="Launch date" />
      <RadioGroup label="Deployment target" defaultValue="cloud" variant="cards">
        <RadioGroupItem value="cloud" label="Cloud" description="Managed infrastructure" />
        <RadioGroupItem
          value="self-hosted"
          label="Self-hosted"
          description="Run it in your network"
        />
      </RadioGroup>
    </Stack>
  ),
};

export const DisclosureAndTransientFeedback: Story = {
  render: () => (
    <Stack gap="5" style={{ maxInlineSize: "42rem" }}>
      <Accordion defaultValue={["access"]} variant="contained">
        <AccordionItem value="access">
          <AccordionTrigger>Who can access a workspace?</AccordionTrigger>
          <AccordionContent>
            Workspace owners can invite teammates and choose the role each person receives.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="billing">
          <AccordionTrigger>Where can I change billing?</AccordionTrigger>
          <AccordionContent>
            Open Settings, then choose Billing from the workspace menu.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Stack direction="row" gap="3" align="center">
        <Tooltip content="Copies the project identifier">
          <CopyButton value="project_atomcraft_2026" label="Copy project id" />
        </Tooltip>
        <Popover>
          <PopoverTrigger>
            <Button variant="outline" tone="neutral">
              <IconSparkles /> Quick note
            </Button>
          </PopoverTrigger>
          <PopoverContent aria-label="Quick note">
            <Stack gap="3">
              <strong>Keep your team in sync</strong>
              <span>Share a short note from this workspace.</span>
              <PopoverClose>
                <Button size="sm">Done</Button>
              </PopoverClose>
            </Stack>
          </PopoverContent>
        </Popover>
        <Button
          variant="soft"
          onClick={() => toast.success("Saved", { description: "Your view is ready to use." })}
        >
          <IconCheck /> Show toast
        </Button>
      </Stack>
    </Stack>
  ),
};
