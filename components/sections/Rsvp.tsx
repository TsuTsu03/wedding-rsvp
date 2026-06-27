"use client";

import { Reveal } from "@/components/ui/Reveal";
import { EditorialHeader } from "@/components/ui/EditorialHeader";
import { RsvpFlow } from "./rsvp/RsvpFlow";

export function Rsvp() {
  return (
    <section id="rsvp" className="bg-surface py-[var(--space-section)]">
      <div className="shell">
        <EditorialHeader
          index="IV"
          kicker="Kindly Reply"
          title="Will you be there?"
          lede="Please respond by the first of October. Find your invitation, choose a meal, and pick your seats in a minute."
        />
        <Reveal className="mx-auto mt-14 max-w-3xl" delay={0.05}>
          <RsvpFlow />
        </Reveal>
      </div>
    </section>
  );
}
