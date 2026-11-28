import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Field,
  Form,
  FormActions,
  FormSection,
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  toast,
} from "@atomscraft/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FormEvent } from "react";

/**
 * Settings page block: vertical tabs, titled form sections, notification switches and a
 * danger zone. Copy it as a starting point; it only composes public components.
 */
const meta = { title: "Blocks/Settings", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const save = (event: FormEvent) => {
  event.preventDefault();
  toast.success("Settings saved", { description: "Your changes are live." });
};

function ProfileSettings() {
  return (
    <Form onSubmit={save}>
      <FormSection title="Profile" description="How your teammates see you across the workspace.">
        <Stack direction={{ base: "column", sm: "row" }} gap="4" align="center">
          <Avatar name="Nassim Farhat" size="xl" tone="primary" />
          <Stack direction="row" gap="2">
            <Button variant="outline" tone="neutral" size="sm">
              Upload photo
            </Button>
            <Button variant="ghost" tone="neutral" size="sm">
              Remove
            </Button>
          </Stack>
        </Stack>
        <Field label="Full name" required>
          <Input defaultValue="Nassim Farhat" autoComplete="name" />
        </Field>
        <Field label="Email" description="Used for sign-in and notifications.">
          <Input type="email" defaultValue="nassim@atomcraft.dev" autoComplete="email" />
        </Field>
        <Field label="Bio" hint="Optional">
          <Textarea placeholder="A sentence or two about your role" />
        </Field>
      </FormSection>
      <FormSection title="Preferences">
        <Field label="Language">
          <Select defaultValue="en">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </Select>
        </Field>
        <Field label="Time zone">
          <Select defaultValue="tunis">
            <option value="tunis">Africa/Tunis (UTC+1)</option>
            <option value="paris">Europe/Paris (UTC+1)</option>
            <option value="utc">UTC</option>
          </Select>
        </Field>
      </FormSection>
      <FormActions>
        <Button variant="ghost" tone="neutral" type="reset">
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </FormActions>
    </Form>
  );
}

const NOTIFICATIONS = [
  ["mentions", "Mentions", "When someone mentions you in a comment.", true],
  ["reviews", "Review requests", "When a design review is assigned to you.", true],
  ["digest", "Weekly digest", "A summary of workspace activity every Monday.", false],
  ["product", "Product updates", "New components and release notes.", false],
] as const;

function NotificationSettings() {
  return (
    <Form onSubmit={save}>
      <FormSection title="Email notifications" description="Choose what reaches your inbox.">
        {NOTIFICATIONS.map(([id, label, description, on]) => (
          <Stack key={id} direction="row" justify="between" align="center" gap="4">
            <Stack gap="0">
              <Text as="span" size="sm" weight="medium" id={`notify-${id}`}>
                {label}
              </Text>
              <Text as="span" size="sm" tone="tertiary">
                {description}
              </Text>
            </Stack>
            <Switch aria-labelledby={`notify-${id}`} defaultChecked={on} />
          </Stack>
        ))}
      </FormSection>
      <FormActions>
        <Button type="submit">Save preferences</Button>
      </FormActions>
    </Form>
  );
}

function DangerZone() {
  return (
    <Stack gap="4">
      <Alert tone="warning" variant="outline" title="Before you delete">
        Export your tokens and component settings first. Deleting a workspace cannot be undone.
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Delete workspace</CardTitle>
          <CardDescription>
            Removes all projects, themes and members of “AtomCraft Studio”.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button tone="danger">Delete workspace</Button>
        </CardFooter>
      </Card>
    </Stack>
  );
}

export const AccountSettings: Story = {
  render: () => (
    <Container size="lg" style={{ paddingBlock: "var(--ac-layout-section)" }}>
      <Stack gap="8">
        <Stack gap="1">
          <Heading level={1} size="2">
            Settings
          </Heading>
          <Text tone="secondary">Manage your profile, notifications and workspace.</Text>
        </Stack>
        <Tabs defaultValue="profile" orientation="vertical" variant="pills">
          <TabsList aria-label="Settings sections">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="danger">Danger zone</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardContent>
                <ProfileSettings />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="danger">
            <DangerZone />
          </TabsContent>
        </Tabs>
      </Stack>
    </Container>
  ),
};
