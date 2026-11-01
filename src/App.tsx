/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProfileSection } from './components/ProfileSection';
import { GallerySection } from './components/GallerySection';
import { ProjectsSection } from './components/ProjectsSection';
import { NewsSection } from './components/NewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MediaModal } from './components/MediaModal';
import { LoginModal } from './components/LoginModal';
import { AdminDashboard } from './components/AdminDashboard';

const MainApp: React.FC = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { setIsAdminOpen } = useData();

  useEffect(() => {
    // 1. Secret shortcut: Ctrl+Shift+L or Alt+L
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) ||
        (e.altKey && (e.key === 'L' || e.key === 'l'))
      ) {
        e.preventDefault();
        if (isAuthenticated) {
          setIsAdminOpen(true);
        } else {
          openLoginModal();
        }
      }
    };

    // 2. Secret URL: #admin, #login, /admin, /dashboard
    const handleRouteTrigger = () => {
      const isRouteMatch =
        window.location.hash === '#admin' ||
        window.location.hash === '#login' ||
        window.location.pathname.toLowerCase().startsWith('/admin') ||
        window.location.pathname.toLowerCase().startsWith('/dashboard');

      if (isRouteMatch) {
        if (isAuthenticated) {
          setIsAdminOpen(true);
        } else {
          openLoginModal();
        }
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleRouteTrigger);
    window.addEventListener('popstate', handleRouteTrigger);
    handleRouteTrigger();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleRouteTrigger);
      window.removeEventListener('popstate', handleRouteTrigger);
    };
  }, [isAuthenticated, openLoginModal, setIsAdminOpen]);

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content flow */}
      <main className="flex-1 w-full flex flex-col">
        {/* Section 00: Hero & Brand Impression */}
        <Hero />

        {/* Section 01: About Kim El */}
        <AboutSection />

        {/* Section 02: Artist Profile Dossier */}
        <ProfileSection />

        {/* Section 03: Visual Monograph & Gallery */}
        <GallerySection />

        {/* Section 04: Projects & Activities */}
        <ProjectsSection />

        {/* Section 05: News & Editorial Dispatches */}
        <NewsSection />

        {/* Section 06: Official Liaison & Contact */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Fullscreen Lightbox & Reader */}
      <MediaModal />

      {/* Secure Admin Login Portal */}
      <LoginModal />

      {/* Official Artist & Management CMS */}
      <AdminDashboard />
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </DataProvider>
  );
}
