"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return submitted ? (
    <div className="surface-card rounded-[28px] p-8 sm:p-10">
      <p className="eyebrow">Message sent</p>
      <h2 className="mt-4 text-4xl text-dark sm:text-5xl">We will get back to you shortly.</h2>
      <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
        Thanks for reaching out to ALPACA. A member of our team will respond with sizing, order,
        or partnership support as soon as possible.
      </p>
    </div>
  ) : (
    <form
      className="surface-card grid gap-5 rounded-[28px] p-8 sm:p-10"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-dark">Name</span>
          <input
            required
            className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-dark">Email</span>
          <input
            type="email"
            required
            className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-dark">Subject</span>
        <input
          required
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
          placeholder="Order help, sizing, partnerships..."
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-dark">Message</span>
        <textarea
          required
          rows={6}
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm text-dark outline-none transition focus:border-dark"
          placeholder="Tell us what you need."
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full border border-dark bg-dark px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 sm:w-auto"
      >
        Send message
      </button>
    </form>
  );
}
