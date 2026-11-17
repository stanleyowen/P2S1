// Gallery curation. Keys map to files in content/photos/<key>.jpg.
// `wide` / `tall` give a photo more room in the grid.

export type PhotoEntry = { key: string; caption: string; alt: string; wide?: boolean; tall?: boolean };
export type GallerySection = { id: string; title: string; intro?: string; photos: PhotoEntry[] };

export const GALLERIES: Record<number, GallerySection[]> = {
  2023: [
    {
      id: "finale",
      title: "Puncak P2S1 — the finale",
      intro: "Two evenings in the school auditorium on 3 and 6 March 2023: performances, medals and trophies.",
      photos: [
        { key: "2023/celebration", caption: "Trophy celebration", alt: "Students in traditional costume cheer as a teacher lifts a tall trophy on stage", wide: true },
        { key: "2023/guzheng", caption: "Guzheng performance", alt: "A student plays a red guzheng under warm stage lights" },
        { key: "2023/vocal-solo-portrait", caption: "Vocal solo", alt: "A student in a pale blue gown sings on stage with her arm outstretched", tall: true },
        { key: "2023/mcs", caption: "Opening the finale", alt: "Two masters of ceremony speaking into microphones in front of the P2S1 XXVI banner" },
        { key: "2023/choir-trophy", caption: "A trophy for the class choir", alt: "A class choir in matching costumes receives a trophy from a teacher" },
        { key: "2023/finale-dance-group", caption: "Dance group", alt: "A dance group performs in front of the finale backdrop" },
        { key: "2023/guitar", caption: "Musical instrument", alt: "A student plays electric guitar on stage" },
        { key: "2023/costume-performance", caption: "In costume", alt: "A performer in a red hooded cape sings into a microphone", tall: true },
        { key: "2023/dance-performance", caption: "Stage performance", alt: "Performers in red costumes join hands during a stage routine" },
        { key: "2023/class-choir", caption: "Class choir", alt: "A class choir in cream tops and woven skirts sings together" },
        { key: "2023/medals", caption: "Medals, ready", alt: "Close-up of P2S1 medals with red and white ribbons laid out on a table", wide: true },
        { key: "2023/trophies", caption: "Trophies for the champions", alt: "Rows of tall gold trophies labelled Juara 1" },
        { key: "2023/medal-ceremony", caption: "Medal ceremony", alt: "A teacher places a medal around a student's neck" },
        { key: "2023/champions-on-stage", caption: "Champions on stage", alt: "A row of medal winners stands on stage in front of the P2S1 banner" },
        { key: "2023/champions-with-teacher", caption: "Winners with their teacher", alt: "Medal winners pose with a teacher on stage" },
        { key: "2023/finale-audience", caption: "A full house", alt: "The auditorium filled with students in front of the finale screen", wide: true },
      ],
    },
    {
      id: "competitions",
      title: "The competitions",
      intro: "Eight weeks of matches, olympiads, debates and studio time.",
      photos: [
        { key: "2023/basketball", caption: "Basketball", alt: "A player drives toward the basket during a game", tall: true },
        { key: "2023/esports-closeup", caption: "Esports", alt: "Close-up of hands holding a phone mid-match in a mobile game" },
        { key: "2023/battle-of-brains", caption: "Battle of Brains", alt: "Quiz contestants raise their hands to answer" },
        { key: "2023/watercolor", caption: "Watercolor", alt: "Students paint with watercolors at their desks" },
        { key: "2023/class-choir-battle", caption: "Class Choir Battle", alt: "A class choir in headbands and traditional dress performs" },
        { key: "2023/badminton", caption: "Badminton", alt: "A badminton player leaps for a smash", wide: true },
        { key: "2023/scrabble", caption: "Scrabble", alt: "Hands placing tiles on a Scrabble board" },
        { key: "2023/table-tennis", caption: "Table tennis", alt: "A player serves in a table tennis match" },
        { key: "2023/tug-of-war", caption: "Tug of war", alt: "Students strain on a rope in a tug-of-war match outdoors" },
        { key: "2023/public-speaking", caption: "Public speaking", alt: "A student speaks with expressive gestures in front of a classroom" },
        { key: "2023/newscasting", caption: "Newscasting", alt: "A student in a suit reads the news in front of a projected backdrop" },
        { key: "2023/debate", caption: "Debate", alt: "A debater speaks from the podium" },
        { key: "2023/vocal-solo", caption: "Vocal solo", alt: "A student sings with arms spread wide in a classroom" },
        { key: "2023/fashion-design", caption: "Fashion design", alt: "Fashion design sketches and a paint palette on a desk" },
        { key: "2023/interior-design", caption: "Interior design", alt: "A student draws a floor plan with a ruler" },
        { key: "2023/manga", caption: "Manga", alt: "A student in a yellow jacket inks a manga page" },
        { key: "2023/sketch", caption: "Sketch", alt: "A pencil sketch in progress on a desk" },
        { key: "2023/graphic-design", caption: "Graphic design", alt: "A student works on a laptop during the graphic design competition" },
        { key: "2023/certificate-design", caption: "Certificate design", alt: "Students design certificates at computer stations" },
        { key: "2023/competitive-programming", caption: "Competitive programming", alt: "Students code at desktop computers" },
        { key: "2023/olympiad", caption: "Olympiad", alt: "A student works through an olympiad paper" },
        { key: "2023/business-idea", caption: "Business idea", alt: "A student pitches a business idea in front of a projected app mock-up" },
        { key: "2023/dance-group", caption: "Dance group", alt: "Dancers in black outfits rehearse a routine in a classroom" },
        { key: "2023/esports-match", caption: "Esports match", alt: "Two students play a mobile game side by side" },
      ],
    },
  ],
  2024: [
    {
      id: "competitions",
      title: "The competitions",
      intro: "From the basketball court to the debate floor.",
      photos: [
        { key: "2024/basketball", caption: "Basketball", alt: "Players contest a rebound under the hoop on an outdoor court", wide: true },
        { key: "2024/class-choir-battle", caption: "Class Choir Battle", alt: "A class choir in white shirts and coloured ties sings together" },
        { key: "2024/battle-of-brains", caption: "Battle of Brains", alt: "Quiz contestants seated at desks in a classroom" },
        { key: "2024/tug-of-war", caption: "Tug of war", alt: "Two teams pull on a rope in the school courtyard as students watch", wide: true },
        { key: "2024/terompah", caption: "Terompah", alt: "Teams line up to race on shared wooden terompah sandals" },
        { key: "2024/esports", caption: "Esports", alt: "A student plays a mobile game on a tablet" },
        { key: "2024/watercolor", caption: "Watercolor", alt: "A student adds colour to a watercolor painting" },
        { key: "2024/olympiad", caption: "Olympiad", alt: "A student focuses on an olympiad paper" },
        { key: "2024/english-debate", caption: "English debate", alt: "A debater stands at the front of a classroom" },
        { key: "2024/mandarin-debate", caption: "Mandarin debate", alt: "A student speaks during the Mandarin debate" },
        { key: "2024/business-idea", caption: "Business idea", alt: "A student presents business slides" },
        { key: "2024/fashion-design", caption: "Fashion design", alt: "A fashion sketch drawn on paper", wide: true },
        { key: "2024/interior-design", caption: "Interior design", alt: "A student colours an interior design drawing with markers" },
        { key: "2024/photography", caption: "Photography", alt: "Students take part in the photography competition in a classroom" },
        { key: "2024/rubiks-cube", caption: "Rubik's Cube", alt: "A student solves a Rubik's Cube" },
        { key: "2024/vocal-solo", caption: "Vocal solo", alt: "A student sings with a hand on his chest" },
      ],
    },
    {
      id: "team",
      title: "Behind the scenes",
      intro: "OSIS SMA Sutomo 1, the student council that organises P2S1 every year.",
      photos: [
        { key: "2024/osis-committee", caption: "OSIS SMA Sutomo 1 · January 2024", alt: "The OSIS team in red shirts poses in the school courtyard", wide: true },
        { key: "2024/osis-auditorium", caption: "In the auditorium · January 2024", alt: "Students fill the auditorium seats for a group photo with OSIS members and teachers in front", wide: true },
      ],
    },
  ],
};

/** A cross-edition selection for the home page strip. */
export const MOMENTS: { key: string; caption: string; alt: string; year: number }[] = [
  { key: "2023/guzheng", caption: "Guzheng", alt: "A student plays a red guzheng on stage", year: 2023 },
  { key: "2024/tug-of-war", caption: "Tug of war", alt: "Two teams pull on a rope in the school courtyard", year: 2024 },
  { key: "2023/vocal-solo-portrait", caption: "Vocal solo", alt: "A student in a pale blue gown sings on stage", year: 2023 },
  { key: "2024/basketball", caption: "Basketball", alt: "Players contest a rebound under the hoop", year: 2024 },
  { key: "2023/medals", caption: "The medals", alt: "P2S1 medals with red and white ribbons", year: 2023 },
  { key: "2024/class-choir-battle", caption: "Class Choir Battle", alt: "A class choir in white shirts sings", year: 2024 },
  { key: "2023/badminton", caption: "Badminton", alt: "A badminton player leaps for a smash", year: 2023 },
  { key: "2024/dance-solo", caption: "Dance solo", alt: "A dancer stretches her arms overhead", year: 2024 },
  { key: "2023/esports-closeup", caption: "Esports", alt: "Hands holding a phone mid-match", year: 2023 },
  { key: "2024/watercolor", caption: "Watercolor", alt: "A student adds colour to a painting", year: 2024 },
];
