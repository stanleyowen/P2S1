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
  /** Headline numbers. Left out until an edition's official figures are known. */
  stats?: Stats;
  /** Whether the results API has this year's data (participant search + champions board). */
  results: boolean;
  /** Results cover only the publicly announced winners, not every participant (shows a disclaimer). */
  winnersOnly?: boolean;
  /** Podium is official but the other entries were rebuilt and may miss a few (shows a note). */
  partialEntries?: boolean;
  copy: Localized<EditionCopy>;
  /** The official competition list; empty hides the section. */
  categories: Category[];
};

export type Stats = { participants: number; competitions: number; entries: number; podium: number };

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
    year: 2026,
    slug: "2026",
    number: 29,
    roman: "XXIX",
    hero: "2026/opening-dance",
    heroPosition: "50% 45%",
    logo: "logos/2026",
    og: "/og/og-2026.jpg",
    // From OSIS's Instagram winner captions (posted August 2026); no participant list yet.
    results: true,
    winnersOnly: true,
    copy: {
      en: {
        tagline: "Six weeks of competitions, from a pop-art opening to a Saturday finale.",
        period: "February – March 2026",
        finale: "14 March 2026 · Auditorium Yayasan Perguruan Sutomo",
        summary:
          "The 29th P2S1 opened on 7 February 2026 in the school courtyard, ran six weeks of competitions and closed with Puncak P2S1 on Saturday 14 March 2026.",
        story: [
          "The 29th Pekan Prestasi Sutomo 1 opened on 7 February 2026 in the school courtyard, in front of a pop-art backdrop of trophies, vinyl records, paint palettes and film reels, with speeches, a dance crew, a martial-arts display and live music.",
          "Over the next six weeks students sat olympiads split by grade, debated in three languages, wrote, drew and designed, and played on the court, at the table and in the courtyard. New to the line-up were MonsoonSim, a business simulation, and a scientific paper competition (karya tulis ilmiah), and public speaking was held in both English and Mandarin.",
          "It all ended at Puncak P2S1 on Saturday 14 March 2026 in the Auditorium Yayasan Perguruan Sutomo: class choirs, dance, bands and solo performances, medals for every podium, and XII MIA-02 crowned overall champion (juara umum).",
        ],
      },
      id: {
        tagline: "Enam minggu perlombaan, dari pembukaan bergaya pop art hingga puncak di hari Sabtu.",
        period: "Februari – Maret 2026",
        finale: "14 Maret 2026 · Auditorium Yayasan Perguruan Sutomo",
        summary:
          "P2S1 ke-29 dibuka pada 7 Februari 2026 di halaman sekolah, menghadirkan enam minggu perlombaan, dan ditutup dengan Puncak P2S1 pada Sabtu, 14 Maret 2026.",
        story: [
          "Pekan Prestasi Sutomo 1 ke-29 dibuka pada 7 Februari 2026 di halaman sekolah, di depan latar bergaya pop art penuh trofi, piringan hitam, palet cat, dan gulungan film, dengan sambutan, penampilan tari, peragaan bela diri, dan musik langsung.",
          "Selama enam minggu berikutnya, siswa mengerjakan olimpiade per jenjang kelas, berdebat dalam tiga bahasa, menulis, menggambar, dan mendesain, serta bertanding di lapangan, di meja, dan di halaman sekolah. Lomba baru tahun ini adalah MonsoonSim, sebuah simulasi bisnis, dan karya tulis ilmiah, sementara public speaking digelar dalam bahasa Inggris dan Mandarin.",
          "Semuanya berakhir di Puncak P2S1 pada Sabtu, 14 Maret 2026 di Auditorium Yayasan Perguruan Sutomo: paduan suara kelas, tari, band, dan penampilan solo, medali untuk setiap podium, serta XII MIA-02 yang dinobatkan sebagai juara umum.",
        ],
      },
    },
    // Every competition in the 2026 winners' captions (olympiads were also split by grade).
    categories: [
      {
        name: CATEGORY.academic,
        items: ["Math Olympiad", "Physics Olympiad", "Chemistry Olympiad", "Biology Olympiad", "Economics Olympiad", "Geography Olympiad", "English Olympiad", "Battle of Brains", "Competitive Programming", "Business Idea", "MonsoonSim", "Scientific Paper", "Spelling Bee"],
      },
      {
        name: CATEGORY.language,
        items: ["English Debate", "Indonesian Debate", "Mandarin Debate", "English Storytelling", "Mandarin Poetry", "English Public Speaking", "Mandarin Public Speaking", "Indonesian Writing", "English Writing", "Mandarin Writing", "English Newscasting", "Indonesian Newscasting"],
      },
      {
        name: CATEGORY.art,
        items: ["Object Sketch", "Crayon", "Manga", "Graphic Design", "Interior Design", "Fashion Design", "Photography", "Cinematography"],
      },
      { name: CATEGORY.performing, items: ["Vocal Solo", "Dance Solo", "Class Choir Battle", "Musical Instrument", "Band"] },
      {
        name: CATEGORY.sports,
        items: ["Basketball", "Badminton", "Table Tennis", "Karate", "Tug of War", "Terompah", "Esports", "Chess", "Scrabble", "Rubik's Cube"],
      },
    ],
  },
  {
    year: 2025,
    slug: "2025",
    number: 28,
    roman: "XXVIII",
    hero: "2025/finale-colour",
    heroPosition: "50% 30%",
    logo: "logos/2025",
    og: "/og/og-2025.jpg",
    // Participants from the registration forms; podium from the official OSIS winners' recap.
    // `competitions` counts the recap's 63 podium events (olympiads split by grade).
    stats: { participants: 1255, competitions: 63, entries: 2682, podium: 297 },
    results: true,
    partialEntries: true,
    copy: {
      en: {
        tagline: "Seven weeks of competitions, crowned on the auditorium stage.",
        period: "Seven weeks of competitions · March 2025",
        finale: "10 & 11 March 2025 · Auditorium Yayasan Perguruan Sutomo",
        summary:
          "The 28th P2S1 ran seven weeks of competitions across academics, language, the arts and sport, and closed with a two-day Puncak P2S1 on 10 and 11 March 2025.",
        story: [
          "The 28th Pekan Prestasi Sutomo 1 took its look from Greek myth: marble columns on the stage, a laurel-wreathed logo, and weekly recaps that travelled from the depths of the underworld, through the sea and the mountains, up to Olympus.",
          "Over seven weeks, students sat olympiads, debated, told stories, coded, sketched and painted, and competed on the court, at the table and in the courtyard, from basketball and badminton to chess, Scrabble and tug of war.",
          "It all came together at Puncak P2S1 on 10 and 11 March 2025 in the Auditorium Yayasan Perguruan Sutomo: two evenings of class choirs, dance, bands and solo performances, medals and trophies for the winners, and the overall champions (juara umum) crowned on stage.",
        ],
      },
      id: {
        tagline: "Tujuh minggu perlombaan, dimahkotai di panggung auditorium.",
        period: "Tujuh minggu perlombaan · Maret 2025",
        finale: "10 & 11 Maret 2025 · Auditorium Yayasan Perguruan Sutomo",
        summary:
          "P2S1 ke-28 menghadirkan tujuh minggu perlombaan di bidang akademik, bahasa, seni, dan olahraga, lalu ditutup dengan Puncak P2S1 selama dua hari pada 10 dan 11 Maret 2025.",
        story: [
          "Pekan Prestasi Sutomo 1 ke-28 mengambil inspirasi dari mitologi Yunani: pilar marmer di panggung, logo berhias karangan daun salam, serta rangkuman mingguan yang berkelana dari dasar dunia bawah, melintasi laut dan pegunungan, hingga ke Olympus.",
          "Selama tujuh minggu, siswa mengerjakan olimpiade, berdebat, bercerita, menulis kode, membuat sketsa dan melukis, serta bertanding di lapangan, di meja, dan di halaman sekolah — mulai dari basket dan bulu tangkis hingga catur, Scrabble, dan tarik tambang.",
          "Semuanya berpuncak pada Puncak P2S1 tanggal 10 dan 11 Maret 2025 di Auditorium Yayasan Perguruan Sutomo: dua malam penuh paduan suara kelas, tari, band, dan penampilan solo, medali dan trofi untuk para pemenang, serta penobatan juara umum di atas panggung.",
        ],
      },
    },
    // Every competition in the official 2025 winners' recap (olympiads were also split by grade).
    categories: [
      {
        name: CATEGORY.academic,
        items: ["Math Olympiad", "Physics Olympiad", "Chemistry Olympiad", "Biology Olympiad", "Economics Olympiad", "Geography Olympiad", "English Olympiad", "Battle of Brains", "Competitive Programming", "Web Design", "Business Idea", "Spelling Bee"],
      },
      {
        name: CATEGORY.language,
        items: ["English Debate", "Indonesian Debate", "Mandarin Debate", "English Storytelling", "Mandarin Poetry", "Indonesian Writing", "English Writing", "Mandarin Writing", "Public Speaking", "English Newscasting", "Indonesian Newscasting"],
      },
      {
        name: CATEGORY.art,
        items: ["Object Sketch", "Crayon", "Watercolor", "Manga", "Graphic Design", "Interior Design", "Fashion Design", "Photography", "Cinematography"],
      },
      { name: CATEGORY.performing, items: ["Vocal Solo", "Dance Solo", "Class Choir Battle", "Musical Instrument", "Band"] },
      {
        name: CATEGORY.sports,
        items: ["Basketball", "Badminton", "Table Tennis", "Karate", "Tug of War", "Terompah", "Esports", "Chess", "Scrabble", "Rubik's Cube"],
      },
    ],
  },
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
    results: true,
    copy: {
      en: {
        tagline: "Fifty-one competitions, one idea: get better.",
        themeMeaning: "to improve, or to make something better",
        period: "January – March 2024",
        finale: "6 & 7 March 2024 · Auditorium Yayasan Perguruan Sutomo",
        summary:
          "The 27th P2S1 ran from the first week of January to the last week of February 2024, with 51 competitions across academics, the arts, sports and content creation, and a two-day finale on 6 and 7 March.",
        story: [
          "SMA Sutomo 1 had the great honour of celebrating the 27th P2S1 this year. Every edition carries its own theme, and this year we were proud to present Amelioration — to improve, or to make something better.",
          "The event kicked off in the first week of January 2024 and the competitions ran until the last week of February. Fifty-one competitions were held, ranging from academics and the arts to sports and content creation, supported by 1,319 participants. Puncak P2S1, the two-day finale, followed on 6 and 7 March in the Auditorium Yayasan Perguruan Sutomo.",
          "Thank you to every participant for making the 27th P2S1 a success. Congratulations to this year's winners — and to everyone who didn't make the top three: don't be discouraged. There are many fish in the sea and your future doesn't end here. Work hard and never give up!",
        ],
      },
      id: {
        tagline: "Lima puluh satu lomba, satu tujuan: menjadi lebih baik.",
        themeMeaning: "memperbaiki, atau menjadikan sesuatu lebih baik",
        period: "Januari – Maret 2024",
        finale: "6 & 7 Maret 2024 · Auditorium Yayasan Perguruan Sutomo",
        summary:
          "P2S1 ke-27 berlangsung dari minggu pertama Januari hingga minggu terakhir Februari 2024, dengan 51 lomba di bidang akademik, seni, olahraga, dan pembuatan konten, serta puncak acara selama dua hari pada 6 dan 7 Maret.",
        story: [
          "Tahun ini SMA Sutomo 1 mendapat kehormatan besar untuk merayakan P2S1 yang ke-27. Setiap edisi membawa temanya sendiri, dan tahun ini kami dengan bangga mempersembahkan Amelioration — memperbaiki, atau menjadikan sesuatu lebih baik.",
          "Acara dimulai pada minggu pertama Januari 2024 dan perlombaan berlangsung hingga minggu terakhir Februari. Lima puluh satu lomba diselenggarakan, mulai dari bidang akademik dan seni hingga olahraga dan pembuatan konten, dengan dukungan 1.319 peserta. Puncak P2S1, puncak acara selama dua hari, menyusul pada 6 dan 7 Maret di Auditorium Yayasan Perguruan Sutomo.",
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
    results: true,
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

/** Editions whose official figures are known — the only ones the totals add up. */
export const COUNTED = EDITIONS.filter((e): e is Edition & { stats: Stats } => !!e.stats);

export const TOTALS = COUNTED.reduce(
  (t, e) => ({
    competitions: t.competitions + e.stats.competitions,
    entries: t.entries + e.stats.entries,
    podium: t.podium + e.stats.podium,
    participants: t.participants + e.stats.participants,
  }),
  { competitions: 0, entries: 0, podium: 0, participants: 0 },
);

/** The newest edition, and the newest one with searchable results. */
export const LATEST = EDITIONS[0]!;
export const LATEST_WITH_RESULTS = EDITIONS.find((e) => e.results)!;
