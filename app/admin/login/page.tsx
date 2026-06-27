"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

export default function AdminLogin() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Incorrect passcode.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-olive">
            <Lock size={18} strokeWidth={1.6} />
          </span>
          <h1 className="mt-5 font-display text-[1.7rem]">Wedding dashboard</h1>
          <p className="mt-2 text-[0.88rem] text-ink-soft">
            Enter the passcode to view RSVPs.
          </p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field
            label="Passcode"
            type="password"
            placeholder="****"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoFocus
          />
          {error && <p className="text-[0.85rem] text-clay">{error}</p>}
          <Button type="submit" size="lg" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            Enter
          </Button>
        </form>
        <p className="mt-6 text-center text-[0.76rem] text-ink-soft/70">
          Demo passcode: <span className="font-medium text-ink-soft">demo</span>
        </p>
      </div>
    </main>
  );
}
