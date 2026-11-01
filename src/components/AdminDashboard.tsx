import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { soundEngine } from '../utils/soundEffects';
import {
  GalleryCategory,
  GalleryItem,
  ProjectCategory,
  ProjectItem,
  NewsItem
} from '../types';
import {
  X,
  Save,
  Image as ImageIcon,
  User,
  Film,
  FolderGit2,
  Newspaper,
  Share2,
  Mail,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  Upload,
  Sparkles,
  Edit3,
  LogOut,
  KeyRound,
  Shield,
  Download,
  AlertCircle,
  Check,
  Database,
  RefreshCw,
  Cloud
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    profile,
    updateProfile,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    projects,
    addProject,
    updateProject,
    deleteProject,
    news,
    addNews,
    updateNews,
    deleteNews,
    inquiries,
    deleteInquiry,
    resetToDefaults,
    exportData,
    importData,
    isCloudConnected,
    isSyncing,
    cloudConfig,
    saveCloudConfig,
    syncAllToCloud
  } = useData();

  const { isAuthenticated, user, logout, updateCredentials } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'homepage' | 'profile' | 'gallery' | 'projects' | 'news' | 'socials' | 'inquiries' | 'cloud' | 'account'
  >('homepage');

  // Profile Form State
  const [profileForm, setProfileForm] = useState(profile);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync profileForm if profile changes outside
  React.useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // Cloud Database State & Handlers
  const [firebaseJsonInput, setFirebaseJsonInput] = useState(() => {
    return cloudConfig ? JSON.stringify(cloudConfig, null, 2) : '';
  });

  React.useEffect(() => {
    if (cloudConfig) {
      setFirebaseJsonInput(JSON.stringify(cloudConfig, null, 2));
    }
  }, [cloudConfig]);

  const handleSaveFirebaseConfig = async () => {
    try {
      let raw = firebaseJsonInput.trim();
      if (raw.includes('{') && raw.includes('}')) {
        raw = raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
      }
      raw = raw.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":').replace(/'/g, '"');
      const parsed = JSON.parse(raw);
      if (!parsed.projectId || !parsed.apiKey) {
        showToast('Error: Pastikan apiKey dan projectId ada dalam konfigurasi.');
        return;
      }
      soundEngine.playClick();
      const ok = await saveCloudConfig(parsed);
      if (ok) {
        showToast('Berhasil terhubung ke Firebase Cloud Database!');
        await syncAllToCloud();
        showToast('Sinkronisasi data awal ke Cloud berhasil!');
      } else {
        showToast('Gagal menghubungkan ke Firebase. Cek konfigurasi.');
      }
    } catch (err) {
      console.error(err);
      showToast('Format tidak valid. Pastikan JSON konfigurasi Firebase benar.');
    }
  };

  const handleDisconnectCloud = async () => {
    soundEngine.playClick();
    await saveCloudConfig(null);
    setFirebaseJsonInput('');
    showToast('Koneksi Cloud Database diputuskan. Kembali ke mode lokal.');
  };

  const handleSyncAllToCloud = async () => {
    soundEngine.playClick();
    try {
      await syncAllToCloud();
      showToast('Seluruh data berhasil disinkronkan ke Cloud!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal sinkronisasi';
      showToast(`Error: ${msg}`);
    }
  };

  // Gallery Form State (New & Editing)
  const [newGallery, setNewGallery] = useState<{
    title: string;
    category: GalleryCategory;
    image: string;
    videoUrl: string;
    year: string;
    credits: string;
    description: string;
    aspectRatio: 'portrait' | 'landscape' | 'square';
  }>({
    title: '',
    category: 'editorial',
    image: '',
    videoUrl: '',
    year: '2026',
    credits: '',
    description: '',
    aspectRatio: 'portrait'
  });

  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);

  // Projects Form State (New & Editing)
  const [newProject, setNewProject] = useState<{
    title: string;
    category: ProjectCategory;
    role: string;
    releaseDate: string;
    year: string;
    coverImage: string;
    summary: string;
    details: string;
    tags: string;
  }>({
    title: '',
    category: 'upcoming',
    role: 'Executive Artist',
    releaseDate: '2026',
    year: '2026',
    coverImage: '',
    summary: '',
    details: '',
    tags: 'World Tour, Music, Visuals'
  });

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // News Form State (New & Editing)
  const [newNews, setNewNews] = useState<{
    title: string;
    outlet: string;
    date: string;
    category: string;
    excerpt: string;
    content: string;
    coverImage: string;
  }>({
    title: '',
    outlet: 'OFFICIAL PRESS DISPATCH',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
    category: 'Release',
    excerpt: '',
    content: '',
    coverImage: ''
  });

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Change Password Form State
  const [credForm, setCredForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newUsername: user?.username || '',
    newName: user?.name || ''
  });
  const [credMsg, setCredMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAdminOpen || !isAuthenticated) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper for file upload to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
          showToast('File gambar berhasil dimuat');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    soundEngine.playClick();
    updateProfile(profileForm);
    showToast('Profil & seluruh pengaturan website berhasil diperbarui!');
  };

  // ==================== GALLERY HANDLERS ====================
  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.image) return;

    soundEngine.playClick();
    const categoryLabels: Record<GalleryCategory, string> = {
      photoshoot: 'Official Photoshoot',
      editorial: 'Editorial Photos',
      bts: 'Behind The Scenes',
      event: 'Event Documentation',
      video: 'Video Gallery'
    };

    addGalleryItem({
      title: newGallery.title,
      category: newGallery.category,
      categoryLabel: categoryLabels[newGallery.category],
      image: newGallery.image,
      videoUrl: newGallery.videoUrl || undefined,
      year: newGallery.year || '2026',
      credits: newGallery.credits || undefined,
      description: newGallery.description || undefined,
      aspectRatio: newGallery.aspectRatio
    });

    setNewGallery({
      title: '',
      category: 'editorial',
      image: '',
      videoUrl: '',
      year: '2026',
      credits: '',
      description: '',
      aspectRatio: 'portrait'
    });

    showToast('Item galeri baru berhasil ditambahkan ke website!');
  };

  const handleUpdateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;

    soundEngine.playClick();
    const categoryLabels: Record<GalleryCategory, string> = {
      photoshoot: 'Official Photoshoot',
      editorial: 'Editorial Photos',
      bts: 'Behind The Scenes',
      event: 'Event Documentation',
      video: 'Video Gallery'
    };

    updateGalleryItem(editingGallery.id, {
      ...editingGallery,
      categoryLabel: categoryLabels[editingGallery.category]
    });

    setEditingGallery(null);
    showToast(`Arsip "${editingGallery.title}" berhasil diperbarui!`);
  };

  // ==================== PROJECT HANDLERS ====================
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.coverImage) return;

    soundEngine.playClick();
    const catLabels: Record<ProjectCategory, string> = {
      upcoming: 'Upcoming Projects',
      current: 'Current Activities',
      previous: 'Previous Projects',
      collaboration: 'Collaborations',
      appearance: 'Special Appearances'
    };

    const tagsArray = newProject.tags.split(',').map((t) => t.trim()).filter(Boolean);

    addProject({
      title: newProject.title,
      category: newProject.category,
      categoryLabel: catLabels[newProject.category],
      role: newProject.role,
      releaseDate: newProject.releaseDate,
      year: newProject.year || '2026',
      coverImage: newProject.coverImage,
      summary: newProject.summary,
      details: newProject.details || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['Creative Venture']
    });

    setNewProject({
      title: '',
      category: 'upcoming',
      role: 'Executive Artist',
      releaseDate: '2026',
      year: '2026',
      coverImage: '',
      summary: '',
      details: '',
      tags: 'World Tour, Music'
    });

    showToast('Proyek baru berhasil ditambahkan ke website!');
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    soundEngine.playClick();
    const catLabels: Record<ProjectCategory, string> = {
      upcoming: 'Upcoming Projects',
      current: 'Current Activities',
      previous: 'Previous Projects',
      collaboration: 'Collaborations',
      appearance: 'Special Appearances'
    };

    updateProject(editingProject.id, {
      ...editingProject,
      categoryLabel: catLabels[editingProject.category]
    });

    setEditingProject(null);
    showToast(`Proyek "${editingProject.title}" berhasil diperbarui!`);
  };

  // ==================== NEWS HANDLERS ====================
  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.coverImage) return;

    soundEngine.playClick();
    addNews({
      title: newNews.title,
      outlet: newNews.outlet,
      date: newNews.date,
      category: newNews.category,
      excerpt: newNews.excerpt,
      content: newNews.content,
      coverImage: newNews.coverImage
    });

    setNewNews({
      title: '',
      outlet: 'OFFICIAL PRESS DISPATCH',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
      category: 'Release',
      excerpt: '',
      content: '',
      coverImage: ''
    });

    showToast('Berita baru berhasil diterbitkan di website!');
  };

  const handleUpdateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    soundEngine.playClick();
    updateNews(editingNews.id, editingNews);
    setEditingNews(null);
    showToast(`Berita "${editingNews.title}" berhasil diperbarui!`);
  };

  // ==================== CREDENTIAL UPDATE ====================
  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    setCredMsg(null);

    if (credForm.newPassword !== credForm.confirmPassword) {
      setCredMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    const res = updateCredentials(
      credForm.currentPassword,
      credForm.newPassword,
      credForm.newUsername,
      credForm.newName
    );

    if (res.success) {
      setCredMsg({ type: 'success', text: 'Kredensial admin berhasil diperbarui!' });
      setCredForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newUsername: credForm.newUsername,
        newName: credForm.newName
      });
      showToast('Kredensial login admin berhasil diperbarui!');
    } else {
      setCredMsg({ type: 'error', text: res.error || 'Gagal memperbarui kredensial.' });
    }
  };

  // ==================== BACKUP / EXPORT ====================
  const handleExport = () => {
    soundEngine.playClick();
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kim-el-official-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File backup database berhasil diunduh!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const ok = importData(content);
          if (ok) {
            showToast('Data website berhasil diimpor!');
          } else {
            alert('Format file JSON tidak valid.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAdminOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-2xl">
      <div className="relative w-full max-w-6xl h-[92vh] bg-neutral-950 border border-white/20 flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-4 bg-black border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-white" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                  KIM EL // Executive Artist CMS
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Admin: {user?.username}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-white/5 border border-white/10">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
                  <span className={isCloudConnected ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}>
                    {isCloudConnected ? 'Cloud Online' : 'Mode Lokal'}
                  </span>
                </span>
              </div>
              <span className="text-[10px] font-mono-code text-neutral-400">
                Official Content & Database Control Room
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {toastMessage && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono-code animate-in fade-in bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{toastMessage}</span>
              </span>
            )}

            <button
              onClick={handleLogout}
              title="Keluar / Logout"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-white/5 hover:bg-rose-950/50 hover:border-rose-500/50 border border-white/10 rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setIsAdminOpen(false);
              }}
              title="Tutup Panel"
              className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CMS Body Split: Sidebar & Main Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-black/50 border-r border-white/10 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('homepage');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'homepage' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Hero & Home</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('profile');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Bio, Specs & Journey</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('gallery');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'gallery' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4 shrink-0" />
              <span>Gallery ({gallery.length})</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('projects');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'projects' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderGit2 className="w-4 h-4 shrink-0" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('news');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'news' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Newspaper className="w-4 h-4 shrink-0" />
              <span>News ({news.length})</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('socials');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'socials' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span>Agency & Socials</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('inquiries');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'inquiries' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Inquiries ({inquiries.length})</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('cloud');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cloud' ? 'bg-cyan-400 text-black font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-4 h-4 shrink-0 text-cyan-400" />
              <div className="flex items-center gap-1.5">
                <span>Database Online</span>
                <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
              </div>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('account');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'account' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Akun & Keamanan</span>
            </button>

            <div className="md:mt-auto pt-4 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  resetToDefaults();
                  setProfileForm(profile);
                  showToast('Data berhasil direset ke pengaturan awal.');
                }}
                className="flex items-center gap-2 px-3 py-2 text-[11px] text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data Awal</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {/* ================= TAB: HOMEPAGE ================= */}
            {activeTab === 'homepage' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white uppercase">
                      Hero & Homepage Settings
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Konfigurasikan judul utama, nama panggung, tagline artist, dan gambar sampul hero.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1.5">
                        Artist Official Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1.5">
                        Stage Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.stageName}
                        onChange={(e) => setProfileForm({ ...profileForm, stageName: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1.5">
                      Main Tagline (Displayed Bold)
                    </label>
                    <input
                      type="text"
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1.5">
                      Sub Tagline
                    </label>
                    <input
                      type="text"
                      value={profileForm.subTagline}
                      onChange={(e) => setProfileForm({ ...profileForm, subTagline: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs uppercase font-mono-code text-neutral-400">
                        Homepage Hero Image (Cover Utama)
                      </label>
                      {profileForm.heroImage && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setProfileForm({ ...profileForm, heroImage: '' });
                            showToast('Foto hero dikosongkan. Klik "Simpan Perubahan" untuk menerapkan.');
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-mono-code cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <input
                        type="text"
                        placeholder="Image URL or upload local file"
                        value={profileForm.heroImage}
                        onChange={(e) => setProfileForm({ ...profileForm, heroImage: e.target.value })}
                        className="flex-1 bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                      />
                      <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-white/20 rounded cursor-pointer whitespace-nowrap">
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => setProfileForm({ ...profileForm, heroImage: url }))
                          }
                        />
                      </label>
                    </div>

                    {profileForm.heroImage && (
                      <div className="mt-3 aspect-[16/9] max-w-sm overflow-hidden bg-neutral-900 border border-white/10">
                        <img
                          src={profileForm.heroImage}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: PROFILE & BIO ================= */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white uppercase">
                      Profile, Bio & Vision
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Kelola latar belakang artistik, manifesto kreatif, jejak karir (milestones), spesifikasi, dan keahlian.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1.5">
                      Bio Summary
                    </label>
                    <textarea
                      rows={2}
                      value={profileForm.bioSummary}
                      onChange={(e) => setProfileForm({ ...profileForm, bioSummary: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* Full Bio Paragraphs with individual delete and add */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs uppercase font-mono-code text-neutral-400">
                        Full Biography Paragraphs ({profileForm.fullBio.length} Paragraf)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setProfileForm({
                            ...profileForm,
                            fullBio: [...profileForm.fullBio, 'Paragraf biografi baru...']
                          });
                        }}
                        className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Paragraf</span>
                      </button>
                    </div>

                    {profileForm.fullBio.map((paragraph, pIdx) => (
                      <div key={pIdx} className="flex gap-2 items-start bg-neutral-900 p-2 border border-white/10">
                        <span className="text-xs font-mono-code text-neutral-500 pt-2 w-6">#{pIdx + 1}</span>
                        <textarea
                          rows={2}
                          value={paragraph}
                          onChange={(e) => {
                            const updated = [...profileForm.fullBio];
                            updated[pIdx] = e.target.value;
                            setProfileForm({ ...profileForm, fullBio: updated });
                          }}
                          className="flex-1 bg-black border border-white/10 p-2 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            const updated = profileForm.fullBio.filter((_, i) => i !== pIdx);
                            setProfileForm({ ...profileForm, fullBio: updated });
                            showToast(`Paragraf #${pIdx + 1} berhasil dihapus`);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer mt-1"
                          title="Hapus paragraf ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1.5">
                      Creative Vision Quote
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.creativeVision}
                      onChange={(e) => setProfileForm({ ...profileForm, creativeVision: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1.5">
                      Personal Background
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.personalBackground}
                      onChange={(e) => setProfileForm({ ...profileForm, personalBackground: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  {/* Portrait Image */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs uppercase font-mono-code text-neutral-400">
                        Portrait Image (About Section)
                      </label>
                      {profileForm.portraitImage && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setProfileForm({ ...profileForm, portraitImage: '' });
                            showToast('Foto portrait dikosongkan. Klik "Simpan Perubahan" untuk menerapkan.');
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-mono-code cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <input
                        type="text"
                        value={profileForm.portraitImage}
                        onChange={(e) => setProfileForm({ ...profileForm, portraitImage: e.target.value })}
                        className="flex-1 bg-neutral-900 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                      />
                      <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-white/20 rounded cursor-pointer whitespace-nowrap">
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => setProfileForm({ ...profileForm, portraitImage: url }))
                          }
                        />
                      </label>
                    </div>

                    {profileForm.portraitImage && (
                      <div className="mt-3 aspect-[3/4] max-w-[160px] overflow-hidden bg-neutral-900 border border-white/10">
                        <img
                          src={profileForm.portraitImage}
                          alt="Portrait Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Career Journey Milestones with Delete and Add */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs uppercase font-mono-code text-neutral-400">
                        Career Journey Milestones (Jejak Karir di Halaman About)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setProfileForm({
                            ...profileForm,
                            careerJourney: [
                              ...profileForm.careerJourney,
                              { year: '2026', milestone: 'Milestone Baru', description: 'Deskripsi pencapaian karir...' }
                            ]
                          });
                        }}
                        className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Milestone</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {profileForm.careerJourney.map((step, sIdx) => (
                        <div key={sIdx} className="p-3 bg-neutral-900 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <input
                              type="text"
                              value={step.year}
                              placeholder="Tahun"
                              onChange={(e) => {
                                const updated = [...profileForm.careerJourney];
                                updated[sIdx].year = e.target.value;
                                setProfileForm({ ...profileForm, careerJourney: updated });
                              }}
                              className="w-24 bg-black border border-white/20 px-2.5 py-1.5 text-xs text-white font-mono-code"
                            />
                            <input
                              type="text"
                              value={step.milestone}
                              placeholder="Judul Milestone"
                              onChange={(e) => {
                                const updated = [...profileForm.careerJourney];
                                updated[sIdx].milestone = e.target.value;
                                setProfileForm({ ...profileForm, careerJourney: updated });
                              }}
                              className="flex-1 bg-black border border-white/20 px-2.5 py-1.5 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                const updated = profileForm.careerJourney.filter((_, i) => i !== sIdx);
                                setProfileForm({ ...profileForm, careerJourney: updated });
                                showToast(`Milestone tahun ${step.year} dihapus`);
                              }}
                              className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                              title="Hapus Milestone ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={step.description}
                            placeholder="Deskripsi rincian milestone..."
                            onChange={(e) => {
                              const updated = [...profileForm.careerJourney];
                              updated[sIdx].description = e.target.value;
                              setProfileForm({ ...profileForm, careerJourney: updated });
                            }}
                            className="w-full bg-black border border-white/20 px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disciplines with individual delete and add */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs uppercase font-mono-code text-neutral-400">
                        Disciplines & Mastery (Daftar Disiplin di Profil)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setProfileForm({
                            ...profileForm,
                            disciplines: [...profileForm.disciplines, 'Disiplin Baru']
                          });
                        }}
                        className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Disiplin</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {profileForm.disciplines.map((disc, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2">
                          <span className="text-xs font-mono-code text-neutral-500 w-6">0{dIdx + 1}</span>
                          <input
                            type="text"
                            value={disc}
                            onChange={(e) => {
                              const updated = [...profileForm.disciplines];
                              updated[dIdx] = e.target.value;
                              setProfileForm({ ...profileForm, disciplines: updated });
                            }}
                            className="flex-1 bg-neutral-900 border border-white/15 px-3 py-1.5 text-sm text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              const updated = profileForm.disciplines.filter((_, i) => i !== dIdx);
                              setProfileForm({ ...profileForm, disciplines: updated });
                              showToast(`Disiplin "${disc}" dihapus`);
                            }}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                            title="Hapus disiplin ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specs with individual delete and add */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs uppercase font-mono-code text-neutral-400">
                        Specifications & Dossier (Spesifikasi di Kartu Profil)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setProfileForm({
                            ...profileForm,
                            specs: [...profileForm.specs, { label: 'Spesifikasi Baru', value: 'Keterangan' }]
                          });
                        }}
                        className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Spec</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {profileForm.specs.map((spec, spIdx) => (
                        <div key={spIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={spec.label}
                            placeholder="Label (e.g. Active Era)"
                            onChange={(e) => {
                              const updated = [...profileForm.specs];
                              updated[spIdx].label = e.target.value;
                              setProfileForm({ ...profileForm, specs: updated });
                            }}
                            className="w-1/3 bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-neutral-300 font-mono-code"
                          />
                          <input
                            type="text"
                            value={spec.value}
                            placeholder="Nilai (e.g. 2026 — Present)"
                            onChange={(e) => {
                              const updated = [...profileForm.specs];
                              updated[spIdx].value = e.target.value;
                              setProfileForm({ ...profileForm, specs: updated });
                            }}
                            className="flex-1 bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              const updated = profileForm.specs.filter((_, i) => i !== spIdx);
                              setProfileForm({ ...profileForm, specs: updated });
                              showToast(`Spesifikasi "${spec.label}" dihapus`);
                            }}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                            title="Hapus spesifikasi ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: GALLERY ================= */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-white/10">
                  <h3 className="font-display text-xl font-bold text-white uppercase">
                    Gallery Management & Updates
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Tambah, edit/perbarui, atau hapus foto beresolusi tinggi, editorial spread, atau video visualizer. Setiap penghapusan langsung terhapus dari tampilan website.
                  </p>
                </div>

                {/* EDITING MODAL / FORM IF SELECTED */}
                {editingGallery && (
                  <div className="p-6 bg-neutral-900 border-2 border-white/40 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono-code uppercase tracking-wider text-white font-bold">
                          Edit & Update Gallery Archive: {editingGallery.title}
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingGallery(null)}
                        className="p-1 text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateGallery} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingGallery.title}
                            onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Category *
                          </label>
                          <select
                            value={editingGallery.category}
                            onChange={(e) =>
                              setEditingGallery({
                                ...editingGallery,
                                category: e.target.value as GalleryCategory
                              })
                            }
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          >
                            <option value="photoshoot">Official Photoshoot</option>
                            <option value="editorial">Editorial Photos</option>
                            <option value="bts">Behind The Scenes</option>
                            <option value="event">Event Documentation</option>
                            <option value="video">Video Gallery</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Image URL or Upload *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={editingGallery.image}
                            onChange={(e) => setEditingGallery({ ...editingGallery, image: e.target.value })}
                            className="flex-1 bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                          <label className="flex items-center gap-1.5 px-3 py-2 text-xs bg-neutral-800 text-white rounded cursor-pointer whitespace-nowrap">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Ganti File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (url) => setEditingGallery({ ...editingGallery, image: url }))
                              }
                            />
                          </label>
                        </div>
                      </div>

                      {editingGallery.category === 'video' && (
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Video Stream URL (MP4 / WebM)
                          </label>
                          <input
                            type="text"
                            value={editingGallery.videoUrl || ''}
                            onChange={(e) => setEditingGallery({ ...editingGallery, videoUrl: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Production Credits
                          </label>
                          <input
                            type="text"
                            value={editingGallery.credits || ''}
                            onChange={(e) => setEditingGallery({ ...editingGallery, credits: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            value={editingGallery.year}
                            onChange={(e) => setEditingGallery({ ...editingGallery, year: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingGallery.description || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                          className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Simpan Pembaruan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingGallery(null)}
                          className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Add New Gallery Item Form */}
                <form onSubmit={handleCreateGallery} className="p-6 bg-black border border-white/15 space-y-4">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 block">
                    Upload / Tambah Arsip Galeri Baru
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Paris Fashion Week Noir"
                        value={newGallery.title}
                        onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Category *
                      </label>
                      <select
                        value={newGallery.category}
                        onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as GalleryCategory })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      >
                        <option value="photoshoot">Official Photoshoot</option>
                        <option value="editorial">Editorial Photos</option>
                        <option value="bts">Behind The Scenes</option>
                        <option value="event">Event Documentation</option>
                        <option value="video">Video Gallery</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Image URL or Upload *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Direct image URL or upload below"
                        value={newGallery.image}
                        onChange={(e) => setNewGallery({ ...newGallery, image: e.target.value })}
                        className="flex-1 bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                      <label className="flex items-center gap-1.5 px-3 py-2 text-xs bg-neutral-800 text-white rounded cursor-pointer whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => setNewGallery({ ...newGallery, image: url }))
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {newGallery.category === 'video' && (
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Video Stream URL (MP4 / WebM)
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newGallery.videoUrl}
                        onChange={(e) => setNewGallery({ ...newGallery, videoUrl: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Production Credits
                      </label>
                      <input
                        type="text"
                        placeholder="Photography: Name · Styling: Agency"
                        value={newGallery.credits}
                        onChange={(e) => setNewGallery({ ...newGallery, credits: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={newGallery.year}
                        onChange={(e) => setNewGallery({ ...newGallery, year: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publikasikan Item Galeri</span>
                  </button>
                </form>

                {/* List of existing gallery items */}
                <div className="space-y-3">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 block">
                    Daftar Arsip Galeri Aktif ({gallery.length}) — Klik Tong Sampah untuk langsung menghapus dari web
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-neutral-900 border border-white/10 flex items-center justify-between gap-3 hover:border-white/30 transition-colors"
                      >
                        <div className="w-12 h-12 bg-neutral-800 shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                          <span className="text-[10px] text-neutral-500 font-mono-code">{item.categoryLabel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              setEditingGallery(item);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit / Perbarui arsip ini"
                          >
                            <Edit3 className="w-4 h-4 text-emerald-400" />
                          </button>
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              deleteGalleryItem(item.id);
                              showToast(`Arsip "${item.title}" langsung dihapus dari website!`);
                            }}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                            title="Hapus langsung dari website"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: PROJECTS ================= */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-white/10">
                  <h3 className="font-display text-xl font-bold text-white uppercase">
                    Projects & Activities Management
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Tambah, edit, atau hapus agenda tur arena, album musik, kolaborasi fesyen. Item yang dihapus langsung hilang dari halaman depan website.
                  </p>
                </div>

                {/* EDITING PROJECT FORM */}
                {editingProject && (
                  <div className="p-6 bg-neutral-900 border-2 border-white/40 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono-code uppercase tracking-wider text-white font-bold">
                          Edit & Update Proyek: {editingProject.title}
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="p-1 text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateProject} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Category *
                          </label>
                          <select
                            value={editingProject.category}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                category: e.target.value as ProjectCategory
                              })
                            }
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          >
                            <option value="upcoming">Upcoming Projects</option>
                            <option value="current">Current Activities</option>
                            <option value="previous">Previous Projects</option>
                            <option value="collaboration">Collaborations</option>
                            <option value="appearance">Special Appearances</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Role Artist
                          </label>
                          <input
                            type="text"
                            value={editingProject.role}
                            onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Release Date / Window
                          </label>
                          <input
                            type="text"
                            value={editingProject.releaseDate}
                            onChange={(e) => setEditingProject({ ...editingProject, releaseDate: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Cover Image URL or Upload *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={editingProject.coverImage}
                            onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                            className="flex-1 bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                          <label className="flex items-center gap-1.5 px-3 py-2 text-xs bg-neutral-800 text-white rounded cursor-pointer whitespace-nowrap">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Ganti File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (url) => setEditingProject({ ...editingProject, coverImage: url }))
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Summary *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={editingProject.summary}
                          onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                          className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Details (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.details || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, details: e.target.value })}
                          className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Tags (Pisahkan dengan koma)
                        </label>
                        <input
                          type="text"
                          value={editingProject.tags.join(', ')}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                            })
                          }
                          className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Simpan Pembaruan Proyek</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* New Project Form */}
                <form onSubmit={handleCreateProject} className="p-6 bg-black border border-white/15 space-y-4">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 block">
                    Registrasi Proyek Artist Baru
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. WORLD TOUR NOCTURNE"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Category *
                      </label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value as ProjectCategory })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      >
                        <option value="upcoming">Upcoming Projects</option>
                        <option value="current">Current Activities</option>
                        <option value="previous">Previous Projects</option>
                        <option value="collaboration">Collaborations</option>
                        <option value="appearance">Special Appearances</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Artist Role
                      </label>
                      <input
                        type="text"
                        placeholder="Headliner & Executive Director"
                        value={newProject.role}
                        onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Release Date / Window
                      </label>
                      <input
                        type="text"
                        placeholder="Q4 2026 / October 2026"
                        value={newProject.releaseDate}
                        onChange={(e) => setNewProject({ ...newProject, releaseDate: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Cover Image *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Image URL or upload"
                        value={newProject.coverImage}
                        onChange={(e) => setNewProject({ ...newProject, coverImage: e.target.value })}
                        className="flex-1 bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                      <label className="flex items-center gap-1.5 px-3 py-2 text-xs bg-neutral-800 text-white rounded cursor-pointer whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => setNewProject({ ...newProject, coverImage: url }))
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Summary *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Ringkasan ruang lingkup proyek..."
                      value={newProject.summary}
                      onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Tags (Pisahkan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Arena Tour, Live, Album"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Daftarkan Proyek</span>
                  </button>
                </form>

                {/* Existing projects list */}
                <div className="space-y-3">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 block">
                    Daftar Proyek Terdaftar ({projects.length}) — Klik Tong Sampah untuk langsung menghapus dari web
                  </span>
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 bg-neutral-900 border border-white/10 flex items-center justify-between gap-4 hover:border-white/30 transition-colors"
                    >
                      <div className="w-16 h-12 bg-neutral-800 shrink-0 overflow-hidden">
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{p.title}</h4>
                        <span className="text-xs text-neutral-400">{p.categoryLabel} · {p.releaseDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            setEditingProject(p);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Edit / Perbarui proyek ini"
                        >
                          <Edit3 className="w-4 h-4 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            deleteProject(p.id);
                            showToast(`Proyek "${p.title}" langsung dihapus dari website!`);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                          title="Hapus langsung dari website"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: NEWS ================= */}
            {activeTab === 'news' && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-white/10">
                  <h3 className="font-display text-xl font-bold text-white uppercase">
                    News & Editorial Press
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Publikasikan dan perbarui siaran pers resmi. Item yang dihapus langsung hilang dari halaman depan website.
                  </p>
                </div>

                {/* EDITING NEWS FORM */}
                {editingNews && (
                  <div className="p-6 bg-neutral-900 border-2 border-white/40 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono-code uppercase tracking-wider text-white font-bold">
                          Edit & Update Rilisan Berita: {editingNews.title}
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingNews(null)}
                        className="p-1 text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateNews} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Headline Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingNews.title}
                            onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Media Outlet / Source
                          </label>
                          <input
                            type="text"
                            value={editingNews.outlet}
                            onChange={(e) => setEditingNews({ ...editingNews, outlet: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={editingNews.category}
                            onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                            Date
                          </label>
                          <input
                            type="text"
                            value={editingNews.date}
                            onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                            className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Cover Image URL or Upload *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={editingNews.coverImage}
                            onChange={(e) => setEditingNews({ ...editingNews, coverImage: e.target.value })}
                            className="flex-1 bg-black border border-white/20 px-3 py-2 text-sm text-white"
                          />
                          <label className="flex items-center gap-1.5 px-3 py-2 text-xs bg-neutral-800 text-white rounded cursor-pointer whitespace-nowrap">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Ganti File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (url) => setEditingNews({ ...editingNews, coverImage: url }))
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Excerpt *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={editingNews.excerpt}
                          onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                          className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                          Full Article Body *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={editingNews.content}
                          onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                          className="w-full bg-black border border-white/20 px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Simpan Pembaruan Berita</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNews(null)}
                          className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Add News Form */}
                <form onSubmit={handleCreateNews} className="p-6 bg-black border border-white/15 space-y-4">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 block">
                    Publikasikan Siaran Berita Baru
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Headline Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. KIM EL Mengumumkan Tanggal Tur Stadium"
                        value={newNews.title}
                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Media Outlet / Source
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VOGUE / OFFICIAL PRESS"
                        value={newNews.outlet}
                        onChange={(e) => setNewNews({ ...newNews, outlet: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        placeholder="World Tour, Cover, Album"
                        value={newNews.category}
                        onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        value={newNews.date}
                        onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Cover Image *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Image URL or upload"
                        value={newNews.coverImage}
                        onChange={(e) => setNewNews({ ...newNews, coverImage: e.target.value })}
                        className="flex-1 bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                      />
                      <label className="flex items-center gap-1.5 px-3 py-2 text-xs bg-neutral-800 text-white rounded cursor-pointer whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => setNewNews({ ...newNews, coverImage: url }))
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Excerpt *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Paragraf pengantar / ringkasan..."
                      value={newNews.excerpt}
                      onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Full Article Body *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Isi lengkap siaran pers..."
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publikasikan Rilisan Berita</span>
                  </button>
                </form>

                {/* Existing news */}
                <div className="space-y-3">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 block">
                    Daftar Berita Terbit ({news.length}) — Klik Tong Sampah untuk langsung menghapus dari web
                  </span>
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-neutral-900 border border-white/10 flex items-center justify-between gap-4 hover:border-white/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                        <span className="text-xs text-neutral-400">{item.outlet} · {item.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            setEditingNews(item);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Edit / Perbarui berita ini"
                        >
                          <Edit3 className="w-4 h-4 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            deleteNews(item.id);
                            showToast(`Berita "${item.title}" langsung dihapus dari website!`);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                          title="Hapus langsung dari website"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: SOCIALS & AGENCY ================= */}
            {activeTab === 'socials' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white uppercase">
                      Agency, Management & Social Links
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Perbarui kontak resmi manajemen artis, kantor perwakilan, dan tautan platform streaming.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.management.agency}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          management: { ...profileForm.management, agency: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Division
                    </label>
                    <input
                      type="text"
                      value={profileForm.management.division}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          management: { ...profileForm.management, division: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Headquarters
                    </label>
                    <input
                      type="text"
                      value={profileForm.management.headquarters}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          management: { ...profileForm.management, headquarters: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      General Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.management.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          management: { ...profileForm.management, email: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Booking Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.management.bookingEmail}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          management: { ...profileForm.management, bookingEmail: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Press Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.management.pressEmail}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          management: { ...profileForm.management, pressEmail: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.socials.instagram}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, instagram: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Spotify URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.socials.spotify}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, spotify: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.socials.youtube}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, youtube: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Apple Music URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.socials.appleMusic}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, appleMusic: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      X / Twitter URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.socials.twitter}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, twitter: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      TikTok URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.socials.tiktok}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, tiktok: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: INQUIRIES ================= */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/10">
                  <h3 className="font-display text-xl font-bold text-white uppercase">
                    Transmitted Inquiries Log ({inquiries.length})
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Log pesan dan kontak kemitraan bisnis yang dikirimkan oleh publik melalui formulir situs web.
                  </p>
                </div>

                {inquiries.length === 0 ? (
                  <div className="py-16 text-center border border-white/10 bg-neutral-900/30">
                    <Mail className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm text-neutral-400">Belum ada pesan masuk dari formulir kontak.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-5 bg-black border border-white/10 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
                          <span className="text-white font-bold bg-white/10 px-2.5 py-0.5 rounded">
                            {inq.inquiryType}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-500">{new Date(inq.timestamp).toLocaleString()}</span>
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                deleteInquiry(inq.id);
                                showToast('Pesan berhasil dihapus!');
                              }}
                              className="text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 p-1 rounded transition-colors cursor-pointer"
                              title="Hapus pesan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-neutral-200 font-semibold">
                          {inq.name} {inq.company && `(${inq.company})`} —{' '}
                          <a href={`mailto:${inq.email}`} className="text-neutral-400 hover:text-white underline font-normal">
                            {inq.email}
                          </a>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed font-light pt-2 border-t border-white/5">
                          "{inq.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB: ACCOUNT & SECURITY ================= */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-white/10">
                  <h3 className="font-display text-xl font-bold text-white uppercase">
                    Akun Admin & Keamanan
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Ubah kata sandi login dashboard, kelola akun admin, dan lakukan cadangan data situs.
                  </p>
                </div>

                {/* Current session info */}
                <div className="p-5 bg-black border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {user?.name || 'Administrator'} ({user?.username})
                      </div>
                      <div className="text-xs text-neutral-400 font-mono-code">
                        Peran: {user?.role || 'Official Admin'} · Status: Aktif
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 rounded transition-colors cursor-pointer w-fit"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Sekarang</span>
                  </button>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleUpdateCreds} className="p-6 bg-neutral-900 border border-white/15 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-white font-bold">
                    <KeyRound className="w-4 h-4 text-white" />
                    <span>Perbarui Kata Sandi / Password Admin</span>
                  </div>

                  {credMsg && (
                    <div
                      className={`p-3 text-xs rounded flex items-center gap-2 ${
                        credMsg.type === 'success'
                          ? 'bg-emerald-950/70 border border-emerald-600 text-emerald-300'
                          : 'bg-rose-950/70 border border-rose-600 text-rose-300'
                      }`}
                    >
                      {credMsg.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      )}
                      <span>{credMsg.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Username Admin
                      </label>
                      <input
                        type="text"
                        required
                        value={credForm.newUsername}
                        onChange={(e) => setCredForm({ ...credForm, newUsername: e.target.value })}
                        className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Nama Tampilan Pengelola
                      </label>
                      <input
                        type="text"
                        value={credForm.newName}
                        onChange={(e) => setCredForm({ ...credForm, newName: e.target.value })}
                        className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                      Kata Sandi Saat Ini (Current Password) *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Masukkan kata sandi lama"
                      value={credForm.currentPassword}
                      onChange={(e) => setCredForm({ ...credForm, currentPassword: e.target.value })}
                      className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Kata Sandi Baru *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Minimal 4 karakter"
                        value={credForm.newPassword}
                        onChange={(e) => setCredForm({ ...credForm, newPassword: e.target.value })}
                        className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono-code text-neutral-400 mb-1">
                        Konfirmasi Kata Sandi Baru *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Ulangi kata sandi baru"
                        value={credForm.confirmPassword}
                        onChange={(e) => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                        className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Perbarui Password</span>
                  </button>
                </form>

                {/* Backup & Restore Data */}
                <div className="p-6 bg-black border border-white/15 space-y-4">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 block">
                    Cadangan & Pemulihan Basis Data (Backup & Restore)
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    Anda dapat mencadangkan seluruh data konten website (profil, galeri, proyek, dan berita) ke dalam file JSON, atau memulihkan data dari file cadangan sebelumnya.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-white/20 rounded cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Backup JSON</span>
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-white/20 rounded cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Import Restore JSON</span>
                      <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={handleImport}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* CLOUD DATABASE & REALTIME MULTI-DEVICE SYNC TAB */}
            {activeTab === 'cloud' && (
              <div className="space-y-8 max-w-4xl">
                <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white uppercase flex items-center gap-2.5">
                      <Database className="w-5 h-5 text-cyan-400" />
                      <span>Cloud Database (Sinkronisasi Multi-Perangkat)</span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-light mt-1">
                      Setiap foto, teks, atau item yang Anda ubah/hapus di laptop langsung otomatis ter-update di handphone dan pengunjung lain secara real-time.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={handleSyncAllToCloud}
                      disabled={isSyncing}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)] font-bold"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Menyinkronkan...' : 'Kirim Semua Data ke Cloud'}</span>
                    </button>
                  </div>
                </div>

                {/* Status Connection Card */}
                <div className={`p-6 rounded-lg border ${
                  isCloudConnected
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-neutral-900/50 border-white/10'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3.5 h-3.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                          {isCloudConnected ? 'Status: Terhubung ke Cloud Database' : 'Status: Belum Terhubung (Mode Lokal)'}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1">
                          {isCloudConnected
                            ? `Sinkronisasi real-time aktif pada project "${cloudConfig?.projectId || 'Firebase'}". Setiap perubahan langsung broadcast ke semua handphone & laptop.`
                            : 'Data saat ini hanya tersimpan di memori browser lokal perangkat ini. Hubungkan Firebase untuk sinkronisasi otomatis antar-perangkat.'}
                        </p>
                      </div>
                    </div>

                    {isCloudConnected && (
                      <button
                        onClick={handleDisconnectCloud}
                        className="text-xs text-rose-400 hover:text-rose-300 underline font-mono-code cursor-pointer"
                      >
                        Putuskan Sambungan
                      </button>
                    )}
                  </div>
                </div>

                {/* Setup Form */}
                <div className="p-6 bg-neutral-900/40 border border-white/10 rounded-lg space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-2">
                      Konfigurasi Firebase Firestore
                    </h4>
                    <p className="text-xs text-neutral-400 font-light">
                      Tempel langsung kode objek <code className="text-cyan-300 font-mono">firebaseConfig</code> dari Firebase Console di bawah ini, lalu klik Simpan:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-mono-code mb-1.5">
                        JSON / Kode Konfigurasi Firebase:
                      </label>
                      <textarea
                        value={firebaseJsonInput}
                        onChange={(e) => setFirebaseJsonInput(e.target.value)}
                        placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "kimel-web.firebaseapp.com",\n  "projectId": "kimel-web",\n  "storageBucket": "kimel-web.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "1:..."\n}`}
                        rows={8}
                        className="w-full px-3 py-2 text-xs font-mono-code bg-black/80 border border-white/15 focus:border-cyan-400 focus:outline-none rounded text-neutral-200"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleSaveFirebaseConfig}
                        disabled={isSyncing || !firebaseJsonInput.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 disabled:opacity-40 rounded transition-all cursor-pointer font-bold"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan & Hubungkan Database</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Panduan Bergambar / Langkah Cepat */}
                <div className="p-6 bg-black/60 border border-white/10 rounded-lg space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Panduan 3 Menit: Cara Membuat Firebase Gratis</span>
                  </h4>
                  <ol className="space-y-3 text-xs text-neutral-300 list-decimal list-inside leading-relaxed font-light">
                    <li>
                      Buka <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-mono">console.firebase.google.com</a> dan login menggunakan akun Google Anda.
                    </li>
                    <li>
                      Klik <strong>"Add project"</strong> (Tambah proyek) &rarr; beri nama misal <code className="text-neutral-200">kimel-web</code> &rarr; lanjutkan sampai selesai.
                    </li>
                    <li>
                      Di menu sebelah kiri, pilih <strong>Build &rarr; Firestore Database</strong> &rarr; klik <strong>Create database</strong> &rarr; pilih lokasi (misal <em>asia-southeast2</em>) &rarr; pilih <strong>Start in test mode</strong> &rarr; klik <strong>Create</strong>.
                    </li>
                    <li>
                      Klik ikon <strong>Settings ⚙️</strong> di sebelah kiri atas &rarr; <strong>Project settings</strong> &rarr; scroll ke bawah ke bagian <em>"Your apps"</em> &rarr; klik ikon Web <strong>&lt;/&gt;</strong> &rarr; daftarkan nama web.
                    </li>
                    <li>
                      Salin (copy) kode di dalam <code className="text-cyan-300 font-mono">const firebaseConfig = &#123; ... &#125;;</code> lalu tempelkan ke kolom form di atas, kemudian klik <strong>"Simpan & Hubungkan Database"</strong>.
                    </li>
                  </ol>
                  <div className="pt-2 text-[11px] text-emerald-400 font-mono-code bg-emerald-950/30 p-3 rounded border border-emerald-900/50">
                    ✨ Begitu tersambung, Anda tidak perlu setting apa-apa lagi! Setiap kali Anda mengganti foto atau menghapus konten di dashboard ini, seluruh HP dan pengunjung yang sedang membuka website akan ter-update detik itu juga secara otomatis!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
