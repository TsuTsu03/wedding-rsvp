import { wedding } from "@/lib/content";

type ConfirmInput = {
  to: string | null;
  name: string;
  status: string;
  meal?: string | null;
  table?: string | null;
  seats?: string[];
};

/**
 * Sends an RSVP confirmation via Resend when configured. In the zero-config demo
 * (no RESEND_API_KEY), it logs a clean preview to the server console instead of
 * failing - the flow stays unbroken.
 */
export async function sendConfirmation(input: ConfirmInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Amelia & Mateo <onboarding@resend.dev>";
  const subject =
    input.status === "YES"
      ? `We saved your seat - ${wedding.couple.one} & ${wedding.couple.two}`
      : `Thank you for letting us know - ${wedding.couple.one} & ${wedding.couple.two}`;

  const text = buildText(input);

  if (!key || !input.to) {
    console.info(
      "\n---------- RSVP confirmation (demo / no email sent) ----------\n" +
        `To: ${input.to ?? "-"}\nSubject: ${subject}\n\n${text}\n` +
        "--------------------------------------------------------------\n"
    );
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    await resend.emails.send({
      from,
      to: input.to,
      subject,
      text,
      html: buildHtml(input, subject),
    });
  } catch (e) {
    // Never let an email hiccup break the guest's confirmation.
    console.error("Resend send failed:", e);
  }
}

function buildText(i: ConfirmInput): string {
  const lines = [`Dear ${i.name},`, ""];
  if (i.status === "YES") {
    lines.push("Thank you - we're so glad you'll be joining us.");
    if (i.meal) lines.push(`Meal preference: ${i.meal}`);
    if (i.table && i.seats?.length)
      lines.push(`Your seats: ${i.table} / ${i.seats.join(", ")}`);
  } else {
    lines.push("Thank you for letting us know. You'll be missed.");
  }
  lines.push("", `${wedding.dateLabel}`, `${wedding.location}`, "", "With love,",
    `${wedding.couple.one} & ${wedding.couple.two}`);
  return lines.join("\n");
}

function buildHtml(i: ConfirmInput, subject: string): string {
  const detail =
    i.status === "YES"
      ? `<p style="margin:0 0 8px">We're so glad you'll be joining us.</p>
         ${i.meal ? `<p style="margin:0 0 4px;color:#6b6358"><strong>Meal:</strong> ${i.meal}</p>` : ""}
         ${i.table && i.seats?.length ? `<p style="margin:0;color:#6b6358"><strong>Seats:</strong> ${i.table} / ${i.seats.join(", ")}</p>` : ""}`
      : `<p style="margin:0">Thank you for letting us know - you'll be missed.</p>`;
  return `
  <div style="background:#f4f1ea;padding:40px 0;font-family:Georgia,serif;color:#1f1b17">
    <div style="max-width:480px;margin:0 auto;background:#fbfaf6;border:1px solid #e4dfd3;border-radius:14px;padding:36px">
      <p style="letter-spacing:.22em;text-transform:uppercase;font-size:11px;color:#6b6358;margin:0 0 18px;font-family:Arial,sans-serif">${subject}</p>
      <h1 style="font-size:28px;font-weight:400;margin:0 0 18px">Dear ${i.name},</h1>
      ${detail}
      <hr style="border:none;border-top:1px solid #e4dfd3;margin:24px 0" />
      <p style="margin:0;color:#6b6358">${wedding.dateLabel}<br/>${wedding.location}</p>
      <p style="margin:18px 0 0;font-style:italic;color:#3d4a3a">With love, ${wedding.couple.one} &amp; ${wedding.couple.two}</p>
    </div>
  </div>`;
}
