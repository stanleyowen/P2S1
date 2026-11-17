// Public, non-personal content for each edition. Participant records are NOT here —
// they are served by the API in /server and never shipped in the site bundle.

export type Category = { name: string; items: string[] };

export type Edition = {
  year: number;
  slug: string;
  roman: string;
  ordinal: string;
  /** One-line hook under the title. */
  tagline: string;
  theme?: { word: string; meaning: string };
  period: string;
  finale?: string;
  hero: string;
  heroPosition?: string;
  logo: string;
  og: string;
  stats: { participants: number; competitions: number; entries: number; podium: number };
  summary: string;
  story: string[];
  categories: Category[];
};

export const SITE = {
  name: "Pekan Prestasi Sutomo 1",
  short: "P2S1",
  url: "https://p2s1.netlify.app",
  organiser: "OSIS SMA Sutomo 1 Medan",
  description:
    "Pekan Prestasi Sutomo 1 (P2S1) is the annual competition week of SMA Sutomo 1 Medan, organised by the student council (OSIS). Explore every edition, the photos and the results.",
  repo: "https://github.com/stanleyowen/P2S1",
};

export const EDITIONS: Edition[] = [
  {
    year: 2024,
    slug: "2024",
    roman: "XXVII",
    ordinal: "27th",
    tagline: "Fifty-one competitions, one idea: get better.",
    theme: { word: "Amelioration", meaning: "to improve, or to make something better" },
    period: "January – February 2024",
    hero: "2024/dance-solo",
    heroPosition: "50% 12%",
    logo: "logos/2024",
    og: "/og/og-2024.jpg",
    stats: { participants: 1319, competitions: 51, entries: 2563, podium: 339 },
    summary:
      "The 27th P2S1 ran from the first week of January to the last week of February 2024, with 51 competitions across academics, the arts, sports and content creation.",
    story: [
      "SMA Sutomo 1 had the great honour of celebrating the 27th P2S1 this year. Every edition carries its own theme, and this year we were proud to present Amelioration — to improve, or to make something better.",
      "The event kicked off in the first week of January 2024 and ended in the last week of February. Fifty-one competitions were held, ranging from academics and the arts to sports and content creation, supported by 1,319 participants.",
      "Thank you to every participant for making the 27th P2S1 a success. Congratulations to this year's winners — and to everyone who didn't make the top three: don't be discouraged. There are many fish in the sea and your future doesn't end here. Work hard and never give up!",
    ],
    categories: [
      {
        name: "Academic",
        items: ["Math Olympiad", "Physics Olympiad", "Chemistry Olympiad", "Biology Olympiad", "Economics & Accounting Olympiad", "Geography Olympiad", "English Olympiad", "Battle of Brains", "Competitive Programming", "Business Idea"],
      },
      {
        name: "Language & speaking",
        items: ["English Debate", "Indonesian Debate", "Mandarin Debate", "English Storytelling", "Mandarin Storytelling", "English Essay Writing", "Indonesian Essay Writing", "Mandarin Essay Writing", "Public Speaking", "Newscasting"],
      },
      {
        name: "Art & design",
        items: ["Sketch", "Object Sketch", "Watercolor", "Crayon", "Manga", "Graphic Design", "Interior Design", "Fashion Design", "Photography", "Cinematography"],
      },
      { name: "Performing arts", items: ["Vocal Solo", "Dance Solo", "Class Choir Battle", "Musical Instrument"] },
      {
        name: "Sports & games",
        items: ["Basketball", "Badminton", "Table Tennis", "Karate", "Tug of War", "Terompah", "Esports", "Chess", "Scrabble", "Rubik's Cube"],
      },
    ],
  },
  {
    year: 2023,
    slug: "2023",
    roman: "XXVI",
    ordinal: "26th",
    tagline: "Back on stage after two years online.",
    period: "January – March 2023",
    finale: "3 & 6 March 2023 · Auditorium Yayasan Perguruan Sutomo",
    hero: "2023/finale-stage",
    heroPosition: "50% 45%",
    logo: "logos/2023",
    og: "/og/og-2023.jpg",
    stats: { participants: 1609, competitions: 48, entries: 3197, podium: 359 },
    summary:
      "After two years of the pandemic, the 26th P2S1 brought the competitions back in person — 48 competitions, 1,609 participants and a two-day finale in March.",
    story: [
      "Our school has celebrated P2S1 for a long time, but the pandemic kept the event from being held in person for two years. This year, we finally could.",
      "The 26th P2S1 began in the first week of January 2023 and ended in the first week of March, closing with a two-day finale — Puncak P2S1 — on 3 and 6 March. Forty-eight competitions involved 1,609 participants, with 3,197 entries registered in total.",
      "We were able to hold such a great event thanks to every student who took part. Congratulations to all of the champions — keep up the great work! To everyone who didn't reach the top three: there is always room to grow. See you at the 27th P2S1.",
    ],
    categories: [
      {
        name: "Academic",
        items: ["Math Olympiad", "Physics Olympiad", "Chemistry Olympiad", "Biology Olympiad", "Economics Olympiad", "Geography Olympiad", "English Olympiad", "Battle of Brains", "Competitive Programming", "Business Idea"],
      },
      {
        name: "Language & speaking",
        items: ["English Debate", "Indonesian Debate", "Mandarin Debate", "English Storytelling", "Mandarin Storytelling", "English Essay Writing", "Indonesian Essay Writing", "Mandarin Essay Writing", "Public Speaking", "Newscasting"],
      },
      {
        name: "Art & design",
        items: ["Sketch", "Watercolor", "Crayon", "Manga", "Graphic Design", "Interior Design", "Fashion Design", "Certificate Design", "Photography"],
      },
      { name: "Performing arts", items: ["Vocal Solo", "Dance Solo", "Dance Group", "Class Choir Battle", "Musical Instrument"] },
      {
        name: "Sports & games",
        items: ["Basketball", "Badminton", "Table Tennis", "Karate", "Tug of War", "Terompah", "Esports", "Chess", "Scrabble", "Rubik's Cube"],
      },
    ],
  },
];

export const getEdition = (slug: string) => EDITIONS.find((e) => e.slug === slug);

export const TOTALS = EDITIONS.reduce(
  (t, e) => ({
    competitions: t.competitions + e.stats.competitions,
    entries: t.entries + e.stats.entries,
    podium: t.podium + e.stats.podium,
    participants: t.participants + e.stats.participants,
  }),
  { competitions: 0, entries: 0, podium: 0, participants: 0 },
);
