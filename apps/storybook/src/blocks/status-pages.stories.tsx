import {
  Banner,
  Button,
  Card,
  CardContent,
  Container,
  EmptyState,
  ErrorState,
  Heading,
  IconFolder,
  IconHome,
  IconPlus,
  IconSearch,
  Logo,
  Stack,
  Text,
} from "@atomscraft/react";
import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

/** Full-page states: not found, server error, an empty project and planned maintenance. */
const meta = { title: "Blocks/Status pages", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const gradientText: CSSProperties = {
  backgroundImage: "var(--ac-gradient-brand-text)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

function Page({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        minBlockSize: "100dvh",
        backgroundImage: "var(--ac-gradient-brand-glow)",
      }}
    >
      <div style={{ padding: "var(--ac-space-6) var(--ac-layout-gutter)" }}>
        <Logo mark="A">AtomCraft</Logo>
      </div>
      <div style={{ display: "grid", placeItems: "center", padding: "var(--ac-layout-gutter)" }}>
        {children}
      </div>
    </div>
  );
}

export const NotFound: Story = {
  render: () => (
    <Page>
      <Stack gap="6" align="center" style={{ textAlign: "center", maxInlineSize: "32rem" }}>
        <Text
          as="span"
          weight="bold"
          style={{
            ...gradientText,
            fontFamily: "var(--ac-font-family-display)",
            fontSize: "clamp(4.5rem, 12vw + 1rem, 8rem)",
            letterSpacing: "var(--ac-letter-spacing-tightest)",
            lineHeight: 1,
          }}
        >
          404
        </Text>
        <Stack gap="2" align="center">
          <Heading level={1} size="2">
            This page wandered off
          </Heading>
          <Text tone="secondary">
            The link may be broken, or the page may have moved. Try searching the docs instead.
          </Text>
        </Stack>
        <Stack direction="row" gap="2">
          <Button>
            <IconHome /> Back home
          </Button>
          <Button variant="outline" tone="neutral">
            <IconSearch /> Search docs
          </Button>
        </Stack>
      </Stack>
    </Page>
  ),
};

export const ServerError: Story = {
  render: () => (
    <Page>
      <div style={{ inlineSize: "min(32rem, 100%)" }}>
        <ErrorState
          title="Something went wrong on our side"
          action={
            <Stack direction="row" gap="2">
              <Button>Try again</Button>
              <Button variant="ghost" tone="neutral">
                Status page
              </Button>
            </Stack>
          }
        >
          The service did not respond. Your work is saved; reference code AC-500-7F3.
        </ErrorState>
      </div>
    </Page>
  ),
};

export const EmptyProject: Story = {
  render: () => (
    <Container size="lg" style={{ paddingBlock: "var(--ac-layout-section)" }}>
      <Stack gap="6">
        <Stack gap="1">
          <Heading level={1} size="2">
            Projects
          </Heading>
          <Text tone="secondary">Everything your team is building.</Text>
        </Stack>
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconFolder />}
              title="Create your first project"
              description="Projects group your themes, tokens and component overrides."
              actions={
                <>
                  <Button>
                    <IconPlus /> New project
                  </Button>
                  <Button variant="outline" tone="neutral">
                    Import from Figma
                  </Button>
                </>
              }
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  ),
};

export const Maintenance: Story = {
  render: () => (
    <Page>
      <Stack gap="6" style={{ inlineSize: "min(36rem, 100%)" }}>
        <Banner tone="warning" title="Scheduled maintenance">
          The dashboard is read-only from 22:00 to 22:30 UTC while we upgrade the database.
        </Banner>
        <Stack gap="2" align="center" style={{ textAlign: "center" }}>
          <Heading level={1} size="2">
            We will be right back
          </Heading>
          <Text tone="secondary">
            Published sites and the npm packages are not affected. Follow live updates on the status
            page.
          </Text>
        </Stack>
      </Stack>
    </Page>
  ),
};
