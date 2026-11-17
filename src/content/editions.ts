// Public, non-personal content for each edition. Participant records are NOT here —
// they are served by the API in /server and never shipped in the site bundle.
//
// Text is written in both site languages (see src/i18n). Competition names stay in their
// official English form: they match the names the results API returns.

import type { Localized } from "@/i18n/config";

export type Category = { name: Localized; items: string[] };

export type EditionCopy = {
  /** One-line hook under the title. */
  tagline: string;
  /** Meaning of the theme word (the word itself is not translated). */
  themeMeaning?: string;
  period: string;
  finale?: string;
  summary: string;
  story: string[];
};

export type Edition = {
  year: number;
  slug: string;
  /** Edition number, e.g. 27 for P2S1 XXVII. */
  number: number;
  roman: string;
  theme?: string;
  hero: string;
  heroPosition?: string;
  logo: string;
  og: string;
  stats: { participants: number; competitions: number; entries: number; podium: number };
  copy: Localized<EditionCopy>;
  categories: Category[];
};

export const SITE = {
  name: "Pekan Prestasi Sutomo 1",
  short: "P2S1",
  url: "https://p2s1.netlify.app",
  organiser: "OSIS SMA Sutomo 1 Medan",
  repo: "https://github.com/stanleyowen/P2S1",
};

const CATEGORY = {
  academic: { en: "Academic", id: "Akademik" },
  language: { en: "Language & speaking", id: "Bahasa & berbicara" },
  art: { en: "Art & design", id: "Seni & desain" },
  performing: { en: "Performing arts", id: "Seni pertunjukan" },
  sports: { en: "Sports & games", id: "Olahraga & permainan" },
} satisfies Record<string, Localized>;

export const EDITIONS: Edition[] = [
  {
    year: 2024,
    slug: "2024",
    number: 27,
    roman: "XXVII",
    theme: "Amelioration",
    hero: "2024/terompah",
    heroPosition: "60% 35%",
    logo: "logos/2024",
    og: "/og/og-2024.jpg",
    stats: { participants: 1319, competitions: 51, entries: 2563, podium: 339 },
    copy: {
      en: {
        tagline: "Fifty-one competitions, one idea: get better.",
        themeMeaning: "to improve, or to make something better",
        period: "January – February 2024",
        summary:
          "The 27th P2S1 ran from the first week of January to the last week of February 2024, with 51 competitions across academics, the arts, sports and content creation.",
        story: [
          "SMA Sutomo 1 had the great honour of celebrating the 27th P2S1 this year. Every edition carries its own theme, and this year we were proud to present Amelioration — to improve, or to make something better.",
          "The event kicked off in the first week of January 2024 and ended in the last week of February. Fifty-one competitions were held, ranging from academics and the arts to sports and content creation, supported by 1,319 participants.",
          "Thank you to every participant for making the 27th P2S1 a success. Congratulations to this year's winners — and to everyone who didn't make the top three: don't be discouraged. There are many fish in the sea and your future doesn't end here. Work hard and never give up!",
        ],
      },
      id: {
        tagline: "Lima puluh satu lomba, satu tujuan: menjadi lebih baik.",
        themeMeaning: "memperbaiki, atau menjadikan sesuatu lebih baik",
        period: "Januari – Februari 2024",
        summary:
          "P2S1 ke-27 berlangsung dari minggu pertama Januari hingga minggu terakhir Februari 2024, dengan 51 lomba di bidang akademik, seni, olahraga, dan pembuatan konten.",
        story: [
          "Tahun ini SMA Sutomo 1 mendapat kehormatan besar untuk merayakan P2S1 yang ke-27. Setiap edisi membawa temanya sendiri, dan tahun ini kami dengan bangga mempersembahkan Amelioration — memperbaiki, atau menjadikan sesuatu lebih baik.",
          "Acara dimulai pada minggu pertama Januari 2024 dan berakhir pada minggu terakhir Februari. Lima puluh satu lomba diselenggarakan, mulai dari bidang akademik dan seni hingga olahraga dan pembuatan konten, dengan dukungan 1.319 peserta.",
          "Terima kasih kepada seluruh peserta yang telah menyukseskan P2S1 ke-27. Selamat kepada para juara tahun ini — dan bagi kalian yang belum masuk tiga besar, jangan berkecil hati. Masih banyak kesempatan lain, dan masa depanmu tidak berhenti di sini. Terus berusaha dan jangan pernah menyerah!",
        ],
      },
    },
    categories: [
      {
        name: CATEGORY.academic,
        items: ["Math Olympiad", "Physics Olympiad", "Chemistry Olympiad", "Biology Olympiad", "Economics & Accounting Olympiad", "Geography Olympiad", "English Olympiad", "Battle of Brains", "Competitive Programming", "Business Idea"],
      },
      {
        name: CATEGORY.language,
        items: ["English Debate", "Indonesian Debate", "Mandarin Debate", "English Storytelling", "Mandarin Storytelling", "English Essay Writing", "Indonesian Essay Writing", "Mandarin Essay Writing", "Public Speaking", "Newscasting"],
      },
      {
        name: CATEGORY.art,
        items: ["Sketch", "Object Sketch", "Watercolor", "Crayon", "Manga", "Graphic Design", "Interior Design", "Fashion Design", "Photography", "Cinematography"],
      },
      { name: CATEGORY.performing, items: ["Vocal Solo", "Dance Solo", "Class Choir Battle", "Musical Instrument"] },
      {
        name: CATEGORY.sports,
        items: ["Basketball", "Badminton", "Table Tennis", "Karate", "Tug of War", "Terompah", "Esports", "Chess", "Scrabble", "Rubik's Cube"],
      },
    ],
  },
  {
    year: 2023,
    slug: "2023",
    number: 26,
    roman: "XXVI",
    hero: "2023/finale-stage",
    heroPosition: "50% 45%",
    logo: "logos/2023",
    og: "/og/og-2023.jpg",
    stats: { participants: 1609, competitions: 48, entries: 3197, podium: 359 },
    copy: {
      en: {
        tagline: "Back on stage after two years online.",
        period: "January – March 2023",
        finale: "3 & 6 March 2023 · Auditorium Yayasan Perguruan Sutomo",
        summary:
          "After two years of the pandemic, the 26th P2S1 brought the competitions back in person — 48 competitions, 1,609 participants and a two-day finale in March.",
        story: [
          "Our school has celebrated P2S1 for a long time, but the pandemic kept the event from being held in person for two years. This year, we finally could.",
          "The 26th P2S1 began in the first week of January 2023 and ended in the first week of March, closing with a two-day finale — Puncak P2S1 — on 3 and 6 March. Forty-eight competitions involved 1,609 participants, with 3,197 entries registered in total.",
          "We were able to hold such a great event thanks to every student who took part. Congratulations to all of the champions — keep up the great work! To everyone who didn't reach the top three: there is always room to grow. See you at the 27th P2S1.",
        ],
      },
      id: {
        tagline: "Kembali ke panggung setelah dua tahun daring.",
        period: "Januari – Maret 2023",
        finale: "3 & 6 Maret 2023 · Auditorium Yayasan Perguruan Sutomo",
        summary:
          "Setelah dua tahun pandemi, P2S1 ke-26 kembali menghadirkan lomba secara tatap muka — 48 lomba, 1.609 peserta, dan puncak acara selama dua hari pada bulan Maret.",
        story: [
          "Sekolah kami sudah lama merayakan P2S1, tetapi pandemi membuat acara ini tidak dapat digelar secara tatap muka selama dua tahun. Tahun ini, akhirnya kami bisa.",
          "P2S1 ke-26 dimulai pada minggu pertama Januari 2023 dan berakhir pada minggu pertama Maret, ditutup dengan puncak acara selama dua hari — Puncak P2S1 — pada 3 dan 6 Maret. Empat puluh delapan lomba diikuti oleh 1.609 peserta, dengan total 3.197 pendaftaran.",
          "Acara sebesar ini dapat terselenggara berkat setiap siswa yang ikut serta. Selamat kepada semua juara — pertahankan prestasi kalian! Bagi yang belum masuk tiga besar: selalu ada ruang untuk berkembang. Sampai jumpa di P2S1 ke-27.",
        ],
      },
    },
    categories: [
      {
        name: CATEGORY.academic,
        items: ["Math Olympiad", "Physics Olympiad", "Chemistry Olympiad", "Biology Olympiad", "Economics Olympiad", "Geography Olympiad", "English Olympiad", "Battle of Brains", "Competitive Programming", "Business Idea"],
      },
      {
        name: CATEGORY.language,
        items: ["English Debate", "Indonesian Debate", "Mandarin Debate", "English Storytelling", "Mandarin Storytelling", "English Essay Writing", "Indonesian Essay Writing", "Mandarin Essay Writing", "Public Speaking", "Newscasting"],
      },
      {
        name: CATEGORY.art,
        items: ["Sketch", "Watercolor", "Crayon", "Manga", "Graphic Design", "Interior Design", "Fashion Design", "Certificate Design", "Photography"],
      },
      { name: CATEGORY.performing, items: ["Vocal Solo", "Dance Solo", "Dance Group", "Class Choir Battle", "Musical Instrument"] },
      {
        name: CATEGORY.sports,
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
