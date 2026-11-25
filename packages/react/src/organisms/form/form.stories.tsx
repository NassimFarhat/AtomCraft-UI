import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";
import { Textarea } from "../../atoms/textarea";
import { Field } from "../../molecules/field";
import { SelectMenu } from "../../molecules/select-menu";
import { ErrorSummary, Form, FormActions, FormSection } from "./index";
import type { FieldError } from "./error-summary";

const topics = [
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "other", label: "Something else" },
];

const meta = {
  title: "Organisms/Form",
  component: Form,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Validation lives in the application; the design system shows the result. */
export const WithValidation: Story = {
  render: () => {
    const Demo = () => {
      const [errors, setErrors] = useState<FieldError[]>([]);
      const messageOf = (id: string) => errors.find((error) => error.fieldId === id)?.message;

      const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const found: FieldError[] = [];
        if (!String(data.get("name") ?? "").trim()) {
          found.push({ fieldId: "name", label: "Name", message: "Tell us your name" });
        }
        if (!String(data.get("email") ?? "").includes("@")) {
          found.push({ fieldId: "email", label: "Email", message: "Use a valid email address" });
        }
        setErrors(found);
      };

      return (
        <Form style={{ maxInlineSize: "32rem" }} onSubmit={submit}>
          <ErrorSummary errors={errors} />
          <FormSection title="Contact" description="We answer within one working day.">
            <Field label="Name" error={messageOf("name")} required>
              <Input id="name" name="name" />
            </Field>
            <Field label="Email" error={messageOf("email")} required>
              <Input id="email" name="email" type="email" />
            </Field>
            <Field label="Topic">
              <SelectMenu options={topics} name="topic" defaultValue="sales" />
            </Field>
            <Field label="Message" description="A few lines are enough.">
              <Textarea name="message" rows={4} />
            </Field>
          </FormSection>
          <FormActions align="between">
            <Button type="reset" variant="ghost" tone="neutral">
              Reset
            </Button>
            <Button type="submit">Send</Button>
          </FormActions>
        </Form>
      );
    };
    return <Demo />;
  },
};

export const TwoColumns: Story = {
  render: () => (
    <Form layout="grid" style={{ maxInlineSize: "40rem" }}>
      <FormSection title="Billing address" full>
        <Field label="Street">
          <Input />
        </Field>
      </FormSection>
      <Field label="City">
        <Input />
      </Field>
      <Field label="Postcode">
        <Input inputMode="numeric" />
      </Field>
    </Form>
  ),
};
