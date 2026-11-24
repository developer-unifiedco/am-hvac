"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@ui-sdk/react/button";
import { Field, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { Textarea } from "@ui-sdk/react/textarea";
import { createAgent, registerTools } from "@ui-sdk/react/agent";

const recipient =
  process.env.NEXT_PUBLIC_ENQUIRY_EMAIL || "enquiries@am-hvac.example";

export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  useEffect(() => {
    const agent = createAgent();
    return registerTools(agent, { allow: (step) => !step.confirm });
  }, []);
  function compose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const body = `Name: ${fields.get("name")}\nEmail: ${fields.get("email")}\nPhone: ${fields.get("phone") || "—"}\n\n${fields.get("message")}`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent("HVAC enquiry from " + fields.get("name"))}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  }
  return (
    <form
      action={`mailto:${recipient}`}
      method="post"
      encType="text/plain"
      onSubmit={compose}
      onChange={() => setPrepared(false)}
      className="contact-form"
    >
      <Field name="name">
        <FieldLabel>Your name</FieldLabel>
        <Input autoComplete="name" required maxLength={100} />
      </Field>
      <Field name="email">
        <FieldLabel>Email address</FieldLabel>
        <Input type="email" autoComplete="email" required maxLength={254} />
      </Field>
      <Field name="phone">
        <FieldLabel>
          Phone <span>(optional)</span>
        </FieldLabel>
        <Input type="tel" autoComplete="tel" maxLength={40} />
      </Field>
      <Field name="message">
        <FieldLabel>What does your space need?</FieldLabel>
        <Textarea rows={3} required maxLength={1800} />
      </Field>
      <Button
        type="submit"
        className="action"
        data-agent-confirm="Opens an email draft containing the enquiry"
      >
        Prepare email enquiry <span aria-hidden="true">↗</span>
      </Button>
      <p className="form-note" aria-live="polite">
        {prepared
          ? "Continue in your email app to review and send your enquiry."
          : "Opens a draft in your email app."}
        {recipient.endsWith(".example") &&
          " Preview uses a demo email address."}
      </p>
    </form>
  );
}
