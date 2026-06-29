export type PlatformType = 'tiktok' | 'reels' | 'shorts' | 'shopee';

export interface OverlaySettings {
  showComments: boolean;
  showControls: boolean;
  showHeader: boolean;
  showProductCard: boolean;
  showSafeZone: boolean;
  safeZoneOpacity: number;
}

export interface TextSticker {
  id: string;
  text: string;
  color: string;
  backgroundColor: string;
  fontSize: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontWeight: 'normal' | 'bold';
  borderRadius: number;
  padding: number;
  opacity?: number; // percentage 0-100
  fontFamily?: string;
  scale?: number; // percentage 50-200
  rotation?: number; // degrees -180 to 180
  motionPreset?: 'none' | 'float' | 'spin' | 'shake' | 'pulse' | 'slide';
  motionSpeed?: number; // speed multiplier 0.1 to 3
  motionIntensity?: number; // intensity modifier 0 to 100
  motionEasing?: 'ease-in-out' | 'linear' | 'elastic' | 'bounce';
}

export interface BackgroundImage {
  id: string;
  url: string; // base64 data URI or CDN preset URL
  prompt?: string;
  modelUsed?: string;
  timestamp: number;
  isPreset?: boolean;
}

export interface PromptPreset {
  id: string;
  name: string;
  category: string;
  prompt: string;
  accentColor: string;
}
