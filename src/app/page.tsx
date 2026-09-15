"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { RipeningFruit } from "@/components/RipeningFruit";
import { fruitForPhone } from "@/lib/fruit";

export default function KioskPage() {
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const previewFruit = useMemo(() => fruitForPhone(phone || name), [phone, name]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, party_size: partySize, phone }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong. Please try again.");
      setStatus("idle");
      return;
    }

    setStatus("success");
    setTimeout(() => {
      setName("");
      setPartySize(2);
      setPhone("");
      setStatus("idle");
    }, 4000);
  }

  if (status === "success") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream px-6 text-center">
        <RipeningFruit kind={fruitForPhone(phone || name)} ripeness={0} size={80} />
        <h1 className="font-heading text-4xl font-extrabold text-ink">You&apos;re on the list!</h1>
        <p className="max-w-md font-body text-xl text-muted-ink">
          We&apos;ll text you as soon as you&apos;re ripe. 🌱
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border-[3px] border-ink bg-paper p-8 shadow-[6px_6px_0_var(--color-ink)]">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <RipeningFruit kind={previewFruit} ripeness={0.15} size={56} />
          <h1 className="font-heading text-3xl font-extrabold text-ink">Fruitstand</h1>
          <p className="font-body text-sm text-muted-ink">
            Join the waitlist — you&apos;ll ripen as you move up the line.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="font-heading text-xs font-bold uppercase tracking-wide text-muted-ink"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border-2 border-ink px-4 py-4 font-body text-2xl outline-none focus:border-coral"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="party-size"
              className="font-heading text-xs font-bold uppercase tracking-wide text-muted-ink"
            >
              Party Size
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                className="h-16 w-16 rounded-full border-2 border-ink font-heading text-3xl font-bold text-ink active:bg-cream"
                aria-label="Decrease party size"
              >
                −
              </button>
              <span className="w-16 text-center font-heading text-3xl font-extrabold text-ink">
                {partySize}
              </span>
              <button
                type="button"
                onClick={() => setPartySize((n) => Math.min(20, n + 1))}
                className="h-16 w-16 rounded-full border-2 border-ink font-heading text-3xl font-bold text-ink active:bg-cream"
                aria-label="Increase party size"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="font-heading text-xs font-bold uppercase tracking-wide text-muted-ink"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-2xl border-2 border-ink px-4 py-4 font-body text-2xl outline-none focus:border-coral"
              placeholder="(555) 555-5555"
            />
          </div>

          {error && <p className="font-body text-lg font-bold text-coral-dark">{error}</p>}

          <Button
            type="submit"
            disabled={status === "submitting"}
            className="!mt-2 !w-full !justify-center !py-5 !text-xl"
          >
            {status === "submitting" ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </div>
    </main>
  );
}
