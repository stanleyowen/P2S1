// Gallery curation. Keys map to files in content/photos/<key>.jpg.
// `wide` / `tall` give a photo more room in the grid. Captions and alt text are written in
// every site language (see src/i18n).

import type { Localized } from "@/i18n/config";

export type PhotoEntry = { key: string; caption: Localized; alt: Localized; wide?: boolean; tall?: boolean };
export type GallerySection = { id: string; title: Localized; intro?: Localized; photos: PhotoEntry[] };

export const GALLERIES: Record<number, GallerySection[]> = {
  2023: [
    {
      id: "finale",
      title: { en: "Puncak P2S1 — the finale", id: "Puncak P2S1 — malam puncak" },
      intro: {
        en: "Two evenings in the school auditorium on 3 and 6 March 2023: performances, medals and trophies.",
        id: "Dua malam di auditorium sekolah pada 3 dan 6 Maret 2023: penampilan, medali, dan trofi.",
      },
      photos: [
        {
          key: "2023/celebration",
          caption: { en: "Trophy celebration", id: "Perayaan trofi" },
          alt: { en: "Students in traditional costume cheer as a teacher lifts a tall trophy on stage", id: "Siswa berpakaian adat bersorak saat seorang guru mengangkat trofi tinggi di panggung" },
          wide: true,
        },
        {
          key: "2023/guzheng",
          caption: { en: "Guzheng performance", id: "Penampilan guzheng" },
          alt: { en: "A student plays a red guzheng under warm stage lights", id: "Seorang siswa memainkan guzheng merah di bawah lampu panggung yang hangat" },
        },
        {
          key: "2023/vocal-solo-portrait",
          caption: { en: "Vocal solo", id: "Solo vokal" },
          alt: { en: "A student in a pale blue gown sings on stage with her arm outstretched", id: "Seorang siswi bergaun biru muda bernyanyi di panggung sambil merentangkan tangannya" },
          tall: true,
        },
        {
          key: "2023/mcs",
          caption: { en: "Opening the finale", id: "Membuka malam puncak" },
          alt: { en: "Two masters of ceremony speaking into microphones in front of the P2S1 XXVI banner", id: "Dua pembawa acara berbicara di depan spanduk P2S1 XXVI" },
        },
        {
          key: "2023/choir-trophy",
          caption: { en: "A trophy for the class choir", id: "Trofi untuk paduan suara kelas" },
          alt: { en: "A class choir in matching costumes receives a trophy from a teacher", id: "Paduan suara kelas berkostum seragam menerima trofi dari seorang guru" },
        },
        {
          key: "2023/finale-dance-group",
          caption: { en: "Dance group", id: "Tari kelompok" },
          alt: { en: "A dance group performs in front of the finale backdrop", id: "Sekelompok penari tampil di depan latar panggung malam puncak" },
        },
        {
          key: "2023/guitar",
          caption: { en: "Musical instrument", id: "Alat musik" },
          alt: { en: "A student plays electric guitar on stage", id: "Seorang siswa memainkan gitar listrik di panggung" },
        },
        {
          key: "2023/costume-performance",
          caption: { en: "In costume", id: "Berkostum" },
          alt: { en: "A performer in a red hooded cape sings into a microphone", id: "Seorang penampil berjubah merah bertudung bernyanyi ke mikrofon" },
          tall: true,
        },
        {
          key: "2023/dance-performance",
          caption: { en: "Stage performance", id: "Penampilan panggung" },
          alt: { en: "Performers in red costumes join hands during a stage routine", id: "Para penampil berkostum merah bergandengan tangan saat tampil di panggung" },
        },
        {
          key: "2023/class-choir",
          caption: { en: "Class choir", id: "Paduan suara kelas" },
          alt: { en: "A class choir in cream tops and woven skirts sings together", id: "Paduan suara kelas berbaju krem dan rok tenun bernyanyi bersama" },
        },
        {
          key: "2023/medals",
          caption: { en: "Medals, ready", id: "Medali sudah siap" },
          alt: { en: "Close-up of P2S1 medals with red and white ribbons laid out on a table", id: "Medali P2S1 berpita merah putih tertata di atas meja" },
          wide: true,
        },
        {
          key: "2023/trophies",
          caption: { en: "Trophies for the champions", id: "Trofi untuk para juara" },
          alt: { en: "Rows of tall gold trophies labelled Juara 1", id: "Deretan trofi emas tinggi bertuliskan Juara 1" },
        },
        {
          key: "2023/medal-ceremony",
          caption: { en: "Medal ceremony", id: "Pengalungan medali" },
          alt: { en: "A teacher places a medal around a student's neck", id: "Seorang guru mengalungkan medali kepada seorang siswa" },
        },
        {
          key: "2023/champions-on-stage",
          caption: { en: "Champions on stage", id: "Para juara di panggung" },
          alt: { en: "A row of medal winners stands on stage in front of the P2S1 banner", id: "Barisan peraih medali berdiri di panggung di depan spanduk P2S1" },
        },
        {
          key: "2023/champions-with-teacher",
          caption: { en: "Winners with their teacher", id: "Para juara bersama guru" },
          alt: { en: "Medal winners pose with a teacher on stage", id: "Para peraih medali berfoto bersama seorang guru di panggung" },
        },
        {
          key: "2023/finale-audience",
          caption: { en: "A full house", id: "Auditorium penuh" },
          alt: { en: "The auditorium filled with students in front of the finale screen", id: "Auditorium dipenuhi siswa di depan layar malam puncak" },
          wide: true,
        },
      ],
    },
    {
      id: "competitions",
      title: { en: "The competitions", id: "Perlombaan" },
      intro: {
        en: "Eight weeks of matches, olympiads, debates and studio time.",
        id: "Delapan minggu pertandingan, olimpiade, debat, dan berkarya.",
      },
      photos: [
        {
          key: "2023/basketball",
          caption: { en: "Basketball", id: "Bola basket" },
          alt: { en: "A player drives toward the basket during a game", id: "Seorang pemain menggiring bola menuju ring saat pertandingan" },
          tall: true,
        },
        {
          key: "2023/esports-closeup",
          caption: { en: "Esports", id: "Esports" },
          alt: { en: "Close-up of hands holding a phone mid-match in a mobile game", id: "Tangan memegang ponsel di tengah pertandingan gim seluler" },
        },
        {
          key: "2023/battle-of-brains",
          caption: { en: "Battle of Brains", id: "Battle of Brains" },
          alt: { en: "Quiz contestants raise their hands to answer", id: "Peserta kuis mengangkat tangan untuk menjawab" },
        },
        {
          key: "2023/watercolor",
          caption: { en: "Watercolor", id: "Cat air" },
          alt: { en: "Students paint with watercolors at their desks", id: "Siswa melukis dengan cat air di meja mereka" },
        },
        {
          key: "2023/class-choir-battle",
          caption: { en: "Class Choir Battle", id: "Class Choir Battle" },
          alt: { en: "A class choir in headbands and traditional dress performs", id: "Paduan suara kelas berikat kepala dan berpakaian adat tampil" },
        },
        {
          key: "2023/badminton",
          caption: { en: "Badminton", id: "Bulu tangkis" },
          alt: { en: "A badminton player leaps for a smash", id: "Seorang pemain bulu tangkis melompat untuk melakukan smes" },
          wide: true,
        },
        {
          key: "2023/scrabble",
          caption: { en: "Scrabble", id: "Scrabble" },
          alt: { en: "Hands placing tiles on a Scrabble board", id: "Tangan menyusun kepingan huruf di papan Scrabble" },
        },
        {
          key: "2023/table-tennis",
          caption: { en: "Table tennis", id: "Tenis meja" },
          alt: { en: "A player serves in a table tennis match", id: "Seorang pemain melakukan servis dalam pertandingan tenis meja" },
        },
        {
          key: "2023/tug-of-war",
          caption: { en: "Tug of war", id: "Tarik tambang" },
          alt: { en: "Students strain on a rope in a tug-of-war match outdoors", id: "Siswa menarik tambang sekuat tenaga dalam lomba tarik tambang di luar ruangan" },
        },
        {
          key: "2023/public-speaking",
          caption: { en: "Public speaking", id: "Public speaking" },
          alt: { en: "A student speaks with expressive gestures in front of a classroom", id: "Seorang siswa berbicara dengan gerakan ekspresif di depan kelas" },
        },
        {
          key: "2023/newscasting",
          caption: { en: "Newscasting", id: "Membaca berita" },
          alt: { en: "A student in a suit reads the news in front of a projected backdrop", id: "Seorang siswa berjas membacakan berita di depan latar yang diproyeksikan" },
        },
        {
          key: "2023/debate",
          caption: { en: "Debate", id: "Debat" },
          alt: { en: "A debater speaks from the podium", id: "Seorang pendebat berbicara dari podium" },
        },
        {
          key: "2023/vocal-solo",
          caption: { en: "Vocal solo", id: "Solo vokal" },
          alt: { en: "A student sings with arms spread wide in a classroom", id: "Seorang siswa bernyanyi sambil merentangkan kedua tangan di dalam kelas" },
        },
        {
          key: "2023/fashion-design",
          caption: { en: "Fashion design", id: "Desain busana" },
          alt: { en: "Fashion design sketches and a paint palette on a desk", id: "Sketsa desain busana dan palet cat di atas meja" },
        },
        {
          key: "2023/interior-design",
          caption: { en: "Interior design", id: "Desain interior" },
          alt: { en: "A student draws a floor plan with a ruler", id: "Seorang siswa menggambar denah ruangan dengan penggaris" },
        },
        {
          key: "2023/manga",
          caption: { en: "Manga", id: "Manga" },
          alt: { en: "A student in a yellow jacket inks a manga page", id: "Seorang siswa berjaket kuning menebalkan halaman manga dengan tinta" },
        },
        {
          key: "2023/sketch",
          caption: { en: "Sketch", id: "Sketsa" },
          alt: { en: "A pencil sketch in progress on a desk", id: "Sketsa pensil yang sedang dikerjakan di atas meja" },
        },
        {
          key: "2023/graphic-design",
          caption: { en: "Graphic design", id: "Desain grafis" },
          alt: { en: "A student works on a laptop during the graphic design competition", id: "Seorang siswa bekerja dengan laptop dalam lomba desain grafis" },
        },
        {
          key: "2023/certificate-design",
          caption: { en: "Certificate design", id: "Desain sertifikat" },
          alt: { en: "Students design certificates at computer stations", id: "Siswa mendesain sertifikat di depan komputer" },
        },
        {
          key: "2023/competitive-programming",
          caption: { en: "Competitive programming", id: "Competitive programming" },
          alt: { en: "Students code at desktop computers", id: "Siswa menulis kode di komputer" },
        },
        {
          key: "2023/olympiad",
          caption: { en: "Olympiad", id: "Olimpiade" },
          alt: { en: "A student works through an olympiad paper", id: "Seorang siswa mengerjakan soal olimpiade" },
        },
        {
          key: "2023/business-idea",
          caption: { en: "Business idea", id: "Business idea" },
          alt: { en: "A student pitches a business idea in front of a projected app mock-up", id: "Seorang siswa mempresentasikan ide bisnis di depan tampilan rancangan aplikasi" },
        },
        {
          key: "2023/dance-group",
          caption: { en: "Dance group", id: "Tari kelompok" },
          alt: { en: "Dancers in black outfits rehearse a routine in a classroom", id: "Para penari berpakaian hitam berlatih gerakan di dalam kelas" },
        },
        {
          key: "2023/esports-match",
          caption: { en: "Esports match", id: "Pertandingan esports" },
          alt: { en: "Two students play a mobile game side by side", id: "Dua siswa bermain gim seluler berdampingan" },
        },
      ],
    },
  ],
  2024: [
    {
      id: "competitions",
      title: { en: "The competitions", id: "Perlombaan" },
      intro: { en: "From the basketball court to the debate floor.", id: "Dari lapangan basket hingga panggung debat." },
      photos: [
        {
          key: "2024/basketball",
          caption: { en: "Basketball", id: "Bola basket" },
          alt: { en: "Players contest a rebound under the hoop on an outdoor court", id: "Para pemain berebut bola pantul di bawah ring di lapangan terbuka" },
          wide: true,
        },
        {
          key: "2024/class-choir-battle",
          caption: { en: "Class Choir Battle", id: "Class Choir Battle" },
          alt: { en: "A class choir in white shirts and coloured ties sings together", id: "Paduan suara kelas berkemeja putih dan berdasi warna-warni bernyanyi bersama" },
        },
        {
          key: "2024/battle-of-brains",
          caption: { en: "Battle of Brains", id: "Battle of Brains" },
          alt: { en: "Quiz contestants seated at desks in a classroom", id: "Peserta kuis duduk di meja dalam sebuah kelas" },
        },
        {
          key: "2024/tug-of-war",
          caption: { en: "Tug of war", id: "Tarik tambang" },
          alt: { en: "Two teams pull on a rope in the school courtyard as students watch", id: "Dua tim saling menarik tambang di halaman sekolah sementara siswa lain menonton" },
          wide: true,
        },
        {
          key: "2024/terompah",
          caption: { en: "Terompah", id: "Terompah" },
          alt: { en: "Teams line up to race on shared wooden terompah sandals", id: "Tim-tim berbaris untuk berlomba memakai terompah kayu bersama" },
        },
        {
          key: "2024/esports",
          caption: { en: "Esports", id: "Esports" },
          alt: { en: "A student plays a mobile game on a tablet", id: "Seorang siswa bermain gim seluler di tablet" },
        },
        {
          key: "2024/watercolor",
          caption: { en: "Watercolor", id: "Cat air" },
          alt: { en: "A student adds colour to a watercolor painting", id: "Seorang siswa mewarnai lukisan cat air" },
        },
        {
          key: "2024/olympiad",
          caption: { en: "Olympiad", id: "Olimpiade" },
          alt: { en: "A student focuses on an olympiad paper", id: "Seorang siswa berkonsentrasi mengerjakan soal olimpiade" },
        },
        {
          key: "2024/english-debate",
          caption: { en: "English debate", id: "Debat bahasa Inggris" },
          alt: { en: "A debater stands at the front of a classroom", id: "Seorang pendebat berdiri di depan kelas" },
        },
        {
          key: "2024/mandarin-debate",
          caption: { en: "Mandarin debate", id: "Debat bahasa Mandarin" },
          alt: { en: "A student speaks during the Mandarin debate", id: "Seorang siswa berbicara dalam debat bahasa Mandarin" },
        },
        {
          key: "2024/business-idea",
          caption: { en: "Business idea", id: "Business idea" },
          alt: { en: "A student presents business slides", id: "Seorang siswa mempresentasikan slide bisnis" },
        },
        {
          key: "2024/fashion-design",
          caption: { en: "Fashion design", id: "Desain busana" },
          alt: { en: "A fashion sketch drawn on paper", id: "Sketsa busana yang digambar di atas kertas" },
          wide: true,
        },
        {
          key: "2024/interior-design",
          caption: { en: "Interior design", id: "Desain interior" },
          alt: { en: "A student colours an interior design drawing with markers", id: "Seorang siswa mewarnai gambar desain interior dengan spidol" },
        },
        {
          key: "2024/photography",
          caption: { en: "Photography", id: "Fotografi" },
          alt: { en: "Students take part in the photography competition in a classroom", id: "Siswa mengikuti lomba fotografi di dalam kelas" },
        },
        {
          key: "2024/rubiks-cube",
          caption: { en: "Rubik's Cube", id: "Rubik" },
          alt: { en: "A student solves a Rubik's Cube", id: "Seorang siswa menyelesaikan kubus Rubik" },
        },
        {
          key: "2024/vocal-solo",
          caption: { en: "Vocal solo", id: "Solo vokal" },
          alt: { en: "A student sings with a hand on his chest", id: "Seorang siswa bernyanyi dengan tangan di dada" },
        },
      ],
    },
  ],
};

/** A cross-edition selection for the home page strip. */
export const MOMENTS: { key: string; caption: Localized; alt: Localized; year: number }[] = [
  { key: "2023/guzheng", caption: { en: "Guzheng", id: "Guzheng" }, alt: { en: "A student plays a red guzheng on stage", id: "Seorang siswa memainkan guzheng merah di panggung" }, year: 2023 },
  { key: "2024/tug-of-war", caption: { en: "Tug of war", id: "Tarik tambang" }, alt: { en: "Two teams pull on a rope in the school courtyard", id: "Dua tim saling menarik tambang di halaman sekolah" }, year: 2024 },
  { key: "2023/vocal-solo-portrait", caption: { en: "Vocal solo", id: "Solo vokal" }, alt: { en: "A student in a pale blue gown sings on stage", id: "Seorang siswi bergaun biru muda bernyanyi di panggung" }, year: 2023 },
  { key: "2024/basketball", caption: { en: "Basketball", id: "Bola basket" }, alt: { en: "Players contest a rebound under the hoop", id: "Para pemain berebut bola pantul di bawah ring" }, year: 2024 },
  { key: "2023/medals", caption: { en: "The medals", id: "Medali" }, alt: { en: "P2S1 medals with red and white ribbons", id: "Medali P2S1 berpita merah putih" }, year: 2023 },
  { key: "2024/class-choir-battle", caption: { en: "Class Choir Battle", id: "Class Choir Battle" }, alt: { en: "A class choir in white shirts sings", id: "Paduan suara kelas berkemeja putih bernyanyi" }, year: 2024 },
  { key: "2023/badminton", caption: { en: "Badminton", id: "Bulu tangkis" }, alt: { en: "A badminton player leaps for a smash", id: "Seorang pemain bulu tangkis melompat untuk melakukan smes" }, year: 2023 },
  { key: "2024/dance-solo", caption: { en: "Dance solo", id: "Tari solo" }, alt: { en: "A dancer stretches her arms overhead", id: "Seorang penari merentangkan kedua tangannya ke atas" }, year: 2024 },
  { key: "2023/esports-closeup", caption: { en: "Esports", id: "Esports" }, alt: { en: "Hands holding a phone mid-match", id: "Tangan memegang ponsel di tengah pertandingan" }, year: 2023 },
  { key: "2024/watercolor", caption: { en: "Watercolor", id: "Cat air" }, alt: { en: "A student adds colour to a painting", id: "Seorang siswa mewarnai sebuah lukisan" }, year: 2024 },
];
