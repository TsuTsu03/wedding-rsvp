import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero/Hero";
import { Film } from "@/components/sections/Film";
import { Marquee } from "@/components/sections/Marquee";
import { Story } from "@/components/sections/Story";
import { Details } from "@/components/sections/Details";
import { Entourage } from "@/components/sections/Entourage";
import { Rsvp } from "@/components/sections/Rsvp";
import { Gallery } from "@/components/sections/Gallery";
import { DressCode } from "@/components/sections/DressCode";
import { Footer } from "@/components/sections/Footer";
import { wedding } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Film />
        <Marquee
          items={[
            `${wedding.couple.one} & ${wedding.couple.two}`,
            "14 . 11 . 2026",
            "Tagaytay",
            "You're invited",
          ]}
        />
        <Story />
        <Details />
        <Entourage />
        <Rsvp />
        <Gallery />
        <DressCode />
      </main>
      <Footer />
    </>
  );
}
