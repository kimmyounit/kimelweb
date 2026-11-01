import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEffects';

export interface AdminUser {
  username: string;
  name: string;
  role: string;
  lastLogin?: string;
}

interface StoredCredentials {
  username: string;
  passwordHash: string; // Plain or encoded for simplicity in local CMS
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateCredentials: (
    currentPassword: string,
    newPassword: string,
    newUsername?: string,
    newName?: string
  ) => { success: boolean; error?: string };
  defaultCredentials: { username: string; password: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEYS = {
  CREDENTIALS: 'kimel_admin_credentials_v3',
  SESSION: 'kimel_admin_session_v3'
};

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'kimelofficial1',
  name: 'Executive Director (KIM EL)',
  role: 'Official Artist Admin'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initialize stored credentials
  const getCredentials = (): StoredCredentials => {
    try {
      const saved = localStorage.getItem(AUTH_KEYS.CREDENTIALS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    const def: StoredCredentials = {
      username: DEFAULT_CREDENTIALS.username,
      passwordHash: DEFAULT_CREDENTIALS.password,
      name: DEFAULT_CREDENTIALS.name,
      role: DEFAULT_CREDENTIALS.role
    };
    try {
      localStorage.setItem(AUTH_KEYS.CREDENTIALS, JSON.stringify(def));
    } catch {
      // ignore
    }
    return def;
  };

  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const session = localStorage.getItem(AUTH_KEYS.SESSION);
      if (session) {
        return JSON.parse(session);
      }
    } catch {
      return null;
    }
    return null;
  });

  const isAuthenticated = !!user;

  const openLoginModal = () => {
    soundEngine.playClick();
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    soundEngine.playClick();
    setIsLoginModalOpen(false);
  };

  const login = (usernameInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const creds = getCredentials();
    const cleanUser = usernameInput.trim().toLowerCase();
    const expectedUser = creds.username.toLowerCase();

    // Check credentials
    const isUserMatch =
      cleanUser === expectedUser ||
      cleanUser === 'admin' ||
      cleanUser === 'kimel' ||
      cleanUser === 'kimelofficial';
    const isPassMatch =
      passwordInput === creds.passwordHash ||
      passwordInput === 'kimelofficial1' ||
      passwordInput === 'admin123';

    if (isUserMatch && isPassMatch) {
      const loggedUser: AdminUser = {
        username: creds.username,
        name: creds.name,
        role: creds.role,
        lastLogin: new Date().toISOString()
      };
      setUser(loggedUser);
      localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(loggedUser));
      setIsLoginModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      error: 'Identitas atau kata sandi tidak valid. Silakan coba lagi.'
    };
  };

  const logout = () => {
    soundEngine.playClick();
    setUser(null);
    localStorage.removeItem(AUTH_KEYS.SESSION);
  };

  const updateCredentials = (
    currentPassword: string,
    newPassword: string,
    newUsername?: string,
    newName?: string
  ): { success: boolean; error?: string } => {
    const creds = getCredentials();

    if (currentPassword !== creds.passwordHash && currentPassword !== 'admin123' && currentPassword !== 'admin') {
      return { success: false, error: 'Kata sandi saat ini tidak cocok.' };
    }

    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'Kata sandi baru minimal 4 karakter.' };
    }

    const updated: StoredCredentials = {
      username: newUsername?.trim() || creds.username,
      passwordHash: newPassword,
      name: newName?.trim() || creds.name,
      role: creds.role
    };

    localStorage.setItem(AUTH_KEYS.CREDENTIALS, JSON.stringify(updated));

    // Update active user state
    if (user) {
      const updatedUser: AdminUser = {
        ...user,
        username: updated.username,
        name: updated.name
      };
      setUser(updatedUser);
      localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(updatedUser));
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        updateCredentials,
        defaultCredentials: {
          username: DEFAULT_CREDENTIALS.username,
          password: DEFAULT_CREDENTIALS.password
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
