import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc, type Firestore, type Unsubscribe } from 'firebase/firestore';
import type { ArtistProfile, GalleryItem, ProjectItem, NewsItem, InquirySubmission } from '../types';

export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  databaseURL?: string;
}

export interface SitePayload {
  profile?: ArtistProfile;
  gallery?: GalleryItem[];
  projects?: ProjectItem[];
  news?: NewsItem[];
  inquiries?: InquirySubmission[];
  updatedAt?: string;
  updatedBy?: string;
}

const STORAGE_CONFIG_KEY = 'kimel_firebase_config';

class CloudService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private unsubscribeSnapshot: Unsubscribe | null = null;
  private isConnected = false;
  private listeners: ((connected: boolean) => void)[] = [];

  constructor() {
    this.autoConnect();
  }

  public getConfig(): FirebaseConfig | null {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      // Check Vite env
      if (import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY) {
        return {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
        };
      }
    } catch (e) {
      console.warn('Failed to parse Firebase config', e);
    }
    return null;
  }

  public saveConfig(config: FirebaseConfig | null) {
    if (config) {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(STORAGE_CONFIG_KEY);
    }
    this.disconnect();
    if (config) {
      this.connect(config);
    }
  }

  public onStatusChange(callback: (connected: boolean) => void): () => void {
    this.listeners.push(callback);
    callback(this.isConnected);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyStatus(status: boolean) {
    this.isConnected = status;
    this.listeners.forEach(cb => cb(status));
  }

  public isCloudActive(): boolean {
    return this.isConnected;
  }

  private autoConnect() {
    const config = this.getConfig();
    if (config && config.projectId && config.apiKey) {
      this.connect(config).catch(err => {
        console.warn('Auto-connect to Firebase failed:', err);
      });
    }
  }

  public async connect(config: FirebaseConfig): Promise<boolean> {
    try {
      this.disconnect();

      const appName = 'kimel-artist-app';
      if (getApps().some(a => a.name === appName)) {
        this.app = getApp(appName);
      } else {
        this.app = initializeApp(config, appName);
      }

      this.db = getFirestore(this.app);
      this.notifyStatus(true);
      return true;
    } catch (error) {
      console.error('Firebase connection error:', error);
      this.notifyStatus(false);
      throw error;
    }
  }

  public disconnect() {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
      this.unsubscribeSnapshot = null;
    }
    this.app = null;
    this.db = null;
    this.notifyStatus(false);
  }

  public subscribeToUpdates(onData: (data: SitePayload) => void): () => void {
    if (!this.db) {
      const unsubscribeStatus = this.onStatusChange((connected) => {
        if (connected && this.db && !this.unsubscribeSnapshot) {
          this.setupSnapshot(onData);
        }
      });
      return () => {
        unsubscribeStatus();
        if (this.unsubscribeSnapshot) {
          this.unsubscribeSnapshot();
          this.unsubscribeSnapshot = null;
        }
      };
    }

    this.setupSnapshot(onData);

    return () => {
      if (this.unsubscribeSnapshot) {
        this.unsubscribeSnapshot();
        this.unsubscribeSnapshot = null;
      }
    };
  }

  private setupSnapshot(onData: (data: SitePayload) => void) {
    if (!this.db) return;
    try {
      const docRef = doc(this.db, 'kimel_site', 'content');
      this.unsubscribeSnapshot = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as SitePayload;
            onData(data);
          }
        },
        (error) => {
          console.warn('Snapshot listener warning:', error);
        }
      );
    } catch (e) {
      console.warn('Could not setup snapshot:', e);
    }
  }

  public async pushAllToCloud(payload: SitePayload): Promise<boolean> {
    if (!this.db) {
      const config = this.getConfig();
      if (!config) throw new Error('Database Online belum dikonfigurasi.');
      await this.connect(config);
    }
    if (!this.db) throw new Error('Koneksi Firestore gagal.');

    const docRef = doc(this.db, 'kimel_site', 'content');
    const cleanPayload: SitePayload = {
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin Web'
    };

    await setDoc(docRef, cleanPayload, { merge: true });
    return true;
  }

  public async fetchInitialData(): Promise<SitePayload | null> {
    if (!this.db) return null;
    try {
      const docRef = doc(this.db, 'kimel_site', 'content');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as SitePayload;
      }
    } catch (e) {
      console.warn('Failed to fetch initial cloud data', e);
    }
    return null;
  }
}

export const cloudService = new CloudService();
