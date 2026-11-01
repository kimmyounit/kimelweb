import { ArtistProfile, GalleryItem, ProjectItem, NewsItem } from '../types';

export const initialArtistProfile: ArtistProfile = {
  name: "KIM EL",
  stageName: "KIM EL",
  tagline: "REDEFINING CONTEMPORARY ENTERTAINMENT & SONIC ARTISTRY",
  subTagline: "The Sound · The Vision · The Silhouette",
  bioSummary: "KIM EL is an avant-garde artist, vocal visionary, and multidisciplinary performer uniting high-fashion editorial aesthetics with groundbreaking contemporary soundscapes.",
  fullBio: [
    "Emerging from a dynamic background steeped in diverse sonic subcultures and classic performing arts, KIM EL represents the new frontier of global entertainment. Guided by an uncompromising dedication to aesthetic precision, his work bridges high-concept fashion, cinematic visual narratives, and boundary-pushing audio architecture.",
    "Known for commanding stage presence and an introspective, chiaroscuro-inspired creative identity, KIM EL navigates the worlds of live stadium spectacle and intimate studio craftsmanship with equal mastery. His artistry defies traditional genre confines, blending alternative R&B, electronic minimalism, and cinematic orchestration.",
    "Today, under official international representation, KIM EL curates an ecosystem of music releases, fashion campaigns, and multimedia experiences aimed at redefining contemporary pop culture on the world stage."
  ],
  creativeVision: "Art is not merely sound or spectacle; it is an atmospheric architecture that alters perception. My work explores tension: the dialogue between darkness and luminescent silver, between vulnerability and monolithic strength.",
  careerJourney: [
    {
      year: "2026",
      milestone: "Global Headline Vision & World Tour Pre-Production",
      description: "Announced worldwide arena dates and initiated creative direction for the upcoming studio album alongside international auteur producers."
    },
    {
      year: "2025",
      milestone: "Haute Couture Monograph & Breakthrough Releases",
      description: "Featured on leading international editorial covers, partnered with avant-garde fashion houses, and achieved chart-topping streaming dominance."
    },
    {
      year: "2024",
      milestone: "Debut Conceptual EP & International Festival Circuit",
      description: "Unveiled critically acclaimed debut audiovisual EP, commanding headline stages across Asia, Europe, and the Americas."
    },
    {
      year: "2023",
      milestone: "Formation of Independent Creative Direction",
      description: "Established the KIM EL aesthetic blueprint, assembling an elite inner team of sound engineers, cinematographers, and choreographers."
    }
  ],
  personalBackground: "Rooted in cross-continental discipline and classical audio training, KIM EL developed an obsession with tactile analog acoustics and stark architectural aesthetics from an early age, shaping his distinctive sonic and visual signatures.",
  heroImage: "/assets/aistudio/WhatsApp_Image_2026-11-01_at_10.46.55_1c5c2e00.jpeg",
  portraitImage: "/assets/images/editorial_photoshoot_fashion_1793504968607.jpg",
  disciplines: [
    "Vocal Performance & Songwriting",
    "Creative Direction & Concept Design",
    "Fashion Editorial & Campaign Muse",
    "Audio Production & Sound Architecture",
    "Cinematic Narrative & Stage Design"
  ],
  specs: [
    { label: "Active Era", value: "2023 — Present" },
    { label: "Origin", value: "International / Seoul & Los Angeles" },
    { label: "Representation", value: "Global Artist Management" },
    { label: "Primary Sound", value: "Contemporary Alternative & Cinematic R&B" },
    { label: "Live Setup", value: "Full Arena Production & Analog Hybrid" }
  ],
  management: {
    agency: "KIM EL ENTERTAINMENT & MANAGEMENT",
    division: "Global Artist Relations & Executive Office",
    headquarters: "Tokyo · Seoul · Paris · Los Angeles",
    email: "management@kimel-official.com",
    bookingEmail: "booking@kimel-official.com",
    pressEmail: "press@kimel-official.com"
  },
  socials: {
    instagram: "https://instagram.com",
    spotify: "https://spotify.com",
    youtube: "https://youtube.com",
    appleMusic: "https://music.apple.com",
    twitter: "https://x.com",
    tiktok: "https://tiktok.com"
  }
};

export const initialGalleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Chiaroscuro Silhouette — Official Editorial",
    category: "editorial",
    categoryLabel: "Editorial Photos",
    image: "/assets/images/editorial_photoshoot_fashion_1793504968607.jpg",
    aspectRatio: "portrait",
    year: "2026",
    credits: "Creative Direction: KIM EL Studio · Photography: Hiroshi Tanaka",
    description: "High-contrast tailored noir series exploring structure, form, and masculine elegance."
  },
  {
    id: "gal-2",
    title: "The Eclipse Arena Tour — Live in Tokyo",
    category: "event",
    categoryLabel: "Event Documentation",
    image: "/assets/images/stage_live_performance_1793504968267.jpg",
    aspectRatio: "landscape",
    year: "2026",
    credits: "Production: KIM EL Live · Venue: Tokyo Dome",
    description: "Commanding 55,000 attendees under monochrome pyrotechnic silver cascades."
  },
  {
    id: "gal-3",
    title: "Analog Frequencies — Studio Session III",
    category: "bts",
    categoryLabel: "Behind The Scenes",
    image: "/assets/images/studio_recording_session_1793504970684.jpg",
    aspectRatio: "landscape",
    year: "2025",
    credits: "Location: Black Cube Studios · Tracking: Vintage SSL 4000G+",
    description: "Late night vocal tracking for upcoming major LP release."
  },
  {
    id: "gal-4",
    title: "Haute Couture & Sculptural Silver",
    category: "photoshoot",
    categoryLabel: "Official Photoshoot",
    image: "/assets/images/editorial_campaign_silver_1793504969525.jpg",
    aspectRatio: "portrait",
    year: "2026",
    credits: "Monochrome Haute Couture Collection · Styling: Studio EL",
    description: "Avant-garde metallic adornment study emphasizing kinetic physical poise."
  },
  {
    id: "gal-5",
    title: "Emergence — The Noir Portrait Series",
    category: "photoshoot",
    categoryLabel: "Official Photoshoot",
    image: "/assets/aistudio/WhatsApp_Image_2026-11-01_at_10.46.55_1c5c2e00.jpeg",
    aspectRatio: "portrait",
    year: "2026",
    credits: "Official Artist Archive No. 01",
    description: "Intimate chiaroscuro key portrait establishing KIM EL's signature persona."
  },
  {
    id: "gal-6",
    title: "NIGHTFALL: Cinematic Visualizer Trailer",
    category: "video",
    categoryLabel: "Video Gallery",
    image: "/assets/images/stage_live_performance_1793504968267.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    aspectRatio: "landscape",
    year: "2026",
    credits: "Director of Photography: Luc Besson Agency",
    description: "Teaser video document featuring arena sound design and cinematic direction."
  }
];

export const initialProjects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "PROJECT NOCTURNE: WORLD TOUR 2026–2027",
    category: "upcoming",
    categoryLabel: "Upcoming Projects",
    role: "Headliner & Executive Creative Director",
    releaseDate: "Q3 2026",
    year: "2026",
    coverImage: "/assets/images/stage_live_performance_1793504968267.jpg",
    summary: "A monumental 28-city international stadium and arena spectacle featuring kinetic staging, bespoke stage architecture, and live orchestral synthesis.",
    details: "Produced in collaboration with global staging pioneers, Nocturne merges physical choreography with reactive light installations.",
    externalLink: "#contact",
    tags: ["World Tour", "Arena Production", "Stage Design"]
  },
  {
    id: "proj-2",
    title: "CHRONO-SILVER: THE STUDIO ALBUM",
    category: "current",
    categoryLabel: "Current Activities",
    role: "Executive Producer, Vocalist & Composer",
    releaseDate: "Summer 2026",
    year: "2026",
    coverImage: "/assets/images/studio_recording_session_1793504970684.jpg",
    summary: "12-track conceptual album exploring sonic minimalism, cinematic brass, and hyper-modern alternative R&B arrangements.",
    details: "Recorded between Tokyo, Paris, and Los Angeles, utilizing legendary analog outboard gear and cutting-edge spatial audio mastering.",
    tags: ["Studio Album", "Spatial Audio", "Analog Production"]
  },
  {
    id: "proj-3",
    title: "MAISON DE L'OMBRE: GLOBAL BRAND AMBASSADOR",
    category: "collaboration",
    categoryLabel: "Collaborations",
    role: "Global House Ambassador & Campaign Lead",
    releaseDate: "Fall/Winter 2025",
    year: "2025",
    coverImage: "/assets/images/editorial_campaign_silver_1793504969525.jpg",
    summary: "Exclusive international capsule campaign bridging sculptural couture jewelry, tailored outerwear, and minimalist campaign films.",
    details: "Debuted during Paris Fashion Week with worldwide billboard takeovers and a limited-edition artist lookbook.",
    tags: ["Haute Couture", "Global Campaign", "Fashion Week"]
  },
  {
    id: "proj-4",
    title: "MONOLITH: LIVE AT GRAND THEATRE",
    category: "previous",
    categoryLabel: "Previous Projects",
    role: "Solo Performer & Art Director",
    releaseDate: "November 2024",
    year: "2024",
    coverImage: "/assets/images/editorial_photoshoot_fashion_1793504968607.jpg",
    summary: "An experimental acoustic-electronic broadcast concert captured in 4K HDR across three dramatic monolithic visual acts.",
    details: "Streamed globally to over 1.8 million concurrent viewers and hailed as a benchmark in digital performance curation.",
    tags: ["Concert Film", "Broadcast", "Acoustic Hybrid"]
  },
  {
    id: "proj-5",
    title: "VENICE BIENNALE ART & SOUND PAVILION",
    category: "appearance",
    categoryLabel: "Special Appearances",
    role: "Guest Sound Sculptor & Keynote Performer",
    releaseDate: "May 2025",
    year: "2025",
    coverImage: "/assets/aistudio/WhatsApp_Image_2026-11-01_at_10.46.55_1c5c2e00.jpeg",
    summary: "Immersive sound pavilion installation exploring spatial resonance, architectural silence, and ambient human frequencies.",
    details: "Commissioned by contemporary curators to showcase the intersection of modern vocal frequencies and structural design.",
    tags: ["Special Appearance", "Venice Biennale", "Sound Art"]
  }
];

export const initialNews: NewsItem[] = [
  {
    id: "news-1",
    title: "KIM EL Announces Global Stadium Tour 'NOCTURNE' Across 28 Continents & Metropolises",
    date: "OCTOBER 28, 2026",
    outlet: "OFFICIAL PRESS DISPATCH",
    excerpt: "The visionary artist confirms the ambitious world tour production, featuring state-of-the-art kinetic stage architecture and unprecedented audio design.",
    content: "Following months of intense preparation in secret creative workshops across Tokyo and Paris, KIM EL Entertainment officially confirmed the dates for 'NOCTURNE'. The production will mark the artist's most ambitious global project to date, featuring custom-engineered monolithic LED light arrays and an unreleased repertoire from the forthcoming studio record.",
    coverImage: "/assets/images/stage_live_performance_1793504968267.jpg",
    category: "World Tour"
  },
  {
    id: "news-2",
    title: "VOGUE EDITORIAL: How KIM EL is Redefining Contemporary Entertainment Aesthetics",
    date: "SEPTEMBER 14, 2026",
    outlet: "INTERNATIONAL PRESS",
    excerpt: "An in-depth cover profile exploring KIM EL's meticulous approach to visual identity, haute couture styling, and creative sovereignty.",
    content: "'There is no separation between the note you sing and the shadow you cast on camera,' KIM EL remarks during the intimate cover conversation. The piece explores his collaboration with international fashion directors, his hands-on executive production style, and his resistance to cookie-cutter entertainment molds.",
    coverImage: "/assets/images/editorial_photoshoot_fashion_1793504968607.jpg",
    category: "Editorial Cover"
  },
  {
    id: "news-3",
    title: "Inside the Sonic Laboratory: Recording the Highly Anticipated Album 'CHRONO-SILVER'",
    date: "AUGUST 02, 2026",
    outlet: "STUDIO JOURNAL",
    excerpt: "Behind closed doors with the sound engineering team crafting analog tape textures and spatial surround frequencies.",
    content: "With late-night studio sessions spanning Tokyo and Los Angeles, KIM EL has engaged master acoustic technicians to capture warm tube-saturated vocal takes. The upcoming record promises to deliver an uncompromising listening experience that honors classic hi-fi audiophile principles while pioneering futuristic sub-bass architecture.",
    coverImage: "/assets/images/studio_recording_session_1793504970684.jpg",
    category: "Music Production"
  }
];
