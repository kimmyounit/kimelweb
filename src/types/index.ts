export interface ArtistProfile {
  name: string;
  stageName: string;
  tagline: string;
  subTagline: string;
  bioSummary: string;
  fullBio: string[];
  creativeVision: string;
  careerJourney: {
    year: string;
    milestone: string;
    description: string;
  }[];
  personalBackground: string;
  heroImage: string;
  portraitImage: string;
  disciplines: string[];
  specs: {
    label: string;
    value: string;
  }[];
  management: {
    agency: string;
    division: string;
    headquarters: string;
    email: string;
    bookingEmail: string;
    pressEmail: string;
  };
  socials: {
    instagram: string;
    spotify: string;
    youtube: string;
    appleMusic: string;
    twitter: string;
    tiktok: string;
  };
}

export type GalleryCategory = 'photoshoot' | 'editorial' | 'bts' | 'event' | 'video';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  image: string;
  videoUrl?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  year: string;
  credits?: string;
  description?: string;
}

export type ProjectCategory = 'upcoming' | 'current' | 'previous' | 'collaboration' | 'appearance';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  role: string;
  releaseDate: string;
  year: string;
  coverImage: string;
  summary: string;
  details?: string;
  externalLink?: string;
  tags: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  outlet: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
}

export interface InquirySubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  inquiryType: 'Business' | 'Collaboration' | 'Partnership' | 'Event Invitation' | 'Press';
  message: string;
  timestamp: string;
}
