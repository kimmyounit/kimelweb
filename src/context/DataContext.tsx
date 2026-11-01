import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ArtistProfile,
  GalleryItem,
  ProjectItem,
  NewsItem,
  InquirySubmission
} from '../types';
import {
  initialArtistProfile,
  initialGalleryItems,
  initialProjects,
  initialNews
} from '../data/initialData';

interface DataContextType {
  profile: ArtistProfile;
  gallery: GalleryItem[];
  projects: ProjectItem[];
  news: NewsItem[];
  inquiries: InquirySubmission[];
  isAdminOpen: boolean;
  selectedMedia: GalleryItem | null;
  selectedNews: NewsItem | null;
  setIsAdminOpen: (open: boolean) => void;
  setSelectedMedia: (item: GalleryItem | null) => void;
  setSelectedNews: (item: NewsItem | null) => void;
  updateProfile: (updated: Partial<ArtistProfile>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  addProject: (item: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, item: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  addNews: (item: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, item: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  submitInquiry: (inquiry: Omit<InquirySubmission, 'id' | 'timestamp'>) => void;
  deleteInquiry: (id: string) => void;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'kimel_artist_profile_v2',
  GALLERY: 'kimel_gallery_v2',
  PROJECTS: 'kimel_projects_v2',
  NEWS: 'kimel_news_v2',
  INQUIRIES: 'kimel_inquiries_v2'
};

const sanitizePath = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str.replaceAll('/src/assets/images/', '/assets/images/');
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ArtistProfile>(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem('kimel_artist_profile_v1');
      if (saved) {
        saved = sanitizePath(saved);
        const parsed = JSON.parse(saved);
        return { ...initialArtistProfile, ...parsed };
      }
      return initialArtistProfile;
    } catch {
      return initialArtistProfile;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEYS.GALLERY) || localStorage.getItem('kimel_gallery_v1');
      if (saved) {
        saved = sanitizePath(saved);
        return JSON.parse(saved);
      }
      return initialGalleryItems;
    } catch {
      return initialGalleryItems;
    }
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEYS.PROJECTS) || localStorage.getItem('kimel_projects_v1');
      if (saved) {
        saved = sanitizePath(saved);
        return JSON.parse(saved);
      }
      return initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEYS.NEWS) || localStorage.getItem('kimel_news_v1');
      if (saved) {
        saved = sanitizePath(saved);
        return JSON.parse(saved);
      }
      return initialNews;
    } catch {
      return initialNews;
    }
  });

  const [inquiries, setInquiries] = useState<InquirySubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES) || localStorage.getItem('kimel_inquiries_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  }, [inquiries]);

  const updateProfile = (updated: Partial<ArtistProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    setGallery(prev => {
      const next = [newItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const updateGalleryItem = (id: string, item: Partial<GalleryItem>) => {
    setGallery(prev => {
      const next = prev.map(g => (g.id === id ? { ...g, ...item } : g));
      try {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => {
      const next = prev.filter(g => g.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const addProject = (item: Omit<ProjectItem, 'id'>) => {
    const newItem: ProjectItem = {
      ...item,
      id: `proj-${Date.now()}`
    };
    setProjects(prev => {
      const next = [newItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const updateProject = (id: string, item: Partial<ProjectItem>) => {
    setProjects(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...item } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const next = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const addNews = (item: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`
    };
    setNews(prev => {
      const next = [newItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const updateNews = (id: string, item: Partial<NewsItem>) => {
    setNews(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, ...item } : n));
      try {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const deleteNews = (id: string) => {
    setNews(prev => {
      const next = prev.filter(n => n.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const submitInquiry = (inquiry: Omit<InquirySubmission, 'id' | 'timestamp'>) => {
    const newInquiry: InquirySubmission = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setInquiries(prev => {
      const next = [newInquiry, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => {
      const next = prev.filter(inq => inq.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const resetToDefaults = () => {
    setProfile(initialArtistProfile);
    setGallery(initialGalleryItems);
    setProjects(initialProjects);
    setNews(initialNews);
    setInquiries([]);
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  const exportData = (): string => {
    const data = {
      profile,
      gallery,
      projects,
      news,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.profile) setProfile(parsed.profile);
      if (Array.isArray(parsed.gallery)) setGallery(parsed.gallery);
      if (Array.isArray(parsed.projects)) setProjects(parsed.projects);
      if (Array.isArray(parsed.news)) setNews(parsed.news);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        gallery,
        projects,
        news,
        inquiries,
        isAdminOpen,
        selectedMedia,
        selectedNews,
        setIsAdminOpen,
        setSelectedMedia,
        setSelectedNews,
        updateProfile,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addProject,
        updateProject,
        deleteProject,
        addNews,
        updateNews,
        deleteNews,
        submitInquiry,
        deleteInquiry,
        resetToDefaults,
        exportData,
        importData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
