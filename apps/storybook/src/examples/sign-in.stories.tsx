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
  Input,
  Link,
  PasswordInput,
  Separator,
  Stack,
  Text,
} from "@atomcraft/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { FormEvent } from "react";

const meta = { title: "Examples/Sign in", parameters: { layout: "centered" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function SignInForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address, like name@company.tn.");
      return;
    }
    setError(undefined);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <Card variant="elevated" style={{ inlineSize: "min(26rem, 92vw)" }}>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your AtomCraft workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} noValidate>
          <Stack gap="4">
            <Stack direction="row" gap="2">
              <Button variant="outline" tone="neutral" block>
                Google
              </Button>
              <Button variant="outline" tone="neutral" block>
                GitHub
              </Button>
            </Stack>
            <Separator>or continue with email</Separator>
            <Field label="Email" required error={error}>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field label="Password" required>
              <PasswordInput />
            </Field>
            <Stack direction="row" justify="between" align="center">
              <Field label="Remember me" layout="inline">
                <Checkbox />
              </Field>
              <Text size="sm" as="span">
                <Link href="#forgot">Forgot password?</Link>
              </Text>
            </Stack>
            <Button type="submit" loading={loading} block>
              Sign in
            </Button>
          </Stack>
        </form>
      </CardContent>
      <CardFooter>
        <Text size="sm" tone="secondary">
          No account yet? <Link href="#signup">Create one</Link>
        </Text>
      </CardFooter>
    </Card>
  );
}

export const SignIn: Story = { render: () => <SignInForm /> };
