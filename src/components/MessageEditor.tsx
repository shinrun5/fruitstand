"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

export function MessageEditor() {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState("");
  const [saved, setSaved] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((body) => setTemplate(body.notify_message_template));
  }, [open]);

  async function save() {
    setStatus("saving");
    setError(null);

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notify_message_template: template }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      setStatus("idle");
      return;
    }

    setStatus("saved");
    setSaved(true);
    setTimeout(() => setStatus("idle"), 2000);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-6 font-body text-sm font-bold text-sky-dark underline"
      >
        ✏️ Edit notification message
      </button>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border-2 border-ink bg-paper p-5">
      <p className="mb-2 font-heading text-sm font-bold text-ink">Notification message</p>
      <p className="mb-3 font-body text-xs font-bold text-muted-ink">
        Use <code>{"{name}"}</code> and <code>{"{party_size}"}</code> — they&apos;ll be filled in
        automatically when the text is sent.
      </p>
      <textarea
        value={template}
        onChange={(e) => {
          setTemplate(e.target.value);
          setSaved(false);
        }}
        rows={3}
        maxLength={500}
        className="mb-3 w-full rounded-xl border-2 border-ink px-3 py-2 font-body text-base outline-none focus:border-coral"
      />
      {error && <p className="mb-3 font-body text-sm font-bold text-coral-dark">{error}</p>}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          onClick={save}
          disabled={status === "saving" || saved}
          className="!px-4 !py-2 !text-sm"
        >
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Save"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setOpen(false)}
          className="!px-4 !py-2 !text-sm"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
