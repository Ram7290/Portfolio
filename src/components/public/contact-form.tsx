"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { messagesApi } from "@/lib/api-client";

interface ContactFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<ContactFields>();

  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const onSubmit = handleSubmit(async (values) => {
    setPending(true);
    try {
      const result = await messagesApi.submit({
        ...values,
        website: honeypot,
      });

      if (result.ok) {
        setSubmitted(true);
        toast.success("Message sent — thank you! I'll get back to you soon.");
        reset();
      } else {
        // Try to parse field errors from error string
        try {
          const parsed = JSON.parse(result.error || "{}");
          if (parsed.fieldErrors) {
            for (const [field, message] of Object.entries(parsed.fieldErrors)) {
              setError(field as keyof ContactFields, { message: message as string });
            }
          }
        } catch {
          // Not JSON, just show the error
        }
        toast.error(result.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot — hidden from humans, catches bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            {...register("name", {
              required: "Please enter your name.",
              maxLength: { value: 120, message: "Name is too long." },
            })}
          />
          {errors.name ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email", {
              required: "Please enter your email.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          {errors.email ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          placeholder="What's this about?"
          aria-invalid={Boolean(errors.subject)}
          {...register("subject", {
            required: "Please enter a subject.",
            maxLength: { value: 200, message: "Subject is too long." },
          })}
        />
        {errors.subject ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={6}
          placeholder="Tell me about your project or question…"
          aria-invalid={Boolean(errors.message)}
          {...register("message", {
            required: "Please enter a message.",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters.",
            },
            maxLength: {
              value: 5000,
              message: "Message is too long (max 5000).",
            },
          })}
        />
        {errors.message ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {submitted ? (
        <p role="status" className="text-sm text-emerald-500">
          Your message has been received — thank you!
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full sm:w-auto"
      >
        {pending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Send data-icon="inline-start" />
        )}
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
