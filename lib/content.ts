// Single source of truth for the wedding's editorial content.
// Swap these placeholders for the real couple's details at handoff.

export const wedding = {
  couple: {
    one: "Amelia",
    two: "Mateo",
    monogram: "A & M",
  },
  // Keep this in the future so the countdown reads live. Local time.
  date: "2026-11-14T16:00:00",
  dateLabel: "Saturday, the fourteenth of November",
  yearLabel: "Two thousand twenty-six",
  location: "Tagaytay, Philippines",
  invitation:
    "With the blessing of our families, we invite you to share in the joy of our wedding day.",
  hashtag: "#AlwaysAmeliaAndMateo",
} as const;

export type Milestone = {
  year: string;
  title: string;
  body: string;
  side: "left" | "right";
};

export const story: Milestone[] = [
  {
    year: "2017",
    title: "A borrowed umbrella",
    body: "We met under one umbrella outside a bookshop in the rain. Neither of us bought a book that day.",
    side: "left",
  },
  {
    year: "2019",
    title: "The long way home",
    body: "Two cities, a hundred train rides, and a standing Sunday phone call we never once missed.",
    side: "right",
  },
  {
    year: "2022",
    title: "A door of our own",
    body: "We painted the walls a colour we couldn't name and called it home anyway.",
    side: "left",
  },
  {
    year: "2025",
    title: "On a quiet hillside",
    body: "No grand gesture, just a question, a yes, and the sun going down behind the ridge.",
    side: "right",
  },
];

export type DetailCard = {
  key: string;
  kicker: string;
  title: string;
  time: string;
  venue: string;
  address: string;
  note?: string;
  icon: "ceremony" | "reception" | "afterparty";
};

export const details: DetailCard[] = [
  {
    key: "ceremony",
    kicker: "Half past four",
    title: "The Ceremony",
    time: "4:30 PM",
    venue: "Chapel on the Ridge",
    address: "Aguinaldo Highway, Tagaytay",
    note: "Doors open at four. The processional begins promptly.",
    icon: "ceremony",
  },
  {
    key: "reception",
    kicker: "As the sun sets",
    title: "The Reception",
    time: "6:00 PM",
    venue: "The Glasshouse",
    address: "Twin Lakes, Laurel, Batangas",
    note: "Dinner, dancing, and a few words from the people who know us best.",
    icon: "reception",
  },
  {
    key: "afterparty",
    kicker: "Until late",
    title: "The After-Party",
    time: "10:00 PM",
    venue: "The Cellar",
    address: "Downstairs at The Glasshouse",
    note: "For those who'd rather not call it a night just yet.",
    icon: "afterparty",
  },
];

export type Entourage = { role: string; names: string[] };

export const entourage: { group: string; people: Entourage[] }[] = [
  {
    group: "The Principal Sponsors",
    people: [
      { role: "Parents of the Bride", names: ["Teresa & Andres Vargas"] },
      { role: "Parents of the Groom", names: ["Carmen & Rafael Lim"] },
    ],
  },
  {
    group: "The Wedding Party",
    people: [
      { role: "Maid of Honour", names: ["Beatriz Vargas"] },
      { role: "Best Man", names: ["Joaquin Lim"] },
      {
        role: "Bridesmaids",
        names: ["Sofia Castillo", "Mia Aquino", "Chloe Pascual", "Amara Delos Reyes"],
      },
      {
        role: "Groomsmen",
        names: ["Lucas Reyes", "Ethan Navarro", "Daniel Ramos", "Liam Bautista"],
      },
    ],
  },
  {
    group: "The Little Ones",
    people: [
      { role: "Flower Girls", names: ["Lucia Reyes", "Elena Cruz"] },
      { role: "Ring Bearer", names: ["Tomas Navarro"] },
    ],
  },
];

export const meals = [
  { value: "Beef", label: "Braised Beef Short Rib", note: "Red wine jus, root vegetables" },
  { value: "Fish", label: "Pan-Seared Sea Bass", note: "Lemon butter, charred greens" },
  { value: "Chicken", label: "Herb Roast Chicken", note: "Confit garlic, seasonal salad" },
  { value: "Vegetarian", label: "Wild Mushroom Risotto", note: "Aged parmesan, truffle oil" },
];

// Editorial gallery placeholder frames that imply real photography.
// Each frame carries a tone so the masonry reads as a curated set, not stock.
export type Frame = { id: string; tall: boolean; tone: string; caption: string };

export const gallery: Frame[] = [
  { id: "g1", tall: true, tone: "#cdc6b6", caption: "The morning of" },
  { id: "g2", tall: false, tone: "#dcd5c2", caption: "First look" },
  { id: "g3", tall: false, tone: "#c4c0b0", caption: "Vows" },
  { id: "g4", tall: true, tone: "#d6d0bf", caption: "Golden hour" },
  { id: "g5", tall: false, tone: "#cac4b2", caption: "The toast" },
  { id: "g6", tall: true, tone: "#d2ccba", caption: "First dance" },
  { id: "g7", tall: false, tone: "#c8c2af", caption: "Under the lights" },
  { id: "g8", tall: false, tone: "#d8d2c0", caption: "Sparklers" },
];

export const dressCode = {
  title: "Garden Formal",
  note: "We'd love for you to lean into the palette below: soft, earthy, unhurried. Black tie optional for those who enjoy it.",
  swatches: [
    { name: "Sage", hex: "#9aa890" },
    { name: "Olive", hex: "#5c6b53" },
    { name: "Clay", hex: "#b4694e" },
    { name: "Sand", hex: "#d8cdb8" },
    { name: "Ink", hex: "#2c2a26" },
  ],
  registry:
    "Your presence is the gift. Should you wish to give more, a note toward our first home would mean the world.",
};

export const faqs = [
  {
    q: "May I bring a plus-one?",
    a: "Your invitation reflects the seats reserved for you. If a plus-one is included, you'll be able to add them when you RSVP.",
  },
  {
    q: "Are children welcome?",
    a: "We adore your little ones, but this will be a mostly adults-only evening, save for those in the entourage. We hope it gives you a night off.",
  },
  {
    q: "What time should I arrive?",
    a: "Please aim to be seated by 4:15 PM. The ceremony begins promptly at half past four.",
  },
  {
    q: "Is there parking?",
    a: "Yes, valet is available at both the chapel and the reception. Shuttles run between the two from 5:30 PM.",
  },
  {
    q: "What's the weather like?",
    a: "Tagaytay evenings are cool and breezy. A light wrap or jacket is a kind idea for the open-air portions.",
  },
];

// Anchor links for the nav.
export const navLinks = [
  { href: "#story", label: "Our Story" },
  { href: "#details", label: "Details" },
  { href: "#entourage", label: "Entourage" },
  { href: "#gallery", label: "Gallery" },
];
