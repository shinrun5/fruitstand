"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { RipeningFruit } from "@/components/RipeningFruit";
import { fruitForPhone } from "@/lib/fruit";
import { computeRipeness } from "@/lib/ripeness";
import { WaitlistEntry } from "@/lib/types";

function waitTime(createdAt: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  return minutes < 1 ? "just now" : `${minutes} min`;
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/waitlist");
    if (!res.ok) return;
    const body = await res.json();
    setEntries(body.entries);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load for polling data, not derived from props/state
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function updateEntry(id: string, action: "notify" | "seated" | "cancelled") {
    setBusyId(id);
    setError(null);

    const res = await fetch(`/api/waitlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      setBusyId(null);
      return;
    }

    setBusyId(null);
    refresh();
  }

  const waitingIds = entries.filter((e) => e.status === "waiting").map((e) => e.id);

  return (
    <main className="min-h-screen bg-cream px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-1 flex items-center gap-2.5">
          <span className="text-3xl">🍓</span>
          <h1 className="font-heading text-3xl font-extrabold text-ink">Fruitstand</h1>
        </div>
        <p className="mb-6 font-body text-sm font-bold text-muted-ink">Staff dashboard</p>

        {error && (
          <p className="mb-4 rounded-2xl border-2 border-coral bg-coral-bg px-4 py-2 font-body font-bold text-coral-dark">
            {error}
          </p>
        )}

        {entries.length === 0 ? (
          <p className="font-body text-muted-ink">No one is waiting right now.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => {
              const isNotified = entry.status === "notified";
              const waitingRank = waitingIds.indexOf(entry.id) + 1;
              const ripeness = isNotified ? 1 : computeRipeness(waitingRank, waitingIds.length);

              const isConfirmed = Boolean(entry.confirmed_at);

              return (
                <li
                  key={entry.id}
                  className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border-[2.5px] p-4 shadow-[3px_3px_0_var(--color-ink)] ${
                    isConfirmed ? "border-green-dark bg-green/10" : "border-ink bg-paper"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <RipeningFruit
                      kind={fruitForPhone(entry.phone)}
                      ripeness={ripeness}
                      size={44}
                      showStage={!isNotified}
                    />
                    <div>
                      <p className="font-heading text-lg font-bold text-ink">
                        {entry.name}{" "}
                        <span className="font-body text-base font-normal text-muted-ink">
                          · party of {entry.party_size}
                        </span>
                      </p>
                      <p className="font-body text-sm font-bold text-muted-ink">
                        {isNotified
                          ? entry.confirmed_at
                            ? "✅ Confirmed"
                            : "🍎 Texted, waiting to hear back"
                          : "Waiting"}{" "}
                        · {waitTime(entry.created_at)}
                      </p>
                      {entry.last_reply && (
                        <p className="font-body text-sm text-muted-ink italic">
                          “{entry.last_reply}”
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {entry.status === "waiting" && (
                      <Button
                        variant="alert"
                        onClick={() => updateEntry(entry.id, "notify")}
                        disabled={busyId === entry.id}
                        className="!px-4 !py-2 !text-sm"
                      >
                        Notify
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      onClick={() => updateEntry(entry.id, "seated")}
                      disabled={busyId === entry.id}
                      className="!px-4 !py-2 !text-sm"
                    >
                      Seated
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => updateEntry(entry.id, "cancelled")}
                      disabled={busyId === entry.id}
                      className="!px-4 !py-2 !text-sm"
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
