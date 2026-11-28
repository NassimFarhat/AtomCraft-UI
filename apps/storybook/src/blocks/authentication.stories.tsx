import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  Grid,
  Heading,
  IconChevronLeft,
  IconCircleCheck,
  IconMail,
  Input,
  Link,
  Logo,
  OTPInput,
  PasswordInput,
  Separator,
  Stack,
  Text,
} from "@atomscraft/react";
import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Authentication blocks: a split-screen sign-up with a brand panel, password reset and
 * email verification. The brand panel uses the mesh gradient, so it follows the theme.
 */
const meta = {
  title: "Blocks/Authentication",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const gradientText: CSSProperties = {
  backgroundImage: "var(--ac-gradient-brand-text)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

/** Centers a single card on a softly lit canvas. */
function CenteredPage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minBlockSize: "100dvh",
        padding: "var(--ac-layout-gutter)",
        backgroundImage: "var(--ac-gradient-brand-glow)",
      }}
    >
      {children}
    </div>
  );
}

const HIGHLIGHTS = [
  "Accessible components with WAI-ARIA keyboard patterns",
  "Ten brand themes, light and dark, RTL ready",
  "Zero runtime dependencies",
];

export const SignUp: Story = {
  render: () => (
    <Grid columns={{ base: 1, lg: 2 }} gap="0" style={{ minBlockSize: "100dvh" }}>
      <div
        className="sb-hide-mobile"
        style={{
          display: "grid",
          alignContent: "space-between",
          gap: "var(--ac-space-8)",
          padding: "var(--ac-space-10)",
          backgroundColor: "var(--ac-color-bg-subtle)",
          backgroundImage: "var(--ac-gradient-brand-mesh)",
          borderInlineEnd: "1px solid var(--ac-color-border-subtle)",
        }}
      >
        <Logo mark="A">AtomCraft</Logo>
        <Stack gap="6">
          <Heading level={2} size="display-sm">
            Build interfaces that <span style={gradientText}>feel crafted</span>.
          </Heading>
          <Stack gap="3">
            {HIGHLIGHTS.map((item) => (
              <Stack key={item} direction="row" gap="2" align="center">
                <span style={{ color: "var(--ac-color-primary-text)", display: "inline-flex" }}>
                  <IconCircleCheck />
                </span>
                <Text size="sm" tone="secondary">
                  {item}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Text size="xs" tone="tertiary">
          © 2026 AtomCraft
        </Text>
      </div>
      <div style={{ display: "grid", placeItems: "center", padding: "var(--ac-layout-gutter)" }}>
        <Stack gap="6" style={{ inlineSize: "min(24rem, 100%)" }}>
          <Stack gap="2">
            <Heading level={1} size="2">
              Create your account
            </Heading>
            <Text tone="secondary">Start with the free plan. No card required.</Text>
          </Stack>
          <Stack direction="row" gap="2">
            <Button variant="outline" tone="neutral" block>
              Google
            </Button>
            <Button variant="outline" tone="neutral" block>
              GitHub
            </Button>
          </Stack>
          <Separator>or</Separator>
          <form onSubmit={(event) => event.preventDefault()} noValidate>
            <Stack gap="4">
              <Field label="Work email" required>
                <Input type="email" autoComplete="email" placeholder="name@company.com" />
              </Field>
              <Field label="Password" required description="At least 12 characters.">
                <PasswordInput autoComplete="new-password" />
              </Field>
              <Field label="I agree to the terms of service" layout="inline">
                <Checkbox />
              </Field>
              <Button type="submit" size="lg" block>
                Create account
              </Button>
            </Stack>
          </form>
          <Text size="sm" tone="secondary">
            Already have an account? <Link href="#signin">Sign in</Link>
          </Text>
        </Stack>
      </div>
    </Grid>
  ),
};

export const ForgotPassword: Story = {
  render: () => (
    <CenteredPage>
      <Card variant="elevated" style={{ inlineSize: "min(26rem, 100%)" }}>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>We will email you a link to choose a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => event.preventDefault()} noValidate>
            <Stack gap="4">
              <Field label="Email" required>
                <Input type="email" autoComplete="email" placeholder="name@company.com" />
              </Field>
              <Button type="submit" block>
                <IconMail /> Send reset link
              </Button>
            </Stack>
          </form>
        </CardContent>
        <CardFooter>
          <Link href="#signin">
            <IconChevronLeft />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </CenteredPage>
  ),
};

export const VerifyEmail: Story = {
  render: () => (
    <CenteredPage>
      <Card variant="elevated" style={{ inlineSize: "min(28rem, 100%)", textAlign: "center" }}>
        <CardContent>
          <Stack gap="5" align="center">
            <span
              aria-hidden="true"
              style={{
                display: "grid",
                placeItems: "center",
                inlineSize: "3rem",
                blockSize: "3rem",
                borderRadius: "var(--ac-radius-card)",
                backgroundImage: "var(--ac-gradient-brand-soft)",
                color: "var(--ac-color-primary-text)",
                boxShadow: "var(--ac-shadow-highlight), var(--ac-shadow-sm)",
              }}
            >
              <IconMail />
            </span>
            <Stack gap="1" align="center">
              <Heading level={1} size="3">
                Check your inbox
              </Heading>
              <Text size="sm" tone="secondary">
                Enter the 6-digit code we sent to <strong>nassim@atomcraft.dev</strong>.
              </Text>
            </Stack>
            <OTPInput label="Verification code" length={6} inputMode="numeric" />
            <Button block>Verify email</Button>
            <Text size="sm" tone="tertiary">
              Didn’t get it? <Link href="#resend">Resend code</Link>
            </Text>
          </Stack>
        </CardContent>
      </Card>
    </CenteredPage>
  ),
};
