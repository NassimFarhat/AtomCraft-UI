import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  Field,
  Input,
  Logo,
  RadioGroup,
  RadioGroupItem,
  Stack,
  Stepper,
  TagInput,
  Text,
} from "@atomscraft/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

/**
 * Onboarding block: a three-step workspace setup with a Stepper, card-style choices and
 * invitations. State is local to the story; a real app owns validation and persistence.
 */
const meta = { title: "Blocks/Onboarding", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [
  { id: "workspace", label: "Workspace", description: "Name and URL" },
  { id: "use", label: "Use case", description: "Tailor the starter kit" },
  { id: "team", label: "Team", description: "Invite collaborators" },
];

function StepBody({ step }: { step: number }) {
  if (step === 1) {
    return (
      <Stack gap="4">
        <Field label="Workspace name" required>
          <Input defaultValue="AtomCraft Studio" />
        </Field>
        <Field label="Workspace URL" description="You can change this later.">
          <Input defaultValue="atomcraft-studio" />
        </Field>
      </Stack>
    );
  }
  if (step === 2) {
    return (
      <RadioGroup label="What will you build first?" defaultValue="app" variant="cards">
        <RadioGroupItem value="app" label="Web application" description="Dashboards and tools" />
        <RadioGroupItem value="site" label="Marketing site" description="Landing pages and docs" />
        <RadioGroupItem value="system" label="Design system" description="Tokens and themes" />
      </RadioGroup>
    );
  }
  return (
    <Field label="Invite by email" description="Press Enter after each address.">
      <TagInput defaultValue={["amel@atomcraft.dev", "zied@atomcraft.dev"]} />
    </Field>
  );
}

function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const last = step === STEPS.length;
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minBlockSize: "100dvh",
        padding: "var(--ac-layout-gutter)",
        backgroundImage: "var(--ac-gradient-brand-mesh)",
      }}
    >
      <Stack gap="6" style={{ inlineSize: "min(40rem, 100%)" }}>
        <Stack direction="row" justify="between" align="center">
          <Logo mark="A">AtomCraft</Logo>
          <Text size="sm" tone="tertiary">
            Step {step} of {STEPS.length}
          </Text>
        </Stack>
        <Stepper label="Workspace setup" steps={STEPS} currentStep={step} />
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{STEPS[step - 1]?.label}</CardTitle>
            <CardDescription>{STEPS[step - 1]?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <StepBody step={step} />
          </CardContent>
          <CardFooter style={{ justifyContent: "space-between" }}>
            <Button
              variant="ghost"
              tone="neutral"
              disabled={step === 1}
              onClick={() => setStep((current) => current - 1)}
            >
              Back
            </Button>
            <Button onClick={() => setStep((current) => (last ? 1 : current + 1))}>
              {last ? "Finish setup" : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </Stack>
    </div>
  );
}

export const WorkspaceSetup: Story = { render: () => <OnboardingFlow /> };
