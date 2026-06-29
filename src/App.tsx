import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Layers,
  Settings,
  Image as ImageIcon,
  Download,
  Type,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Info,
  Heart,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  X,
  Check,
  Search,
  ChevronDown,
  RotateCcw,
  Sliders,
  Sparkle,
  Upload,
  User,
  Share2,
  Video,
  MoreHorizontal,
  Bookmark,
  ChevronRight,
  Tv,
  ShieldCheck,
  Palette,
  Compass,
  LayoutGrid,
  Undo2,
  Redo2,
  Activity,
  Monitor,
  Smartphone,
  Tablet,
  RotateCw,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import {
  PlatformType,
  OverlaySettings,
  TextSticker,
  BackgroundImage,
  PromptPreset
} from './types';
import { PRESETS, CATEGORIES, FALLBACK_IMAGES } from './templates';

export const getFontFamilyCSS = (font?: string) => {
  switch (font) {
    case 'Inter':
      return '"Inter", sans-serif';
    case 'Playfair Display':
      return '"Playfair Display", serif';
    case 'JetBrains Mono':
      return '"JetBrains Mono", monospace';
    case 'Syne':
      return '"Syne", sans-serif';
    case 'Bebas Neue':
      return '"Bebas Neue", sans-serif';
    case 'Montserrat':
      return '"Montserrat", sans-serif';
    case 'Cinzel':
      return '"Cinzel", serif';
    case 'Caveat':
      return '"Caveat", cursive';
    case 'Lobster':
      return '"Lobster", cursive';
    case 'Pacifico':
      return '"Pacifico", cursive';
    case 'Bungee':
      return '"Bungee", sans-serif';
    case 'Clash Display':
      return '"Clash Display", sans-serif';
    case 'Satoshi':
      return '"Satoshi", sans-serif';
    case 'Cabinet Grotesk':
      return '"Cabinet Grotesk", sans-serif';
    case 'Melodrama':
      return '"Melodrama", serif';
    case 'Press Start 2P':
      return '"Press Start 2P", monospace';
    case 'Special Elite':
      return '"Special Elite", serif';
    case 'Creepster':
      return '"Creepster", cursive';
    case 'Luckiest Guy':
      return '"Luckiest Guy", cursive';
    case 'Orbitron':
      return '"Orbitron", sans-serif';
    case 'Outfit':
    default:
      return '"Outfit", sans-serif';
  }
};

export function getEasedProgress(t: number, easing: 'ease-in-out' | 'linear' | 'elastic' | 'bounce' = 'ease-in-out'): number {
  const normTime = t % 1;
  switch (easing) {
    case 'linear':
      return normTime;
    case 'elastic': {
      const x = normTime * 2 - 1; // map to -1 to 1
      const p = 0.4;
      const spring = Math.pow(2, -10 * Math.abs(x)) * Math.sin((Math.abs(x) - p/4) * (2 * Math.PI) / p);
      return x < 0 ? (spring - 1) / 2 + 0.5 : (1 - spring) / 2 + 0.5;
    }
    case 'bounce': {
      const x = normTime * 2 - 1; // map to -1 to 1
      const bounceVal = 1 - Math.abs(Math.cos(x * Math.PI * 1.5) * (1 - Math.abs(x)));
      return bounceVal;
    }
    case 'ease-in-out':
    default:
      return normTime < 0.5 ? 4 * normTime * normTime * normTime : 1 - Math.pow(-2 * normTime + 2, 3) / 2;
  }
}

export const ALL_FONTS = [
  { value: 'Outfit', name: 'Outfit (Display Sans)', category: 'Google Fonts' },
  { value: 'Inter', name: 'Inter (Clean Sans)', category: 'Google Fonts' },
  { value: 'Playfair Display', name: 'Playfair Display (Serif)', category: 'Google Fonts' },
  { value: 'Bebas Neue', name: 'Bebas Neue (Impact Sans)', category: 'Google Fonts' },
  { value: 'Montserrat', name: 'Montserrat (Geometric Sans)', category: 'Google Fonts' },
  { value: 'Syne', name: 'Syne (Eccentric Display)', category: 'Google Fonts' },
  { value: 'Cinzel', name: 'Cinzel (Roman Serif)', category: 'Google Fonts' },
  { value: 'Clash Display', name: 'Clash Display (Modern Sans)', category: 'Fontshare' },
  { value: 'Satoshi', name: 'Satoshi (Grotesque Sans)', category: 'Fontshare' },
  { value: 'Cabinet Grotesk', name: 'Cabinet Grotesk (Chunky Sans)', category: 'Fontshare' },
  { value: 'Melodrama', name: 'Melodrama (Display Serif)', category: 'Fontshare' },
  { value: 'Press Start 2P', name: 'Press Start 2P (Arcade Pixel)', category: 'Dafont / Creative' },
  { value: 'Orbitron', name: 'Orbitron (Sci-Fi Tech)', category: 'Dafont / Creative' },
  { value: 'Special Elite', name: 'Special Elite (Typewriter)', category: 'Dafont / Creative' },
  { value: 'Luckiest Guy', name: 'Luckiest Guy (Comic / Bold)', category: 'Dafont / Creative' },
  { value: 'Caveat', name: 'Caveat (Handwritten)', category: 'Dafont / Creative' },
  { value: 'Lobster', name: 'Lobster (Retro Script)', category: 'Dafont / Creative' },
  { value: 'Pacifico', name: 'Pacifico (Vintage Beach)', category: 'Dafont / Creative' },
  { value: 'Bungee', name: 'Bungee (Urban Blocks)', category: 'Dafont / Creative' },
  { value: 'JetBrains Mono', name: 'JetBrains Mono (Developer Mono)', category: 'Dafont / Creative' }
];

const getNormalizedLayerOrder = (currentStickers: TextSticker[], currentOrder: string[]) => {
  const stickerIds = new Set(currentStickers.map(s => s.id));
  const filteredOrder = currentOrder.filter(id => id === 'background' || stickerIds.has(id));
  const existingIdsInOrder = new Set(filteredOrder);
  const missingIds = currentStickers.filter(s => !existingIdsInOrder.has(s.id)).map(s => s.id);
  return [...missingIds, ...filteredOrder];
};

export default function App() {
  const [fontSearchQuery, setFontSearchQuery] = useState<string>('');
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState<boolean>(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [videoRecordingProgress, setVideoRecordingProgress] = useState<number>(0);
  // State for AI Image Generation
  const [prompt, setPrompt] = useState<string>(PRESETS[0].prompt);
  const [model, setModel] = useState<string>('gemini-3.1-flash-image');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Editing vs New Generation Mode
  const [editorMode, setEditorMode] = useState<'new' | 'refine'>('new');
  const [refinePrompt, setRefinePrompt] = useState<string>('Make the lighting warmer and add subtle decorative lights');

  // Background and Gallery state
  const [activeBg, setActiveBg] = useState<BackgroundImage>({
    id: PRESETS[0].id,
    url: FALLBACK_IMAGES[PRESETS[0].id],
    prompt: PRESETS[0].prompt,
    timestamp: Date.now(),
    isPreset: true
  });
  
  const [gallery, setGallery] = useState<BackgroundImage[]>(
    PRESETS.map(preset => ({
      id: preset.id,
      url: FALLBACK_IMAGES[preset.id] || FALLBACK_IMAGES['beauty-pink'],
      prompt: preset.prompt,
      timestamp: Date.now(),
      isPreset: true
    }))
  );

  // Selected Preset state for styling sidebar highlights
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Presets');

  // Interactive Live Platform State
  const [platform, setPlatform] = useState<PlatformType>('tiktok');
  
  const [overlaySettings, setOverlaySettings] = useState<OverlaySettings>({
    showComments: true,
    showControls: true,
    showHeader: true,
    showProductCard: true,
    showSafeZone: true,
    safeZoneOpacity: 65
  });

  // Filter Adjustments state
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(105);
  const [blur, setBlur] = useState<number>(0);
  const [vignette, setVignette] = useState<boolean>(false);

  // After Effects Motion Engine states
  const [bgMotionPreset, setBgMotionPreset] = useState<'none' | 'zoom' | 'drift' | 'swivel' | 'pulse' | 'pan' | 'glitch'>('zoom');
  const [bgMotionSpeed, setBgMotionSpeed] = useState<number>(1.0);
  const [bgMotionIntensity, setBgMotionIntensity] = useState<number>(40);
  const [bgMotionEasing, setBgMotionEasing] = useState<'linear' | 'ease-in-out' | 'ease-in' | 'ease-out'>('ease-in-out');
  const [sidebarTab, setSidebarTab] = useState<'render' | 'motion'>('motion');
  const [selectedLayer, setSelectedLayer] = useState<string>('background');
  const [previewProgress, setPreviewProgress] = useState<number>(0);

  // Design Mockup / Preview states
  const [previewTab, setPreviewTab] = useState<'live_stream' | 'device_mockup'>('device_mockup');
  const [mockupCategory, setMockupCategory] = useState<'apple_phone' | 'android_phone' | 'android_tablet' | 'ipad' | 'desktop'>('apple_phone');
  const [mockupOrientation, setMockupOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showBleedGuides, setShowBleedGuides] = useState<boolean>(true);

  // 3D Rendering Engine Parameters (Unreal Engine emulation)
  const [globalIllumination, setGlobalIllumination] = useState<number>(85);
  const [subsurfaceScattering, setSubsurfaceScattering] = useState<number>(40);
  const [antiHdrSoftening, setAntiHdrSoftening] = useState<number>(100);
  const [ambientOcclusion, setAmbientOcclusion] = useState<number>(75);

  // Active color palette highlight theme
  const [activePalette, setActivePalette] = useState<string>('pastel-pink-blue');

  // Text Stickers state
  const [stickers, setStickers] = useState<TextSticker[]>([
    {
      id: 'sticker-1',
      text: '🔥 FLASH SALE 50% OFF',
      color: '#ffffff',
      backgroundColor: '#ef4444',
      fontSize: 22,
      x: 50,
      y: 33,
      fontWeight: 'bold',
      borderRadius: 8,
      padding: 10,
      opacity: 100,
      fontFamily: 'Outfit',
      scale: 100,
      rotation: 0,
      motionPreset: 'pulse',
      motionSpeed: 1.2,
      motionIntensity: 40
    },
    {
      id: 'sticker-2',
      text: 'CODE: LIVESTUDIO',
      color: '#000000',
      backgroundColor: '#fef08a',
      fontSize: 17,
      x: 50,
      y: 40,
      fontWeight: 'bold',
      borderRadius: 6,
      padding: 8,
      opacity: 100,
      fontFamily: 'JetBrains Mono',
      scale: 100,
      rotation: -3,
      motionPreset: 'float',
      motionSpeed: 0.8,
      motionIntensity: 30
    }
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>('sticker-1');
  const [newStickerText, setNewStickerText] = useState<string>('Tap Link Below ⬇️');

  // Canva-inspired Desktop Publisher Layout Settings
  const [showToolsPanel, setShowToolsPanel] = useState<boolean>(true); // Left panel (Scene Templates & generator)
  const [showPropertiesPanel, setShowPropertiesPanel] = useState<boolean>(true); // Right panel parameters (sliders & styles)
  const [showLayersPanel, setShowLayersPanel] = useState<boolean>(true); // Right panel bottom (Layers List)
  const [showPathsPanel, setShowPathsPanel] = useState<boolean>(true); // Safe zone overlays, aspect bleed maps
  const [showColorsPanel, setShowColorsPanel] = useState<boolean>(true); // Color palette swatches & active palettes
  const [fullViewMode, setFullViewMode] = useState<boolean>(false); // Hides side panels for immersive workspace view
  const [leftSidebarWidth, setLeftSidebarWidth] = useState<number>(288); // Drag resizable Left Sidebar
  const [rightSidebarWidth, setRightSidebarWidth] = useState<number>(310); // Drag resizable Right Sidebar
  const [activeMenuDropdown, setActiveMenuDropdown] = useState<'file' | 'edit' | 'view' | 'window' | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false); // Active dragging indicator to prevent lag

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuDropdown(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Layer Order State (Z-Index Hierarchy: first element is on top/front-most, last is at the bottom/back-most)
  const [layerOrder, setLayerOrder] = useState<string[]>(['sticker-1', 'sticker-2', 'background']);

  const activeOrder = getNormalizedLayerOrder(stickers, layerOrder);

  const getZIndex = (layerId: string) => {
    const index = activeOrder.indexOf(layerId);
    if (index === -1) return 1;
    // Map index so that first item in activeOrder gets highest zIndex
    return (activeOrder.length - index) * 10;
  };

  const handleReorderLayers = (newOrder: string[]) => {
    setLayerOrder(newOrder);
    recordState(undefined, undefined, newOrder);
  };

  // Drag resizer handlers for sidebars
  const startLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = leftSidebarWidth;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      setLeftSidebarWidth(Math.max(200, Math.min(450, startWidth + deltaX)));
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const startRightResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = rightSidebarWidth;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX; // Resizing right sidebar pulls from the left edge of the sidebar
      setRightSidebarWidth(Math.max(240, Math.min(500, startWidth + deltaX)));
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Hearts Floating effect in Mobile Canvas
  const [hearts, setHearts] = useState<{ id: number; left: number; color: string; scale: number }[]>([]);
  const heartIdCounter = useRef(0);

  // Render credit counter placeholder (Professional Polish Theme)
  const [renderCredits, setRenderCredits] = useState<number>(1240);

  // History state for Undo/Redo
  interface HistoryItem {
    stickers: TextSticker[];
    layerOrder: string[];
    globalIllumination: number;
    subsurfaceScattering: number;
    antiHdrSoftening: number;
    ambientOcclusion: number;
    vignette: boolean;
    blur: number;
  }

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      stickers: [
        {
          id: 'sticker-1',
          text: '🔥 FLASH SALE 50% OFF',
          color: '#ffffff',
          backgroundColor: '#ef4444',
          fontSize: 22,
          x: 50,
          y: 33,
          fontWeight: 'bold',
          borderRadius: 8,
          padding: 10,
          opacity: 100,
          fontFamily: 'Outfit'
        },
        {
          id: 'sticker-2',
          text: 'CODE: LIVESTUDIO',
          color: '#000000',
          backgroundColor: '#fef08a',
          fontSize: 17,
          x: 50,
          y: 40,
          fontWeight: 'bold',
          borderRadius: 6,
          padding: 8,
          opacity: 100,
          fontFamily: 'JetBrains Mono'
        }
      ],
      layerOrder: ['sticker-1', 'sticker-2', 'background'],
      globalIllumination: 85,
      subsurfaceScattering: 40,
      antiHdrSoftening: 100,
      ambientOcclusion: 75,
      vignette: false,
      blur: 0
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const recordState = (
    nextStickers?: TextSticker[],
    nextFilters?: {
      globalIllumination?: number;
      subsurfaceScattering?: number;
      antiHdrSoftening?: number;
      ambientOcclusion?: number;
      vignette?: boolean;
      blur?: number;
    },
    nextLayerOrder?: string[]
  ) => {
    setHistory(prevHistory => {
      const currentItem = historyIndex >= 0 && historyIndex < prevHistory.length 
        ? prevHistory[historyIndex] 
        : {
            stickers: stickers,
            layerOrder: layerOrder,
            globalIllumination: globalIllumination,
            subsurfaceScattering: subsurfaceScattering,
            antiHdrSoftening: antiHdrSoftening,
            ambientOcclusion: ambientOcclusion,
            vignette: vignette,
            blur: blur
          };

      const nextItem: HistoryItem = {
        stickers: nextStickers !== undefined ? nextStickers : stickers,
        layerOrder: nextLayerOrder !== undefined ? nextLayerOrder : layerOrder,
        globalIllumination: nextFilters?.globalIllumination !== undefined ? nextFilters.globalIllumination : globalIllumination,
        subsurfaceScattering: nextFilters?.subsurfaceScattering !== undefined ? nextFilters.subsurfaceScattering : subsurfaceScattering,
        antiHdrSoftening: nextFilters?.antiHdrSoftening !== undefined ? nextFilters.antiHdrSoftening : antiHdrSoftening,
        ambientOcclusion: nextFilters?.ambientOcclusion !== undefined ? nextFilters.ambientOcclusion : ambientOcclusion,
        vignette: nextFilters?.vignette !== undefined ? nextFilters.vignette : vignette,
        blur: nextFilters?.blur !== undefined ? nextFilters.blur : blur,
      };

      // Prevent duplicate history entries
      const last = prevHistory[historyIndex];
      if (last &&
          JSON.stringify(last.stickers) === JSON.stringify(nextItem.stickers) &&
          JSON.stringify(last.layerOrder) === JSON.stringify(nextItem.layerOrder) &&
          last.globalIllumination === nextItem.globalIllumination &&
          last.subsurfaceScattering === nextItem.subsurfaceScattering &&
          last.antiHdrSoftening === nextItem.antiHdrSoftening &&
          last.ambientOcclusion === nextItem.ambientOcclusion &&
          last.vignette === nextItem.vignette &&
          last.blur === nextItem.blur) {
        return prevHistory;
      }

      const newHistory = prevHistory.slice(0, historyIndex + 1);
      setHistoryIndex(newHistory.length);
      return [...newHistory, nextItem];
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const state = history[prevIndex];
      if (state) {
        setStickers(state.stickers);
        setLayerOrder(state.layerOrder || ['sticker-1', 'sticker-2', 'background']);
        setGlobalIllumination(state.globalIllumination);
        setSubsurfaceScattering(state.subsurfaceScattering);
        setAntiHdrSoftening(state.antiHdrSoftening);
        setAmbientOcclusion(state.ambientOcclusion);
        setVignette(state.vignette);
        setBlur(state.blur);
        setHistoryIndex(prevIndex);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const state = history[nextIndex];
      if (state) {
        setStickers(state.stickers);
        setLayerOrder(state.layerOrder || ['sticker-1', 'sticker-2', 'background']);
        setGlobalIllumination(state.globalIllumination);
        setSubsurfaceScattering(state.subsurfaceScattering);
        setAntiHdrSoftening(state.antiHdrSoftening);
        setAmbientOcclusion(state.ambientOcclusion);
        setVignette(state.vignette);
        setBlur(state.blur);
        setHistoryIndex(nextIndex);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      );

      if (isInput && activeEl?.getAttribute('type') === 'text') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key?.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key?.toLowerCase() === 'z') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex]);

  // Status message rotation for AI Loader
  useEffect(() => {
    if (!isGenerating) return;
    const messages = [
      'Booting Gemini Creative Engine v3.1...',
      'Analyzing screen layouts & safe bleed guidelines...',
      'Synthesizing Unreal Engine 3D lightmaps...',
      'Rendering colorful studio soft shadows...',
      'Optimizing contrast palette for comfortable viewing...',
      'Polishing custom objects to ensure copyright uniqueness...'
    ];
    let index = 0;
    setStatusMessage(messages[0]);
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setStatusMessage(messages[index]);
    }, 3500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Floating hearts cycle to simulate active stream interaction
  useEffect(() => {
    const interval = setInterval(() => {
      const colors = ['#6366f1', '#ec4899', '#3b82f6', '#a855f7', '#f43f5e', '#10b981'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newHeart = {
        id: heartIdCounter.current++,
        left: 35 + Math.random() * 55, // float elegantly in the guide areas
        color: randomColor,
        scale: 0.6 + Math.random() * 0.7
      };
      setHearts(prev => [...prev.slice(-12), newHeart]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Real-time animation progress for visual graph editor playhead
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    
    const update = (now: number) => {
      // Create a repeating progress loop
      setPreviewProgress((prev) => {
        const delta = (now - lastTime) / 2000; // Complete a loop cycle every 2 seconds
        lastTime = now;
        return (prev + delta) % 1;
      });
      frameId = requestAnimationFrame(update);
    };
    
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Sync rendering sliders directly with active screen filter adjustments to feel interactive!
  useEffect(() => {
    // Map Unreal Engine settings to traditional contrast, brightness, and blur
    const baseBrightness = 80 + (globalIllumination * 0.4);
    const baseContrast = 75 + (ambientOcclusion * 0.4);
    const calculatedBlur = blur; // keeps manual blur control
    
    setBrightness(Math.round(baseBrightness));
    setContrast(Math.round(baseContrast));
  }, [globalIllumination, ambientOcclusion, blur]);

  // Handle preset selection
  const handleSelectPreset = (preset: PromptPreset) => {
    setSelectedPresetId(preset.id);
    if (editorMode === 'new') {
      setPrompt(preset.prompt);
    } else {
      setRefinePrompt(`Based on this ${preset.name} theme: ${preset.prompt}`);
    }
    const matchingInGallery = gallery.find(g => g.id === preset.id);
    if (matchingInGallery) {
      setActiveBg(matchingInGallery);
    } else {
      const newPresetBg: BackgroundImage = {
        id: preset.id,
        url: FALLBACK_IMAGES[preset.id] || FALLBACK_IMAGES['beauty-pink'],
        prompt: preset.prompt,
        timestamp: Date.now(),
        isPreset: true
      };
      setActiveBg(newPresetBg);
    }
  };

  // Trigger Gemini API Image Generation via server proxy route
  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const payload = {
        prompt: editorMode === 'new' ? prompt : undefined,
        editPrompt: editorMode === 'refine' ? refinePrompt : undefined,
        originalImage: editorMode === 'refine' ? activeBg.url : undefined,
        model: model
      };

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.details || 'Failed to generate background.');
      }

      const data = await res.json();
      
      const newBg: BackgroundImage = {
        id: `ai-${Date.now()}`,
        url: data.imageUrl,
        prompt: editorMode === 'new' ? prompt : `${activeBg.prompt} | Refined: ${refinePrompt}`,
        modelUsed: data.modelUsed,
        timestamp: Date.now()
      };

      setActiveBg(newBg);
      setGallery(prev => [newBg, ...prev]);
      setSelectedPresetId(''); // clear preset selection highlight
      setRenderCredits(prev => prev + 12); // increment credits used

      if (editorMode === 'refine') {
        setEditorMode('new');
      }

    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'An error occurred during background creation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Custom File Uploader for reference image or custom background
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const uploadedBg: BackgroundImage = {
          id: `upload-${Date.now()}`,
          url: event.target.result as string,
          prompt: `Uploaded Reference: ${file.name}`,
          timestamp: Date.now()
        };
        setActiveBg(uploadedBg);
        setGallery(prev => [uploadedBg, ...prev]);
        setSelectedPresetId('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Add a promotional text sticker
  const handleAddSticker = () => {
    if (!newStickerText.trim()) return;
    const colors = ['#ffffff', '#facc15', '#000000', '#ffffff'];
    const bgs = ['#4f46e5', '#1e293b', '#facc15', '#ef4444'];
    const randomIdx = Math.floor(Math.random() * colors.length);
    
    const newSticker: TextSticker = {
      id: `sticker-${Date.now()}`,
      text: newStickerText,
      color: colors[randomIdx],
      backgroundColor: bgs[randomIdx],
      fontSize: 18,
      x: 50,
      y: 45 + (stickers.length * 5) % 25,
      fontWeight: 'bold',
      borderRadius: 8,
      padding: 9,
      opacity: 100,
      fontFamily: 'Inter',
      scale: 100,
      rotation: 0,
      motionPreset: 'none',
      motionSpeed: 1.0,
      motionIntensity: 50
    };

    const nextStickers = [...stickers, newSticker];
    const nextLayerOrder = [newSticker.id, ...layerOrder];
    setStickers(nextStickers);
    setLayerOrder(nextLayerOrder);
    setSelectedStickerId(newSticker.id);
    setNewStickerText('');
    recordState(nextStickers, undefined, nextLayerOrder);
  };

  // Delete a sticker
  const handleDeleteSticker = (id: string) => {
    const nextStickers = stickers.filter(s => s.id !== id);
    const nextLayerOrder = layerOrder.filter(lid => lid !== id);
    setStickers(nextStickers);
    setLayerOrder(nextLayerOrder);
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
    recordState(nextStickers, undefined, nextLayerOrder);
  };

  // Edit fields of selected sticker
  const updateSelectedSticker = (updates: Partial<TextSticker>) => {
    if (!selectedStickerId) return;
    setStickers(prev => {
      const next = prev.map(s => s.id === selectedStickerId ? { ...s, ...updates } : s);
      return next;
    });
  };

  // Reset Filters & Stickers
  const handleResetCanvas = () => {
    const resetStickers: TextSticker[] = [
      {
        id: 'sticker-1',
        text: '🔥 FLASH SALE 50% OFF',
        color: '#ffffff',
        backgroundColor: '#ef4444',
        fontSize: 22,
        x: 50,
        y: 33,
        fontWeight: 'bold',
        borderRadius: 8,
        padding: 10,
        opacity: 100,
        fontFamily: 'Outfit'
      },
      {
        id: 'sticker-2',
        text: 'CODE: LIVESTUDIO',
        color: '#000000',
        backgroundColor: '#fef08a',
        fontSize: 17,
        x: 50,
        y: 40,
        fontWeight: 'bold',
        borderRadius: 6,
        padding: 8,
        opacity: 100,
        fontFamily: 'JetBrains Mono'
      }
    ];
    const resetLayerOrder = ['sticker-1', 'sticker-2', 'background'];
    setGlobalIllumination(85);
    setSubsurfaceScattering(40);
    setAntiHdrSoftening(100);
    setAmbientOcclusion(75);
    setBlur(0);
    setVignette(false);
    setStickers(resetStickers);
    setLayerOrder(resetLayerOrder);
    setSelectedStickerId('sticker-1');
    recordState(resetStickers, {
      globalIllumination: 85,
      subsurfaceScattering: 40,
      antiHdrSoftening: 100,
      ambientOcclusion: 75,
      blur: 0,
      vignette: false
    }, resetLayerOrder);
  };

  // Export High-Fidelity 1080x1920 Background
  const handleExportDownload = (includeMockOverlays: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.src = activeBg.url;

    img.onload = () => {
      // Order layers from bottom to top (reverse of activeOrder which is top to bottom)
      const renderSequence = [...activeOrder].reverse();

      renderSequence.forEach(layerId => {
        if (layerId === 'background') {
          ctx.save();
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`;
          const imgRatio = img.width / img.height;
          const canvasRatio = 1080 / 1920;
          let drawW = 1080;
          let drawH = 1920;
          let drawX = 0;
          let drawY = 0;

          if (imgRatio > canvasRatio) {
            drawW = 1920 * imgRatio;
            drawX = (1080 - drawW) / 2;
          } else {
            drawH = 1080 / imgRatio;
            drawY = (1920 - drawH) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.filter = 'none';

          if (vignette) {
            const grad = ctx.createRadialGradient(540, 960, 200, 540, 960, 1100);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(1, 'rgba(0,0,0,0.6)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1080, 1920);
          }
          ctx.restore();
        } else {
          const s = stickers.find(st => st.id === layerId);
          if (s) {
            ctx.save();
            const opacity = s.opacity !== undefined ? s.opacity / 100 : 1.0;
            ctx.globalAlpha = opacity;

            const scale = 3;
            const fontSz = s.fontSize * scale;
            const fontFamilyStr = getFontFamilyCSS(s.fontFamily);
            ctx.font = `${s.fontWeight} ${fontSz}px ${fontFamilyStr}`;
            
            const textX = (s.x / 100) * 1080;
            const textY = (s.y / 100) * 1920;
            
            const metrics = ctx.measureText(s.text);
            const textWidth = metrics.width;
            const textHeight = fontSz;

            if (s.backgroundColor && s.backgroundColor !== 'transparent') {
              ctx.fillStyle = s.backgroundColor;
              const padX = s.padding * scale * 1.3;
              const padY = s.padding * scale * 0.9;
              const rx = textX - textWidth / 2 - padX;
              const ry = textY - textHeight / 1.15 - padY;
              const rw = textWidth + padX * 2;
              const rh = textHeight * 1.25 + padY * 2;
              const rad = s.borderRadius * scale;

              ctx.beginPath();
              ctx.roundRect(rx, ry, rw, rh, rad);
              ctx.fill();
            }

            ctx.fillStyle = s.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(s.text, textX, textY);
            ctx.restore();
          }
        }
      });

      if (includeMockOverlays) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(40, 1580, 680, 260);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('@live_studio_preview', 60, 1630);
        ctx.font = '28px "Inter", sans-serif';
        ctx.fillText('This is a simulated Live Shopping guide.', 60, 1680);
        ctx.fillText('Perfect template layout for OBS Broadcaster.', 60, 1730);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.beginPath();
        ctx.roundRect(40, 60, 420, 75, 37);
        ctx.fill();
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(80, 97, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px "Inter", sans-serif';
        ctx.fillText('LIVESCENE 3D STUDIO', 110, 107);
      }

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `livestudio_${platform}_background_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    };

    img.onerror = () => {
      const link = document.createElement('a');
      link.download = `background_fallback.png`;
      link.href = activeBg.url;
      link.click();
    };
  };

  const drawPerfectHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -size / 4);
    // Top-right curve
    ctx.bezierCurveTo(size / 2, -size * 0.7, size, -size * 0.1, 0, size * 0.7);
    // Top-left curve
    ctx.bezierCurveTo(-size, -size * 0.1, -size / 2, -size * 0.7, 0, -size / 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const handleExportVideo = () => {
    if (isRecordingVideo) return;
    setIsRecordingVideo(true);
    setVideoRecordingProgress(0);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsRecordingVideo(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.src = activeBg.url;

    img.onload = () => {
      // Create stream
      const stream = canvas.captureStream(30); // 30 FPS
      
      const mimeTypes = [
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm;codecs=h264',
        'video/webm'
      ];
      
      let selectedType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedType = type;
          break;
        }
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, selectedType ? { mimeType: selectedType } : undefined);
      } catch (err) {
        console.error('Failed to initialize MediaRecorder', err);
        recorder = new MediaRecorder(stream);
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const ext = selectedType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: selectedType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `livestudio_${platform}_loop_${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecordingVideo(false);
        setVideoRecordingProgress(0);
      };

      recorder.start();

      let currentFrame = 0;
      const totalFrames = 120; // 4 seconds at 30 fps

      const intervalId = setInterval(() => {
        if (currentFrame >= totalFrames) {
          clearInterval(intervalId);
          recorder.stop();
          return;
        }

        // Draw Frame
        ctx.clearRect(0, 0, 1080, 1920);

        // 1. Draw Background with Filters & After Effects Motion
        ctx.save();
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`;
        
        // Translate to center of canvas for rotation and scaling
        ctx.translate(540, 960);
        
        let bgScale = 1.0;
        let bgRotate = 0;
        let bgTranslateX = 0;
        let bgTranslateY = 0;

        const angle = (currentFrame / totalFrames) * 2 * Math.PI;
        const speedAdjustedAngle = angle * bgMotionSpeed;

        if (bgMotionPreset === 'zoom') {
          bgScale = 1.0 + (bgMotionIntensity / 100) * 0.15 * (0.5 + 0.5 * Math.sin(speedAdjustedAngle - Math.PI / 2));
        } else if (bgMotionPreset === 'drift') {
          bgScale = 1.08;
          bgTranslateX = Math.cos(speedAdjustedAngle) * (bgMotionIntensity / 100) * 40;
          bgTranslateY = Math.sin(speedAdjustedAngle) * (bgMotionIntensity / 100) * 30;
        } else if (bgMotionPreset === 'swivel') {
          bgScale = 1.08;
          bgRotate = Math.sin(speedAdjustedAngle) * (bgMotionIntensity / 100) * 0.08 * (Math.PI / 180);
        } else if (bgMotionPreset === 'pulse') {
          bgScale = 1.0 + (bgMotionIntensity / 100) * 0.04 * (0.5 + 0.5 * Math.sin(speedAdjustedAngle));
        } else if (bgMotionPreset === 'pan') {
          bgScale = 1.1;
          bgTranslateX = Math.sin(speedAdjustedAngle) * (bgMotionIntensity / 100) * 50;
        } else if (bgMotionPreset === 'glitch') {
          if (currentFrame % 10 < 2) {
            bgTranslateX = (Math.random() - 0.5) * (bgMotionIntensity / 100) * 15;
            bgTranslateY = (Math.random() - 0.5) * (bgMotionIntensity / 100) * 15;
            bgScale = 1.02;
          }
        }

        ctx.translate(bgTranslateX, bgTranslateY);
        ctx.rotate(bgRotate);
        ctx.scale(bgScale, bgScale);

        const imgRatio = img.width / img.height;
        const canvasRatio = 1080 / 1920;
        let drawW = 1080;
        let drawH = 1920;
        let drawX = -540;
        let drawY = -960;

        if (imgRatio > canvasRatio) {
          drawW = 1920 * imgRatio;
          drawX = -drawW / 2;
        } else {
          drawH = 1080 / imgRatio;
          drawY = -drawH / 2;
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        // 2. Vignette
        if (vignette) {
          ctx.save();
          const grad = ctx.createRadialGradient(540, 960, 200, 540, 960, 1100);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(1, 'rgba(0,0,0,0.65)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1080, 1920);
          ctx.restore();
        }

        // 3. Stickers
        stickers.forEach(s => {
          ctx.save();
          const opacity = s.opacity !== undefined ? s.opacity / 100 : 1.0;
          ctx.globalAlpha = opacity;

          const scale = 3;
          const fontSz = s.fontSize * scale;
          const fontFamilyStr = getFontFamilyCSS(s.fontFamily);
          ctx.font = `${s.fontWeight} ${fontSz}px ${fontFamilyStr}`;
          
          const textX = (s.x / 100) * 1080;
          const textY = (s.y / 100) * 1920;
          
          const metrics = ctx.measureText(s.text);
          const textWidth = metrics.width;
          const textHeight = fontSz;

          // Translate to sticker center coordinate
          ctx.translate(textX, textY);

          const motionPres = s.motionPreset ?? 'none';
          const motionSpd = s.motionSpeed ?? 1.0;
          const motionInt = s.motionIntensity ?? 50;
          const motionEas = s.motionEasing ?? 'ease-in-out';
          const staticRot = (s.rotation ?? 0) * Math.PI / 180;
          const staticScale = (s.scale ?? 100) / 100;

          let sScale = staticScale;
          let sRotate = staticRot;
          let sTranslateX = 0;
          let sTranslateY = 0;

          // Compute eased loop progress
          const rawCyclePhase = (angle * 2 * motionSpd) / (2 * Math.PI);
          const easedPhase = getEasedProgress(rawCyclePhase, motionEas);
          const speedAdjustedAngle = easedPhase * 2 * Math.PI;

          if (motionPres === 'float') {
            sTranslateY = -motionInt * 0.12 * Math.sin(speedAdjustedAngle);
            sRotate = staticRot + (motionInt * 0.03 * Math.PI / 180) * Math.sin(speedAdjustedAngle);
          } else if (motionPres === 'spin') {
            sRotate = staticRot + speedAdjustedAngle;
          } else if (motionPres === 'shake') {
            sTranslateX = (Math.sin(speedAdjustedAngle * 3) + Math.cos(speedAdjustedAngle * 5)) * motionInt * 0.03;
            sTranslateY = (Math.cos(speedAdjustedAngle * 4) + Math.sin(speedAdjustedAngle * 7)) * motionInt * 0.03;
            sRotate = staticRot + (Math.sin(speedAdjustedAngle * 2.5) * motionInt * 0.02 * Math.PI / 180);
          } else if (motionPres === 'pulse') {
            sScale = staticScale * (1 + (motionInt / 100) * 0.1 * Math.sin(speedAdjustedAngle));
          } else if (motionPres === 'slide') {
            sTranslateX = motionInt * 0.12 * Math.sin(speedAdjustedAngle);
          }

          ctx.translate(sTranslateX, sTranslateY);
          ctx.rotate(sRotate);
          ctx.scale(sScale, sScale);

          if (s.backgroundColor && s.backgroundColor !== 'transparent') {
            ctx.fillStyle = s.backgroundColor;
            const padX = s.padding * scale * 1.3;
            const padY = s.padding * scale * 0.9;
            const rx = -textWidth / 2 - padX;
            const ry = -textHeight / 1.15 - padY;
            const rw = textWidth + padX * 2;
            const rh = textHeight * 1.25 + padY * 2;
            const rad = s.borderRadius * scale;

            ctx.beginPath();
            ctx.roundRect(rx, ry, rw, rh, rad);
            ctx.fill();
          }

          ctx.fillStyle = s.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(s.text, 0, 0);
          ctx.restore();
        });

        // 4. Platform Header overlays
        if (overlaySettings.showHeader) {
          ctx.save();
          if (platform === 'tiktok') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.roundRect(40, 100, 360, 80, 40);
            ctx.fill();
            
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(80, 140, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('L', 80, 140);
            
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px "Inter", sans-serif';
            ctx.fillText('LiveStyle.co', 120, 130);
            ctx.font = '16px "Inter", sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText('14.2k views', 120, 155);
            
            ctx.fillStyle = '#e11d48';
            ctx.beginPath();
            ctx.roundRect(310, 125, 60, 30, 15);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('LIVE', 340, 140);
          } else if (platform === 'shopee') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.roundRect(40, 100, 380, 80, 40);
            ctx.fill();
            
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.arc(80, 140, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', 80, 140);
            
            ctx.textAlign = 'left';
            ctx.fillStyle = '#fb923c';
            ctx.font = 'bold 20px "Inter", sans-serif';
            ctx.fillText('Shopee Studio', 120, 130);
            ctx.font = '16px "Inter", sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText('🔴 Live | 6k watching', 120, 155);
          } else if (platform === 'reels') {
            const borderGrad = ctx.createLinearGradient(40, 140, 100, 140);
            borderGrad.addColorStop(0, '#f59e0b');
            borderGrad.addColorStop(0.5, '#ec4899');
            borderGrad.addColorStop(1, '#8b5cf6');
            ctx.strokeStyle = borderGrad;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(70, 140, 26, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(70, 140, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('RE', 70, 140);
            
            ctx.textAlign = 'left';
            ctx.font = 'bold 22px "Inter", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('studio_boutique', 115, 135);
            
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.roundRect(115, 150, 50, 22, 4);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('LIVE', 140, 161);
          } else if (platform === 'shorts') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.beginPath();
            ctx.roundRect(40, 100, 260, 60, 8);
            ctx.fill();
            
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(65, 130, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px "Inter", sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('Shorts stream', 85, 130);
          }
          
          // Watching counter
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.roundRect(840, 100, 200, 60, 30);
          ctx.fill();
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.arc(870, 130, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px "Inter", sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          const watchingCount = platform === 'tiktok' ? '12.4k' : platform === 'shopee' ? '8.1k' : platform === 'reels' ? '1.2k' : '3.8k';
          ctx.fillText(`${watchingCount} Watching`, 890, 130);
          
          ctx.restore();
        }

        // 5. Product Showcase Card
        if (overlaySettings.showProductCard && (platform === 'tiktok' || platform === 'shopee')) {
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.roundRect(40, 1400, 800, 110, 16);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(60, 1415, 80, 80, 8);
          ctx.fill();
          
          ctx.fillStyle = '#4f46e5';
          ctx.font = 'bold 28px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛍️', 100, 1455);
          
          ctx.fillStyle = '#4f46e5';
          ctx.beginPath();
          ctx.roundRect(60, 1415, 26, 26, [8, 0, 8, 0]);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px "Inter", sans-serif';
          ctx.fillText('1', 73, 1428);
          
          ctx.textAlign = 'left';
          ctx.textBaseline = 'alphabetic';
          ctx.fillStyle = '#a5b4fc';
          ctx.font = 'bold 16px "Inter", sans-serif';
          ctx.fillText('TODAY PIN', 160, 1445);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px "Inter", sans-serif';
          ctx.fillText('Procedural Glass Cosmetic Bottle', 160, 1472);
          
          ctx.fillStyle = '#34d399';
          ctx.font = 'extrabold 22px "Inter", sans-serif';
          ctx.fillText('$24.00', 160, 1498);
          
          ctx.fillStyle = '#4f46e5';
          ctx.beginPath();
          ctx.roundRect(700, 1432, 100, 46, 10);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Buy', 750, 1455);
          
          ctx.restore();
        }

        // 6. Right-side Controls
        if (overlaySettings.showControls) {
          ctx.save();
          const bx = 980;
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.arc(bx, 1500, 36, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f43f5e';
          drawPerfectHeart(ctx, bx, 1500, 24);
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.arc(bx, 1600, 36, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(bx - 16, 1600 - 12, 32, 24, 6);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(bx - 6, 1600 + 12);
          ctx.lineTo(bx - 12, 1600 + 18);
          ctx.lineTo(bx + 2, 1600 + 12);
          ctx.fill();
          
          const bounceOffset = Math.sin(currentFrame * 0.15) * 8;
          ctx.fillStyle = '#4f46e5';
          ctx.beginPath();
          ctx.arc(bx, 1700 + bounceOffset, 42, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bx, 1700 - 4 + bounceOffset, 12, Math.PI, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.roundRect(bx - 16, 1700 - 2 + bounceOffset, 32, 26, 4);
          ctx.fill();
          
          ctx.restore();
        }

        // 7. Comments section
        if (overlaySettings.showComments) {
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.roundRect(40, 1680, 800, 50, 8);
          ctx.fill();
          ctx.font = 'bold 18px "Inter", sans-serif';
          ctx.fillStyle = '#818cf8';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText('@clara_m: ', 60, 1705);
          ctx.font = '18px "Inter", sans-serif';
          ctx.fillStyle = '#f1f5f9';
          ctx.fillText('Unreal engine quality background looks so high end!', 160, 1705);
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.roundRect(40, 1745, 800, 50, 8);
          ctx.fill();
          ctx.font = 'bold 18px "Inter", sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText('@jason_k: ', 60, 1770);
          ctx.font = '18px "Inter", sans-serif';
          ctx.fillStyle = '#f1f5f9';
          ctx.fillText('Clean non-flat display, awesome colors!', 160, 1770);
          
          ctx.restore();
        }

        // 8. Live Floating Hearts Animations
        const heartsCount = 12;
        const loopFrames = 120;
        const canvasHearts = Array.from({ length: heartsCount }).map((_, i) => {
          const startFrame = (i * (loopFrames / heartsCount)) % loopFrames;
          const speed = 12 + (i % 3) * 3;
          const size = 18 + (i % 4) * 4;
          const amplitude = 30 + (i % 2) * 20;
          const frequency = 0.05 + (i % 3) * 0.02;
          const colors = ['#f43f5e', '#ec4899', '#f43f5e', '#d946ef', '#fb7185', '#fda4af'];
          const color = colors[i % colors.length];
          const xBase = 930 - (i % 3) * 30;
          return { startFrame, speed, size, amplitude, frequency, color, xBase };
        });

        canvasHearts.forEach(h => {
          let age = currentFrame - h.startFrame;
          if (age < 0) {
            age += loopFrames;
          }
          
          const duration = 75;
          if (age < duration) {
            const progress = age / duration;
            const opacity = 1 - progress;
            const y = 1500 - progress * 500;
            const x = h.xBase + Math.sin(age * h.frequency) * h.amplitude * (0.5 + progress * 0.5);
            
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = h.color;
            drawPerfectHeart(ctx, x, y, h.size);
            ctx.restore();
          }
        });

        // 9. Safe Zone indicators
        if (overlaySettings.showSafeZone) {
          ctx.save();
          
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.fillRect(0, 0, 1080, 1920 * 0.15);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 4;
          ctx.setLineDash([12, 12]);
          ctx.beginPath();
          ctx.moveTo(0, 1920 * 0.15);
          ctx.lineTo(1080, 1920 * 0.15);
          ctx.stroke();
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.font = 'bold 22px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚠️ PROFILE & STATS BLEED ZONE', 540, 1920 * 0.08);
          
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.fillRect(0, 1920 * 0.65, 1080, 1920 * 0.35);
          ctx.beginPath();
          ctx.moveTo(0, 1920 * 0.65);
          ctx.lineTo(1080, 1920 * 0.65);
          ctx.stroke();
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.fillText('⚠️ COMMENTS & BUTTONS OVERLAY BLEED', 540, 1920 * 0.82);
          
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.7)';
          ctx.lineWidth = 6;
          ctx.strokeRect(40, 1920 * 0.15 + 20, 1000, 1920 * 0.5 - 40);
          
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.beginPath();
          ctx.roundRect(140, 1920 * 0.35, 800, 140, 20);
          ctx.fill();
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
          ctx.stroke();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✅ LIVE SAFE AREA', 540, 1920 * 0.35 + 40);
          ctx.font = '18px "Inter", sans-serif';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText('Position physical products and custom promotion stickers inside.', 540, 1920 * 0.35 + 90);
          
          ctx.restore();
        }

        currentFrame++;
        setVideoRecordingProgress(Math.min(100, Math.floor((currentFrame / totalFrames) * 100)));
      }, 33.3);
    };

    img.onerror = () => {
      alert('Error loading background image for video capture. Please try again.');
      setIsRecordingVideo(false);
    };
  };

  const filteredPresets = selectedCategory === 'All Presets'
    ? PRESETS
    : PRESETS.filter(p => p.category === selectedCategory);

  // Quick palettes to preview high-contrast branding choices
  const palettes = [
    { id: 'pastel-pink-blue', colors: ['#fbc2eb', '#a6c1ee', '#e1d5e7', '#ffffff'] },
    { id: 'gold-emerald', colors: ['#047857', '#fbbf24', '#064e3b', '#ffffff'] },
    { id: 'cyberpunk-glow', colors: ['#0f172a', '#06b6d4', '#d946ef', '#1e293b'] },
    { id: 'minimalist-beige', colors: ['#f5f5f4', '#e7e5e4', '#d6d3d1', '#fafaf9'] }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Header Navigation in Canva-inspired "Professional Polish" style */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 select-none">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
              <svg className="text-white w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-sm tracking-tight leading-none flex items-center gap-1 font-display">
                LIVESCENE 3D <span className="bg-indigo-50 text-indigo-700 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">Pro</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium">UE5 Background Studio</span>
            </div>
          </div>

          {/* Canva/Figma-style Top Menu Bar Dropdowns */}
          <div className="hidden lg:flex items-center space-x-1 border-l border-slate-200 pl-4 h-8">
            {/* File Menu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'file' ? null : 'file')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  activeMenuDropdown === 'file' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>File</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {activeMenuDropdown === 'file' && (
                <div className="absolute left-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => {
                      handleResetCanvas();
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Reset Workspace</span>
                    <span className="text-[10px] text-slate-400 font-mono">Defaults</span>
                  </button>
                  <label className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer">
                    <span className="font-medium">Upload custom bg...</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { handleLocalImageUpload(e); setActiveMenuDropdown(null); }} />
                    <span className="text-[10px] text-slate-400">Upload</span>
                  </label>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      handleExportDownload(false);
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Download Clean Background</span>
                    <span className="text-[10px] text-slate-400 font-mono">JPG</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportDownload(true);
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Export with Safe Guides</span>
                    <span className="text-[10px] text-indigo-600 font-mono font-semibold">PNG</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportVideo();
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Download Video Loop</span>
                    <span className="text-[10px] text-rose-500 font-semibold font-mono">WEBM</span>
                  </button>
                </div>
              )}
            </div>

            {/* Edit Menu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'edit' ? null : 'edit')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  activeMenuDropdown === 'edit' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Edit</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {activeMenuDropdown === 'edit' && (
                <div className="absolute left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => {
                      undo();
                      setActiveMenuDropdown(null);
                    }}
                    disabled={historyIndex <= 0}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Undo</span>
                    <span className="text-[10px] text-slate-400 font-mono">Ctrl+Z</span>
                  </button>
                  <button
                    onClick={() => {
                      redo();
                      setActiveMenuDropdown(null);
                    }}
                    disabled={historyIndex >= history.length - 1}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Redo</span>
                    <span className="text-[10px] text-slate-400 font-mono">Ctrl+Shift+Z</span>
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      if (selectedStickerId) {
                        handleDeleteSticker(selectedStickerId);
                      }
                      setActiveMenuDropdown(null);
                    }}
                    disabled={!selectedStickerId}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Delete Selected Sticker</span>
                    <span className="text-[10px] text-slate-400 font-mono">Del</span>
                  </button>
                  <button
                    onClick={() => {
                      setStickers([]);
                      setLayerOrder(['background']);
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Clear All Stickers</span>
                  </button>
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'view' ? null : 'view')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  activeMenuDropdown === 'view' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>View</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {activeMenuDropdown === 'view' && (
                <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => {
                      setFullViewMode(!fullViewMode);
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {fullViewMode ? '🟢' : '⚪'} Full-View Mode Only
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-bold font-mono">Esc</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowBleedGuides(!showBleedGuides);
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {showBleedGuides ? '🟢' : '⚪'} Show Bleed Map Guides
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setOverlaySettings(prev => ({ ...prev, showSafeZone: !prev.showSafeZone }));
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {overlaySettings.showSafeZone ? '🟢' : '⚪'} Show Livestream Safes
                    </span>
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace View</div>
                  <button
                    onClick={() => {
                      setPreviewTab('live_stream');
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{previewTab === 'live_stream' ? '●' : '○'} 🎥 Live Stream Layout</span>
                  </button>
                  <button
                    onClick={() => {
                      setPreviewTab('device_mockup');
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{previewTab === 'device_mockup' ? '●' : '○'} 📱 Multi-Device Hub</span>
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      setMockupOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">Rotate Layout Orientation</span>
                    <span className="text-[10px] text-indigo-600 font-bold capitalize">{mockupOrientation}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Window Menu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveMenuDropdown(activeMenuDropdown === 'window' ? null : 'window')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  activeMenuDropdown === 'window' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Window</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {activeMenuDropdown === 'window' && (
                <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toggle Workspace Panels</div>
                  <button
                    onClick={() => setShowToolsPanel(!showToolsPanel)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {showToolsPanel ? '🟢' : '⚪'} Tools Panel (Templates)
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Left</span>
                  </button>
                  <button
                    onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {showPropertiesPanel ? '🟢' : '⚪'} Properties Panel (Sliders)
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Right</span>
                  </button>
                  <button
                    onClick={() => setShowColorsPanel(!showColorsPanel)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {showColorsPanel ? '🟢' : '⚪'} Colors Panel (Palettes)
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Right</span>
                  </button>
                  <button
                    onClick={() => setShowLayersPanel(!showLayersPanel)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {showLayersPanel ? '🟢' : '⚪'} Layers Panel (Z-Index List)
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Right</span>
                  </button>
                  <button
                    onClick={() => setShowPathsPanel(!showPathsPanel)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {showPathsPanel ? '🟢' : '⚪'} Paths Panel (Safe Zone Indicators)
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">Right</span>
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => {
                      setShowToolsPanel(true);
                      setShowPropertiesPanel(true);
                      setShowColorsPanel(true);
                      setShowLayersPanel(true);
                      setShowPathsPanel(true);
                      setFullViewMode(false);
                      setLeftSidebarWidth(288);
                      setRightSidebarWidth(310);
                      setActiveMenuDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-indigo-600 hover:bg-indigo-50 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🔄 Reset Panels Layout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Creative Mode Switcher */}
        <div className="hidden md:flex items-center space-x-3 bg-slate-50 border border-slate-200/80 rounded-xl p-1 shrink-0">
          <button 
            onClick={() => setEditorMode('new')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${editorMode === 'new' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Creative Editor
          </button>
          <button 
            onClick={() => setEditorMode('refine')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${editorMode === 'refine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Refine Prompt
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer transition text-xs font-semibold text-slate-700">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reference Image</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleLocalImageUpload} 
            />
          </label>

          <button
            onClick={() => handleExportDownload(false)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-lg transition text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Clean</span>
          </button>
          
          <button
            onClick={() => handleExportDownload(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition text-xs font-bold shadow-md shadow-indigo-100"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-200" />
            <span>Export with Guides</span>
          </button>

          <button
            onClick={handleExportVideo}
            disabled={isRecordingVideo}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition text-xs font-bold shadow-md ${
              isRecordingVideo
                ? 'bg-rose-500 text-white animate-pulse cursor-not-allowed shadow-rose-100'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-200" />
            <span>{isRecordingVideo ? `Recording (${videoRecordingProgress}%)` : 'Download as Video'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Sidebar: Asset Sources & Templates */}
        <aside 
          style={{ 
            width: showToolsPanel && !fullViewMode ? `${leftSidebarWidth}px` : '0px',
            display: showToolsPanel && !fullViewMode ? 'flex' : 'none'
          }}
          className={`bg-white border-r border-slate-200 flex-col shrink-0 overflow-y-auto relative hidden lg:flex ${isResizing ? '' : 'transition-all duration-150'}`}
        >
          {/* Panel Header with Quick Close Button */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-500 animate-spin-slow" /> Scene Templates
            </span>
            <button 
              onClick={() => setShowToolsPanel(false)}
              className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              title="Hide panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Quick preset selector */}
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-500" /> Curated Scene Templates
            </h3>
            
            {/* Category selection */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2.5 mb-3 border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Template Thumb Grid */}
            <motion.div layout className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-0.5">
              <AnimatePresence mode="popLayout">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <motion.button
                      key={preset.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleSelectPreset(preset)}
                      className={`aspect-[3/4] rounded-lg border-2 overflow-hidden relative group text-left cursor-pointer transition-colors ${
                        isSelected ? 'border-indigo-600 shadow-sm ring-1 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Background Preview */}
                      <div className="absolute inset-0">
                        <img 
                          src={FALLBACK_IMAGES[preset.id]} 
                          alt="" 
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {/* Soft gradient bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex flex-col justify-end p-2 z-10">
                        <span className="text-[8px] font-bold uppercase text-indigo-300 tracking-wider">
                          {preset.category.split(' ')[0]}
                        </span>
                        <h4 className="text-[10px] font-bold text-white tracking-tight line-clamp-1 leading-tight mt-0.5">
                          {preset.name}
                        </h4>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 z-20">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* AI Generator In-Sidebar Box */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" /> AI Render Command
              </span>
              <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">100% Unique</span>
            </div>

            {editorMode === 'new' ? (
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A warm cosmetics vanity studio with smooth plaster walls, wooden shelves, premium warm ambient lighting..."
                rows={4}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-slate-700 leading-relaxed font-sans"
              />
            ) : (
              <textarea
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                placeholder="e.g., Make background darker wood, add soft glowing warm fairy lights..."
                rows={4}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-indigo-800 leading-relaxed font-sans"
              />
            )}

            {/* Model & Button */}
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="text-[10px] p-1.5 border border-slate-200 rounded bg-white font-medium text-slate-600 max-w-[120px]"
              >
                <option value="gemini-3.1-flash-image">Gemini 3.1 (Aesthetic)</option>
                <option value="gemini-2.5-flash-image">Gemini 2.5 (Fast)</option>
              </select>

              <button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition shadow-sm flex items-center gap-1 justify-center cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>{editorMode === 'new' ? 'Synthesize' : 'Refine'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Status updates */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2.5 p-2.5 bg-slate-900 text-white rounded-lg text-[10px] flex flex-col gap-1 shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                    <span className="font-bold text-[9px] uppercase tracking-wider text-indigo-400">UNREAL RENDER</span>
                  </div>
                  <p className="font-light text-slate-300 leading-tight">{statusMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Source Integration list from "Professional Polish" */}
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Verified License Pools
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-100 transition">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 bg-orange-500 rounded text-[10px] font-bold text-white flex items-center justify-center">As</div>
                  <span className="font-medium">Adobe Stock Connected</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="API Status: Connected"></span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-100 transition">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 bg-blue-500 rounded text-[10px] font-bold text-white flex items-center justify-center">Fe</div>
                  <span className="font-medium">Freepik Vector Elements</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-100 transition">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 bg-red-600 rounded text-[10px] font-bold text-white flex items-center justify-center">Pi</div>
                  <span className="font-medium">Pinterest Aesthetic Pins</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-400" title="API Status: Limited Sync"></span>
              </div>
            </div>
          </div>

          {/* Render credits remaining block */}
          <div className="mt-auto p-4 border-t border-slate-100">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
              <span>Scene Render Credits</span>
              <span className="font-mono">{renderCredits} / 5,000</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-500" 
                style={{ width: `${(renderCredits / 5000) * 100}%` }}
              ></div>
            </div>
          </div>
        </aside>

        {/* Left Sidebar Drag Resize Handle */}
        {showToolsPanel && !fullViewMode && (
          <div 
            onMouseDown={startLeftResize}
            className="hidden lg:block w-1.5 hover:w-2.5 bg-slate-200 hover:bg-indigo-400 active:bg-indigo-600 cursor-col-resize transition-all shrink-0 h-full relative z-30 group select-none"
            title="Drag to resize left sidebar (Canva style)"
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              <div className="w-0.5 h-6 bg-white rounded-full shadow-xs" />
            </div>
          </div>
        )}

        {/* Center Canvas View: Dynamic Stage with Livestream Simulation & Device Mockup Hub */}
        <main className="flex-1 bg-slate-100 p-4 md:p-6 flex flex-col items-center justify-between relative overflow-hidden min-h-[600px] select-none">
          
          {/* Immersive blurred backdrop */}
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none blur-3xl scale-110">
            <img 
              src={activeBg.url} 
              alt="" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Top Control Panel - High-Fidelity Glassmorphism Mode Selector */}
          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-md border border-slate-200/80 flex flex-col gap-3 z-30 relative">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              {/* Studio Mode Selector */}
              <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setPreviewTab('live_stream')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${previewTab === 'live_stream' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>🎥 Live Stream Overlays</span>
                </button>
                <button
                  onClick={() => setPreviewTab('device_mockup')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${previewTab === 'device_mockup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>📱 Multi-Device Mockup Hub</span>
                </button>
              </div>

              {/* Status Header */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physics Status</span>
                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Aspect Ratio Safe (No Distortion)
                </span>
              </div>
            </div>

            {/* Sub-controls specifically for multi-device mockup testing */}
            {previewTab === 'device_mockup' && (
              <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                {/* Device Selector buttons */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase mr-1">Device:</span>
                  <button
                    onClick={() => setMockupCategory('apple_phone')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${mockupCategory === 'apple_phone' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <span>🍏 Apple Phone</span>
                  </button>
                  <button
                    onClick={() => setMockupCategory('android_phone')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${mockupCategory === 'android_phone' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <span>🤖 Android Phone</span>
                  </button>
                  <button
                    onClick={() => setMockupCategory('ipad')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${mockupCategory === 'ipad' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <span>📱 iPad Pro</span>
                  </button>
                  <button
                    onClick={() => setMockupCategory('android_tablet')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${mockupCategory === 'android_tablet' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <span>📟 Android Tablet</span>
                  </button>
                  <button
                    onClick={() => setMockupCategory('desktop')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${mockupCategory === 'desktop' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <span>🖥️ Desktop Monitor</span>
                  </button>
                </div>

                {/* Orientation & Guides Switches */}
                <div className="flex items-center gap-3">
                  {/* Rotation Selector */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setMockupOrientation('portrait')}
                      title="Set Portrait Mode"
                      className={`p-1 rounded-md transition ${mockupOrientation === 'portrait' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <span className="text-[10px] font-bold px-1.5 flex items-center gap-1">↕️ Portrait</span>
                    </button>
                    <button
                      onClick={() => setMockupOrientation('landscape')}
                      title="Set Landscape Mode"
                      className={`p-1 rounded-md transition ${mockupOrientation === 'landscape' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <span className="text-[10px] font-bold px-1.5 flex items-center gap-1">↔️ Landscape</span>
                    </button>
                  </div>

                  {/* Bleed toggle switch */}
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-600 hover:text-slate-800">
                    <input 
                      type="checkbox" 
                      checked={showBleedGuides} 
                      onChange={(e) => setShowBleedGuides(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span>🩺 Bleed Map</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Centered Viewing Stage Viewport */}
          <div className="relative z-10 flex-1 flex items-center justify-center w-full py-4 min-h-[400px]">
            
            {/* TAB 1: Live Stream Simulated iPhone Layout */}
            {previewTab === 'live_stream' ? (
              <div className="relative animate-in zoom-in-95 duration-200">
                {/* Smartphone Frame - High Fidelity Shadow & Size */}
                <div 
                  className="relative aspect-[9/16] w-[310px] md:w-[325px] h-[550px] md:h-[570px] bg-black rounded-[40px] shadow-2xl border-[8px] border-slate-800 overflow-hidden select-none transition-all duration-300"
                  style={{
                    boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.45)'
                  }}
                >
                  {/* Phone Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-between px-4">
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                  </div>

                  {/* Background Render */}
                  <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden" style={{ zIndex: getZIndex('background') }}>
                    <img
                      src={activeBg.url}
                      alt={activeBg.prompt || 'Background template'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover origin-center"
                      style={{
                        filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`,
                        animation: bgMotionPreset !== 'none'
                          ? `ae-${bgMotionPreset} calc(12s / ${bgMotionSpeed}) ${bgMotionEasing} infinite`
                          : 'none',
                        '--ae-intensity': bgMotionIntensity
                      } as React.CSSProperties}
                    />

                    {vignette && (
                      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_25%,rgba(0,0,0,0.65)_100%)]"></div>
                    )}
                  </div>

                  {/* Text sticker layers inside mockup */}
                  {stickers.map((s) => {
                    const isSelected = selectedStickerId === s.id;
                    const rotationVal = s.rotation ?? 0;
                    const scaleVal = (s.scale ?? 100) / 100;
                    const motionPres = s.motionPreset ?? 'none';
                    const motionSpd = s.motionSpeed ?? 1.0;
                    const motionInt = s.motionIntensity ?? 50;
                    const motionEas = s.motionEasing ?? 'ease-in-out';

                    // Map easing curves to standard high-fidelity cubic beziers for preview CSS
                    let timingFunc = 'ease-in-out';
                    if (motionEas === 'linear') {
                      timingFunc = 'linear';
                    } else if (motionEas === 'elastic') {
                      timingFunc = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    } else if (motionEas === 'bounce') {
                      timingFunc = 'cubic-bezier(0.43, 1.5, 0.65, 1)';
                    }

                    return (
                      <div
                        key={s.id}
                        style={{
                          position: 'absolute',
                          left: `${s.x}%`,
                          top: `${s.y}%`,
                          zIndex: getZIndex(s.id),
                          color: s.color,
                          backgroundColor: s.backgroundColor,
                          fontFamily: getFontFamilyCSS(s.fontFamily),
                          fontSize: `${s.fontSize - 2}px`, // slightly scaled down for 325px container
                          fontWeight: s.fontWeight,
                          borderRadius: `${s.borderRadius}px`,
                          padding: `${s.padding - 1}px`,
                          opacity: (s.opacity ?? 100) / 100,
                          boxShadow: isSelected ? '0 0 0 2px #fff, 0 0 0 4px #6366f1, 0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.25)',
                          transform: motionPres === 'none'
                            ? `translate(-50%, -50%) rotate(${rotationVal}deg) scale(${scaleVal})`
                            : undefined,
                          animation: motionPres !== 'none'
                            ? `sticker-${motionPres} calc(6s / ${motionSpd}) ${timingFunc} infinite`
                            : 'none',
                          '--sticker-rot': `${rotationVal}deg`,
                          '--sticker-scale': scaleVal,
                          '--sticker-intensity': motionInt
                        } as React.CSSProperties}
                        className="whitespace-nowrap transition-all duration-150 pointer-events-none"
                      >
                        {s.text}
                      </div>
                    );
                  })}

                  {/* Interactive Platform Live overlays */}
                  <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 pt-9 font-sans text-white text-[10px]">
                    
                    {/* Header view */}
                    {overlaySettings.showHeader && (
                      <div className="flex justify-between items-start w-full">
                        {platform === 'tiktok' && (
                          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs rounded-full p-1 pl-1.5 pr-2.5">
                            <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center font-bold text-white text-[10px] border border-white/10">
                              L
                            </div>
                            <div>
                              <div className="font-bold text-[9px] leading-tight">LiveStyle.co</div>
                              <div className="text-[7px] opacity-75 leading-none">14.2k views</div>
                            </div>
                            <span className="ml-1 bg-indigo-600 px-1.5 py-0.5 rounded-full text-[7px] font-bold text-white uppercase">
                              Live
                            </span>
                          </div>
                        )}

                        {platform === 'shopee' && (
                          <div className="flex items-center gap-1 bg-black/50 rounded-full p-1 pl-1.5 pr-2.5 border border-orange-500/20">
                            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-[10px]">
                              S
                            </div>
                            <div>
                              <div className="font-bold text-[8.5px] leading-tight text-orange-400">Shopee Studio</div>
                              <div className="text-[7.5px] opacity-80 leading-none">🔴 Live | 6k watching</div>
                            </div>
                          </div>
                        )}

                        {platform === 'reels' && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[1px]">
                              <div className="w-full h-full rounded-full bg-slate-900 border border-black flex items-center justify-center text-[8px] font-bold">
                                RE
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-[10px] flex items-center gap-1">
                                studio_boutique <span className="bg-red-500 text-[7px] px-1 rounded-xs uppercase font-extrabold">Live</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {platform === 'shorts' && (
                          <div className="flex items-center gap-1.5 bg-black/35 px-2.5 py-1 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                            <span className="font-bold uppercase text-[8px]">Shorts stream</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full text-[8.5px] font-semibold">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
                          <span>{platform === 'tiktok' ? '12.4k' : platform === 'shopee' ? '8.1k' : platform === 'reels' ? '1.2k' : '3.8k'} Watching</span>
                        </div>
                      </div>
                    )}

                    {/* Safe zone indicators overlay */}
                    {overlaySettings.showSafeZone && (
                      <div className="absolute inset-x-0 top-[15%] bottom-[35%] border-2 border-dashed border-indigo-400/70 bg-indigo-500/5 flex flex-col items-center justify-center p-3">
                        <div 
                          className="text-center bg-indigo-950/90 text-indigo-300 border border-indigo-400/30 px-2.5 py-1.5 rounded-lg max-w-[85%]"
                          style={{ opacity: overlaySettings.safeZoneOpacity / 100 }}
                        >
                          <span className="font-bold text-[10px] tracking-wider block mb-0.5">✅ LIVE SAFE AREA</span>
                          <span className="text-[8px] text-slate-300 block">Position your primary physical products and custom promotion stickers inside this region.</span>
                        </div>

                        <div className="absolute top-0 bottom-0 left-0 w-2.5 border-r border-dashed border-indigo-400/30 bg-indigo-500/5"></div>
                        <div className="absolute top-0 bottom-0 right-0 w-2.5 border-l border-dashed border-indigo-400/30 bg-indigo-500/5"></div>
                        <div className="text-[8px] text-indigo-400/80 font-bold absolute bottom-2 tracking-widest uppercase">Max Safe Width</div>
                      </div>
                    )}

                    {/* Bleed Warning Coverages */}
                    {overlaySettings.showSafeZone && (
                      <>
                        <div className="absolute top-0 inset-x-0 h-[15%] bg-red-500/10 border-b border-dashed border-red-500/30 flex items-center justify-center">
                          <span className="text-[7.5px] font-bold text-red-400 tracking-wider">⚠️ PROFILE & STATS BLEED ZONE</span>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 h-[35%] bg-red-500/10 border-t border-dashed border-red-500/30 flex items-center justify-center">
                          <span className="text-[7.5px] font-bold text-red-400 tracking-wider">⚠️ COMMENTS & BUTTONS OVERLAY BLEED</span>
                        </div>
                      </>
                    )}

                    {/* Action controls & elements */}
                    <div className="mt-auto w-full flex flex-col gap-1.5">
                      
                      {/* Hearts animations */}
                      <div className="relative h-24 w-full pointer-events-none overflow-hidden">
                        <AnimatePresence>
                          {hearts.map(h => (
                            <motion.div
                              key={h.id}
                              initial={{ y: 80, x: h.left, opacity: 0, scale: 0.4 }}
                              animate={{ y: -25, opacity: [0, 1, 1, 0], scale: h.scale }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 3.2, ease: "easeOut" }}
                              style={{ color: h.color }}
                              className="absolute bottom-0"
                            >
                              <Heart className="w-4 h-4 fill-current shadow-sm" />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Showcase card */}
                      {overlaySettings.showProductCard && (platform === 'tiktok' || platform === 'shopee') && (
                        <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md shadow-md border border-white/10">
                          <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-slate-800 relative shrink-0">
                            <span className="absolute top-0 left-0 bg-indigo-600 text-white text-[7px] px-0.5 font-bold rounded-br">1</span>
                            <ShoppingBag className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-bold text-[8px] text-indigo-300 uppercase tracking-wider">TODAY PIN</div>
                            <div className="font-semibold text-[9px] truncate leading-tight">Procedural Glass Cosmetic Bottle</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-emerald-400 font-extrabold text-[9px]">$24.00</span>
                            </div>
                          </div>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-[8px] font-bold shrink-0">
                            Buy
                          </button>
                        </div>
                      )}

                      {/* Footers */}
                      <div className="flex gap-1.5 items-end justify-between w-full">
                        {overlaySettings.showComments && (
                          <div className="flex-1 flex flex-col gap-1 max-w-[72%] text-left">
                            <div className="bg-black/35 backdrop-blur-xs px-2 py-0.5 rounded">
                              <span className="font-bold text-indigo-300">@clara_m: </span>
                              <span className="text-slate-100">Unreal engine quality background looks so high end!</span>
                            </div>
                            <div className="bg-black/35 backdrop-blur-xs px-2 py-0.5 rounded">
                              <span className="font-bold text-yellow-300">@jason_k: </span>
                              <span className="text-slate-100">Clean non-flat display, awesome colors!</span>
                            </div>
                          </div>
                        )}

                        {overlaySettings.showControls && (
                          <div className="flex flex-col gap-2 items-center shrink-0">
                            <div className="p-1.5 bg-black/45 rounded-full flex items-center justify-center text-white">
                              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                            </div>
                            <div className="p-1.5 bg-black/45 rounded-full flex items-center justify-center text-white">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white animate-bounce shadow-md">
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* TAB 2: Dynamic Multi-Device Mockup Hub with Safe Crop Bleed Analysis */
              <div className="relative flex flex-col items-center animate-in zoom-in-95 duration-200">
                
                {/* Outer sizing bracket mapping dynamic device proportions */}
                <div className="relative">
                  {/* Dynamic Device Container */}
                  <div
                    style={{
                      aspectRatio: mockupOrientation === 'portrait'
                        ? (mockupCategory === 'apple_phone' ? 9/19.5 : mockupCategory === 'android_phone' ? 9/20 : mockupCategory === 'android_tablet' ? 10/16 : mockupCategory === 'ipad' ? 3/4 : 9/16)
                        : (mockupCategory === 'apple_phone' ? 19.5/9 : mockupCategory === 'android_phone' ? 20/9 : mockupCategory === 'android_tablet' ? 16/10 : mockupCategory === 'ipad' ? 4/3 : 16/9),
                      width: mockupOrientation === 'portrait'
                        ? (mockupCategory === 'apple_phone' ? '240px' : mockupCategory === 'android_phone' ? '240px' : mockupCategory === 'android_tablet' ? '310px' : mockupCategory === 'ipad' ? '340px' : '260px')
                        : (mockupCategory === 'apple_phone' ? '510px' : mockupCategory === 'android_phone' ? '520px' : mockupCategory === 'android_tablet' ? '500px' : mockupCategory === 'ipad' ? '460px' : '520px'),
                      height: mockupOrientation === 'portrait'
                        ? (mockupCategory === 'apple_phone' ? '520px' : mockupCategory === 'android_phone' ? '533px' : mockupCategory === 'android_tablet' ? '496px' : mockupCategory === 'ipad' ? '453px' : '462px')
                        : (mockupCategory === 'apple_phone' ? '235px' : mockupCategory === 'android_phone' ? '234px' : mockupCategory === 'android_tablet' ? '312px' : mockupCategory === 'ipad' ? '345px' : '292px'),
                      boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4)'
                    }}
                    className={`relative bg-black select-none transition-all duration-300 overflow-hidden
                      ${mockupCategory === 'apple_phone' || mockupCategory === 'android_phone' ? 'border-[8px] md:border-[10px] border-slate-800 rounded-[36px]' : ''}
                      ${mockupCategory === 'ipad' || mockupCategory === 'android_tablet' ? 'border-[12px] border-slate-800 rounded-[24px]' : ''}
                      ${mockupCategory === 'desktop' ? 'border-[14px] border-slate-900 rounded-[10px]' : ''}
                    `}
                  >
                    
                    {/* Device-specific Hardware Ornaments */}
                    {/* 1. iPhone 15 Pro Max Dynamic Island */}
                    {mockupCategory === 'apple_phone' && mockupOrientation === 'portrait' && (
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-40 flex items-center justify-between px-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                        <div className="w-1 h-1 rounded-full bg-slate-900"></div>
                      </div>
                    )}
                    {mockupCategory === 'apple_phone' && mockupOrientation === 'landscape' && (
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 h-20 w-3.5 bg-black rounded-full z-40 flex flex-col items-center justify-between py-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                        <div className="w-1 h-1 rounded-full bg-slate-900"></div>
                      </div>
                    )}

                    {/* 2. Android Centered Hole Punch */}
                    {mockupCategory === 'android_phone' && mockupOrientation === 'portrait' && (
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rounded-full z-40 border border-slate-800/80 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-blue-900/60"></div>
                      </div>
                    )}
                    {mockupCategory === 'android_phone' && mockupOrientation === 'landscape' && (
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-900 rounded-full z-40 border border-slate-800/80 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-blue-900/60"></div>
                      </div>
                    )}

                    {/* 3. Tablet Notch or camera pinhole */}
                    {(mockupCategory === 'ipad' || mockupCategory === 'android_tablet') && (
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-950 rounded-full z-40 opacity-70"></div>
                    )}

                    {/* The Screen Display Content */}
                    <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden" style={{ zIndex: getZIndex('background') }}>
                      {/* Background Image styled using non-distortion object-cover rule */}
                      <img
                        src={activeBg.url}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover origin-center select-none"
                        style={{
                          filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px)`,
                          animation: bgMotionPreset !== 'none'
                            ? `ae-${bgMotionPreset} calc(12s / ${bgMotionSpeed}) ${bgMotionEasing} infinite`
                            : 'none',
                          '--ae-intensity': bgMotionIntensity
                        } as React.CSSProperties}
                      />

                      {/* Vignette Filter */}
                      {vignette && (
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.7)_100%)]"></div>
                      )}

                      {/* Dynamic Color-Coded Crop Bleed Borders */}
                      {showBleedGuides && (() => {
                        const activeAspect = mockupOrientation === 'portrait'
                          ? (mockupCategory === 'apple_phone' ? 9/19.5 : mockupCategory === 'android_phone' ? 9/20 : mockupCategory === 'android_tablet' ? 10/16 : mockupCategory === 'ipad' ? 3/4 : 9/16)
                          : (mockupCategory === 'apple_phone' ? 19.5/9 : mockupCategory === 'android_phone' ? 20/9 : mockupCategory === 'android_tablet' ? 16/10 : mockupCategory === 'ipad' ? 4/3 : 16/9);

                        const renderGuideBox = (guideRatio: number, colorClass: string, label: string) => {
                          let wPct = 100;
                          let hPct = 100;
                          if (guideRatio >= activeAspect) {
                            wPct = 100;
                            hPct = (activeAspect / guideRatio) * 100;
                          } else {
                            hPct = 100;
                            wPct = (guideRatio / activeAspect) * 100;
                          }
                          // Skip rendering if it's identical to active viewport shape to prevent screen clutter
                          if (Math.abs(wPct - 100) < 1.5 && Math.abs(hPct - 100) < 1.5) return null;

                          return (
                            <div
                              style={{
                                width: `${wPct}%`,
                                height: `${hPct}%`,
                                left: `${(100 - wPct) / 2}%`,
                                top: `${(100 - hPct) / 2}%`
                              }}
                              className={`absolute border border-dashed ${colorClass} bg-transparent pointer-events-none z-30 transition-all duration-300`}
                            >
                              <div className="absolute top-1 left-1.5 bg-slate-900/90 border border-slate-700/50 backdrop-blur-xs px-1 py-0.5 rounded text-[7px] font-bold text-white shadow-xs leading-none">
                                {label}
                              </div>
                            </div>
                          );
                        };

                        return (
                          <div className="absolute inset-0 pointer-events-none z-30">
                            {mockupOrientation === 'portrait' ? (
                              <>
                                {renderGuideBox(9/16, 'border-indigo-500/80', 'Standard Screen (9:16)')}
                                {renderGuideBox(3/4, 'border-orange-500/80', 'iPad / Tablet Crop Area (3:4)')}
                                {renderGuideBox(9/19.5, 'border-emerald-500/80', 'Tall iPhone Bezel (9:19.5)')}
                              </>
                            ) : (
                              <>
                                {renderGuideBox(16/9, 'border-indigo-500/80', 'Standard Desktop (16:9)')}
                                {renderGuideBox(4/3, 'border-orange-500/80', 'iPad / Tablet Landscape (4:3)')}
                                {renderGuideBox(16/10, 'border-sky-500/80', 'Android Tablet (16:10)')}
                              </>
                            )}
                          </div>
                        );
                      })()}

                      {/* Live Text Sticker Layers mapped inside mockup boundaries */}
                      {stickers.map((s) => {
                        const isSelected = selectedStickerId === s.id;
                        const rotationVal = s.rotation ?? 0;
                        const scaleVal = (s.scale ?? 100) / 100;
                        const motionPres = s.motionPreset ?? 'none';
                        const motionSpd = s.motionSpeed ?? 1.0;
                        const motionInt = s.motionIntensity ?? 50;
                        const motionEas = s.motionEasing ?? 'ease-in-out';

                        let timingFunc = 'ease-in-out';
                        if (motionEas === 'linear') {
                          timingFunc = 'linear';
                        } else if (motionEas === 'elastic') {
                          timingFunc = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        } else if (motionEas === 'bounce') {
                          timingFunc = 'cubic-bezier(0.43, 1.5, 0.65, 1)';
                        }

                        return (
                          <div
                            key={s.id}
                            style={{
                              position: 'absolute',
                              left: `${s.x}%`,
                              top: `${s.y}%`,
                              zIndex: getZIndex(s.id),
                              color: s.color,
                              backgroundColor: s.backgroundColor,
                              fontFamily: getFontFamilyCSS(s.fontFamily),
                              fontSize: `${s.fontSize - 3}px`, // scale down sizing for dynamic frame aspect ratios
                              fontWeight: s.fontWeight,
                              borderRadius: `${s.borderRadius}px`,
                              padding: `${s.padding - 1.5}px`,
                              opacity: (s.opacity ?? 100) / 100,
                              boxShadow: isSelected ? '0 0 0 2px #fff, 0 0 0 4px #6366f1, 0 4px 12px rgba(0,0,0,0.35)' : '0 2px 6px rgba(0,0,0,0.25)',
                              transform: motionPres === 'none'
                                ? `translate(-50%, -50%) rotate(${rotationVal}deg) scale(${scaleVal})`
                                : undefined,
                              animation: motionPres !== 'none'
                                ? `sticker-${motionPres} calc(6s / ${motionSpd}) ${timingFunc} infinite`
                                : 'none',
                              '--sticker-rot': `${rotationVal}deg`,
                              '--sticker-scale': scaleVal,
                              '--sticker-intensity': motionInt
                            } as React.CSSProperties}
                            className="whitespace-nowrap transition-all duration-150 pointer-events-none"
                          >
                            {s.text}
                          </div>
                        );
                      })}

                    </div>
                  </div>

                  {/* Desktop Aluminium Stand - realism accentuation */}
                  {mockupCategory === 'desktop' && mockupOrientation === 'landscape' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-16 h-12 bg-gradient-to-b from-slate-300 to-slate-400 border-t border-slate-400/80 rounded-b-lg shadow-md flex justify-center items-end select-none pointer-events-none z-0">
                      <div className="w-24 h-1.5 bg-slate-400/90 rounded-full shadow-inner mb-0.5"></div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Bottom HUD - Safe Bleed Map Analyzer Legend */}
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl z-20 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Professional Bleed Map Analyzer
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-lg leading-relaxed">
                  Design results auto-preserve proportions using <code className="text-slate-300 font-mono">object-cover</code> bounds. 
                  Turn on the <strong className="text-slate-300 font-semibold">Bleed Map</strong> to verify safe zones. Placing content inside the innermost safe boundary guarantees zero crop cutoffs on any device!
                </p>
              </div>

              {/* Guide Color Legend */}
              <div className="flex flex-col gap-1.5 min-w-[170px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Bleed Guides Legend</span>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-300">
                  <span className="w-2 h-1 bg-indigo-500 rounded-sm"></span>
                  <span>9:16 / 16:9 Standard</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-300">
                  <span className="w-2 h-1 bg-orange-400 rounded-sm"></span>
                  <span>3:4 / 4:3 iPad & Tablet</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-300">
                  <span className="w-2 h-1 bg-emerald-400 rounded-sm"></span>
                  <span>Tall Aspect Bezel</span>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* Right Sidebar Drag Resize Handle */}
        {((showPropertiesPanel || showColorsPanel || showLayersPanel || showPathsPanel) && !fullViewMode) && (
          <div 
            onMouseDown={startRightResize}
            className="hidden lg:block w-1.5 hover:w-2.5 bg-slate-200 hover:bg-indigo-400 active:bg-indigo-600 cursor-col-resize transition-all shrink-0 h-full relative z-30 group select-none"
            title="Drag to resize right sidebar (Canva style)"
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              <div className="w-0.5 h-6 bg-white rounded-full shadow-xs" />
            </div>
          </div>
        )}

        {/* Right Sidebar: Unreal Render Parameters & Stickers */}
        <aside 
          style={{ 
            width: (showPropertiesPanel || showColorsPanel || showLayersPanel || showPathsPanel) && !fullViewMode ? `${rightSidebarWidth}px` : '0px',
            display: (showPropertiesPanel || showColorsPanel || showLayersPanel || showPathsPanel) && !fullViewMode ? 'flex' : 'none'
          }}
          className={`bg-white border-l border-slate-200 flex-col shrink-0 overflow-y-auto relative hidden lg:flex select-none ${isResizing ? '' : 'transition-all duration-150'}`}
        >
          
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
            <button
              onClick={() => setSidebarTab('render')}
              className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 ${
                sidebarTab === 'render'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Render & FX</span>
            </button>
            <button
              onClick={() => setSidebarTab('motion')}
              className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 ${
                sidebarTab === 'motion'
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-rose-500 hover:text-rose-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Motion Desk</span>
            </button>
          </div>

          {sidebarTab === 'render' && (
            <>
              {/* Section 1: Unreal Rendering Parameters (Properties Panel) */}
              {showPropertiesPanel && (
                <div className="p-4 border-b border-slate-100 relative">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Rendering Engine (3D Unreal)
                    </h3>
                    <button 
                      onClick={() => setShowPropertiesPanel(false)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      title="Hide Properties"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Soft Global Illumination</span>
                        <span className="font-mono text-slate-700">{globalIllumination}%</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="120"
                        value={globalIllumination}
                        onChange={(e) => setGlobalIllumination(parseInt(e.target.value))}
                        onMouseUp={() => recordState()}
                        onTouchEnd={() => recordState()}
                        className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Subsurface Scattering (Depth)</span>
                        <span className="font-mono text-slate-700">{subsurfaceScattering}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={subsurfaceScattering}
                        onChange={(e) => setSubsurfaceScattering(parseInt(e.target.value))}
                        onMouseUp={() => recordState()}
                        onTouchEnd={() => recordState()}
                        className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Anti-HDR Eye Softening</span>
                  <span className="font-mono text-emerald-600 font-bold">{antiHdrSoftening}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="100"
                  value={antiHdrSoftening}
                  onChange={(e) => setAntiHdrSoftening(parseInt(e.target.value))}
                  onMouseUp={() => recordState()}
                  onTouchEnd={() => recordState()}
                  className="w-full accent-emerald-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Ambient Shadow Occlusion</span>
                  <span className="font-mono text-slate-700">{ambientOcclusion}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={ambientOcclusion}
                  onChange={(e) => setAmbientOcclusion(parseInt(e.target.value))}
                  onMouseUp={() => recordState()}
                  onTouchEnd={() => recordState()}
                  className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded border border-slate-100 text-[10px] text-slate-600">
                  <span>Vignette Shadows</span>
                  <input
                    type="checkbox"
                    checked={vignette}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setVignette(v);
                      recordState(undefined, { vignette: v });
                    }}
                    className="rounded text-indigo-600 border-slate-200 focus:ring-0"
                  />
                </div>
                <button
                  onClick={handleResetCanvas}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold p-1.5 rounded border border-slate-100 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Engine
                </button>
              </div>

              {/* Undo / Redo Controls */}
              <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg border border-slate-100 mt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-1">
                  History Stack
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-1 px-2.5 rounded bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 disabled:cursor-not-allowed border border-slate-200 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                    title="Undo last adjustment (Ctrl+Z)"
                  >
                    <Undo2 className="w-3 h-3 text-slate-500" />
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-1 px-2.5 rounded bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 disabled:cursor-not-allowed border border-slate-200 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                    title="Redo adjustment (Ctrl+Shift+Z)"
                  >
                    <Redo2 className="w-3 h-3 text-slate-500" />
                    <span>Redo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Section 2: Color Palette preset pills (Colors Panel) */}
          {showColorsPanel && (
            <div className="p-4 border-b border-slate-100 relative">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-indigo-600" /> Comfortable Color Palette
                </h3>
                <button 
                  onClick={() => setShowColorsPanel(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Hide Colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mb-2.5 leading-snug">Smooth eye-comfort profiles modeled from curated studio templates.</p>
              
              <div className="flex space-x-2">
                {palettes.map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => setActivePalette(pal.id)}
                    className={`w-9 h-9 rounded-full border-2 p-[2px] transition ${activePalette === pal.id ? 'border-indigo-600 scale-105' : 'border-transparent hover:scale-102'}`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden flex flex-wrap">
                      <span className="w-1/2 h-1/2" style={{ backgroundColor: pal.colors[0] }} />
                      <span className="w-1/2 h-1/2" style={{ backgroundColor: pal.colors[1] }} />
                      <span className="w-1/2 h-1/2" style={{ backgroundColor: pal.colors[2] }} />
                      <span className="w-1/2 h-1/2" style={{ backgroundColor: pal.colors[3] }} />
                    </div>
                  </button>
                ))}
                <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-sm">+</button>
              </div>
            </div>
          )}

          {/* Section 3: Custom Text Promotion Designer (Properties Panel) */}
          {showPropertiesPanel && (
            <div className="p-4 border-b border-slate-100">
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-indigo-600" /> Active Promo Stickers
                </h3>
                <button 
                  onClick={() => setShowPropertiesPanel(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Hide Properties"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            
            <div className="flex gap-1.5 mb-3">
              <input
                type="text"
                placeholder="Promo text e.g. TIKTOK EXCLUSIVE"
                value={newStickerText}
                onChange={(e) => setNewStickerText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSticker()}
                className="flex-1 text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddSticker}
                className="bg-slate-900 hover:bg-slate-850 text-white text-[10px] font-bold px-2.5 rounded-lg transition shrink-0 cursor-pointer"
              >
                Create
              </button>
            </div>

            {selectedStickerId ? (
              (() => {
                const s = stickers.find(st => st.id === selectedStickerId);
                if (!s) return null;
                return (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[11px] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-800">Customize Label</span>
                      <button
                        onClick={() => handleDeleteSticker(s.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-[10px] flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      value={s.text}
                      onChange={(e) => updateSelectedSticker({ text: e.target.value })}
                      onBlur={() => recordState()}
                      onKeyDown={(e) => e.key === 'Enter' && recordState()}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    />

                    <div className="relative">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Font Family</span>
                      <button
                        type="button"
                        onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                        className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-700 font-medium flex items-center justify-between text-left"
                      >
                        <span style={{ fontFamily: getFontFamilyCSS(s.fontFamily) }}>
                          {ALL_FONTS.find(f => f.value === (s.fontFamily || 'Outfit'))?.name || s.fontFamily || 'Outfit'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>

                      {isFontDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => {
                              setIsFontDropdownOpen(false);
                              setFontSearchQuery('');
                            }}
                          />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-64">
                            <div className="p-1.5 border-b border-slate-100 flex items-center gap-1.5 bg-slate-50">
                              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <input
                                type="text"
                                placeholder="Search fonts..."
                                value={fontSearchQuery}
                                onChange={(e) => setFontSearchQuery(e.target.value)}
                                className="w-full text-xs bg-transparent border-none outline-none text-slate-700 p-0.5 placeholder:text-slate-400 focus:ring-0"
                                autoFocus
                              />
                              {fontSearchQuery && (
                                <button 
                                  type="button"
                                  onClick={() => setFontSearchQuery('')}
                                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold px-1"
                                >
                                  Clear
                                </button>
                              )}
                            </div>

                            <div className="overflow-y-auto py-1 divide-y divide-slate-50 max-h-48">
                              {(() => {
                                const query = fontSearchQuery.toLowerCase().trim();
                                const filtered = ALL_FONTS.filter(f => 
                                  f.name.toLowerCase().includes(query) || 
                                  f.value.toLowerCase().includes(query) ||
                                  f.category.toLowerCase().includes(query)
                                );

                                if (filtered.length === 0) {
                                  return (
                                    <div className="p-3 text-center text-slate-400 text-[10px] italic">
                                      No matching fonts found
                                    </div>
                                  );
                                }

                                const categories = Array.from(new Set(filtered.map(f => f.category)));

                                return categories.map(cat => {
                                  const catFonts = filtered.filter(f => f.category === cat);
                                  return (
                                    <div key={cat} className="p-1">
                                      <div className="px-2 py-0.5 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                        {cat}
                                      </div>
                                      <div className="space-y-0.5 mt-0.5">
                                        {catFonts.map(f => {
                                          const isSelected = (s.fontFamily || 'Outfit') === f.value;
                                          return (
                                            <button
                                              key={f.value}
                                              type="button"
                                              onClick={() => {
                                                updateSelectedSticker({ fontFamily: f.value });
                                                setIsFontDropdownOpen(false);
                                                setFontSearchQuery('');
                                                setTimeout(() => recordState(), 10);
                                              }}
                                              className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors flex items-center justify-between ${
                                                isSelected 
                                                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                                                  : 'hover:bg-slate-50 text-slate-700'
                                              }`}
                                            >
                                              <span style={{ fontFamily: getFontFamilyCSS(f.value) }}>
                                                {f.name}
                                              </span>
                                              {isSelected && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Text Color</span>
                        <input
                          type="color"
                          value={s.color}
                          onChange={(e) => updateSelectedSticker({ color: e.target.value })}
                          onBlur={() => recordState()}
                          className="w-full h-7 rounded cursor-pointer border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">BG fill</span>
                        <input
                          type="color"
                          value={s.backgroundColor === 'transparent' ? '#ffffff' : s.backgroundColor}
                          onChange={(e) => updateSelectedSticker({ backgroundColor: e.target.value })}
                          onBlur={() => recordState()}
                          className="w-full h-7 rounded cursor-pointer border border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Horizontal (X)</span>
                        <span>{s.x}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={s.x}
                        onChange={(e) => updateSelectedSticker({ x: parseInt(e.target.value) })}
                        onMouseUp={() => recordState()}
                        onTouchEnd={() => recordState()}
                        className="w-full accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Vertical (Y)</span>
                        <span>{s.y}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={s.y}
                        onChange={(e) => updateSelectedSticker({ y: parseInt(e.target.value) })}
                        onMouseUp={() => recordState()}
                        onTouchEnd={() => recordState()}
                        className="w-full accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Opacity</span>
                        <span>{s.opacity ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={s.opacity ?? 100}
                        onChange={(e) => updateSelectedSticker({ opacity: parseInt(e.target.value) })}
                        onMouseUp={() => recordState()}
                        onTouchEnd={() => recordState()}
                        className="w-full accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-[10px] text-slate-400 text-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                Click any promo sticker list item below to style.
              </p>
            )}

            {stickers.length > 0 && (
              <motion.div layout className="mt-2.5 space-y-1">
                <AnimatePresence mode="popLayout">
                  {stickers.map(s => (
                    <motion.button
                      key={s.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -12 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 400, 
                        damping: 30,
                        layout: { duration: 0.25, type: 'spring' }
                      }}
                      onClick={() => setSelectedStickerId(s.id)}
                      className={`w-full text-left text-[10px] p-2 rounded border transition-colors flex justify-between items-center cursor-pointer ${selectedStickerId === s.id ? 'bg-indigo-50/50 font-semibold border-indigo-200 text-indigo-900' : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600'}`}
                    >
                      <span className="truncate">{s.text}</span>
                      <span className="font-mono text-[9px] opacity-60">{s.x}%, {s.y}%</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
          )}

          {/* Paths Panel: Safe Guides and Livestream Simulated Overlays */}
          {showPathsPanel && (
            <div className="p-4 border-b border-slate-100 relative bg-white">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" /> Safe Guides & Overlays
                </h3>
                <button 
                  onClick={() => setShowPathsPanel(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Hide Paths Panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mb-3 leading-snug">Toggle bleed margins, simulated livestream widgets, and aspect overlays.</p>
              
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-100 transition cursor-pointer">
                  <span className="font-medium">Show Bleed Guides Map</span>
                  <input
                    type="checkbox"
                    checked={showBleedGuides}
                    onChange={(e) => setShowBleedGuides(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-100 transition cursor-pointer">
                  <span className="font-medium">Draw Safety Zones</span>
                  <input
                    type="checkbox"
                    checked={overlaySettings.showSafeZone}
                    onChange={(e) => setOverlaySettings(prev => ({ ...prev, showSafeZone: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-100 transition cursor-pointer">
                  <span className="font-medium">Simulate Live Chat</span>
                  <input
                    type="checkbox"
                    checked={overlaySettings.showComments}
                    onChange={(e) => setOverlaySettings(prev => ({ ...prev, showComments: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-100 transition cursor-pointer">
                  <span className="font-medium">Simulate Live Controls</span>
                  <input
                    type="checkbox"
                    checked={overlaySettings.showControls}
                    onChange={(e) => setOverlaySettings(prev => ({ ...prev, showControls: e.target.checked }))}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                </label>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Overlay Guide Opacity</span>
                  <span>{overlaySettings.safeZoneOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={overlaySettings.safeZoneOpacity}
                  onChange={(e) => setOverlaySettings(prev => ({ ...prev, safeZoneOpacity: parseInt(e.target.value) }))}
                  className="w-full accent-indigo-600 h-1 bg-slate-100"
                />
              </div>
            </div>
          )}
          </>
          )}

          {sidebarTab === 'motion' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50 animate-in fade-in duration-200">
              
              {/* AE Composition Title & Details */}
              <div className="p-3 bg-slate-900 text-white border-b border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-none">AE Motion Desk v2.4</div>
                  <h4 className="text-xs font-bold mt-1 text-slate-100 truncate">composition_loop.aep</h4>
                </div>
                <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse">
                  60 FPS Loop
                </span>
              </div>

              {/* SECTION: Timeline Layers (Composition Track Panel) */}
              {showLayersPanel && (
                <div className="p-3 border-b border-slate-200 bg-white relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" /> Composition Layers
                    </span>
                    <button 
                      onClick={() => setShowLayersPanel(false)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      title="Hide Layers"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {/* Layers track list */}
                  <div className="space-y-1.5">
                  <Reorder.Group values={activeOrder} onReorder={handleReorderLayers} className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {activeOrder.map((layerId) => {
                      const isBackground = layerId === 'background';
                      const isSelected = selectedLayer === layerId;
                      
                      if (isBackground) {
                        return (
                          <Reorder.Item
                            key="background"
                            value="background"
                            className="flex items-center gap-1 bg-white rounded-lg select-none"
                          >
                            {/* Drag Handle */}
                            <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition shrink-0" title="Drag to reorder layer depth">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                            
                            <button
                              onClick={() => setSelectedLayer('background')}
                              className={`flex-1 text-left p-1.5 rounded-r-lg border-y border-r transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="w-4 h-4 rounded bg-indigo-500 text-white text-[9px] flex items-center justify-center font-bold shrink-0">BG</div>
                                <span className="text-[10px] truncate font-medium">🌄 Background Layer</span>
                              </div>
                              <div className="flex items-center gap-1 text-[9px] opacity-60 shrink-0">
                                <span>{bgMotionPreset !== 'none' ? 'FX' : 'Static'}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              </div>
                            </button>
                          </Reorder.Item>
                        );
                      } else {
                        const s = stickers.find(st => st.id === layerId);
                        if (!s) return null;
                        const idx = stickers.indexOf(s);
                        const isStickerSelected = selectedLayer === s.id;
                        return (
                          <Reorder.Item
                            key={s.id}
                            value={s.id}
                            className="flex items-center gap-1 bg-white rounded-lg select-none"
                          >
                            {/* Drag Handle */}
                            <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition shrink-0" title="Drag to reorder layer depth">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                            
                            <button
                              onClick={() => {
                                setSelectedLayer(s.id);
                                setSelectedStickerId(s.id);
                              }}
                              className={`flex-1 text-left p-1.5 rounded-r-lg border-y border-r transition flex items-center justify-between cursor-pointer ${
                                isStickerSelected
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="w-4 h-4 rounded bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold shrink-0">T{idx + 1}</div>
                                <span className="text-[10px] truncate font-medium">💬 {s.text}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[9px] opacity-60 shrink-0">
                                <span>{(s.motionPreset && s.motionPreset !== 'none') ? 'FX' : 'Static'}</span>
                                <span className={`w-1.5 h-1.5 rounded-full ${(s.motionPreset && s.motionPreset !== 'none') ? 'bg-rose-500 animate-ping' : 'bg-slate-300'}`}></span>
                              </div>
                            </button>
                          </Reorder.Item>
                        );
                      }
                    })}
                  </Reorder.Group>
                  <div className="text-[8px] text-slate-400 text-center font-medium mt-1 select-none">
                    💡 Drag grip handle <span className="font-bold text-slate-500">☰</span> to reorder layer depth (Z-Index)
                  </div>
                </div>
              </div>
              )}

              {/* SECTION: Effect Controls (Detailed options like After Effects) */}
              {showPropertiesPanel && (
              <div className="p-4 flex-1 overflow-y-auto bg-white relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Effect Controls
                  </span>
                  <button 
                    onClick={() => setShowPropertiesPanel(false)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    title="Hide Properties"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {selectedLayer === 'background' ? (
                  /* Background Control Panel */
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <h4 className="text-xs font-bold text-slate-800">Background Motion Controls</h4>
                    </div>

                    {/* Preset Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Motion Preset Behavior</label>
                      <select
                        value={bgMotionPreset}
                        onChange={(e) => setBgMotionPreset(e.target.value as any)}
                        className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-0 cursor-pointer"
                      >
                        <option value="none">None (Static Still)</option>
                        <option value="zoom">Ken Burns Zoom (Cinematic Scale)</option>
                        <option value="drift">Infinite Drift (3D Floating Pan)</option>
                        <option value="swivel">Gentle Swivel (Horizon Rotate)</option>
                        <option value="pulse">Heartbeat Pulse (Rhythmic Breathing)</option>
                        <option value="pan">Cinematic Pan (Smooth Left-Right Sweep)</option>
                        <option value="glitch">Cyber Glitch (Jittery Chromatic Aberration)</option>
                      </select>
                    </div>

                    {bgMotionPreset !== 'none' && (
                      <>
                        {/* Speed Multiplier slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Motion Frequency / Speed</span>
                            <span className="font-mono text-indigo-600 font-bold">{bgMotionSpeed}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="3.0"
                            step="0.1"
                            value={bgMotionSpeed}
                            onChange={(e) => setBgMotionSpeed(parseFloat(e.target.value))}
                            className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>0.2x (Ambient)</span>
                            <span>3.0x (Extreme)</span>
                          </div>
                        </div>

                        {/* Intensity / Amplitude slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Motion Amplitude / Intensity</span>
                            <span className="font-mono text-indigo-600 font-bold">{bgMotionIntensity}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={bgMotionIntensity}
                            onChange={(e) => setBgMotionIntensity(parseInt(e.target.value))}
                            className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>Subtle (10%)</span>
                            <span>Intense (100%)</span>
                          </div>
                        </div>

                        {/* Easing select */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Interpolation Easing</label>
                          <select
                            value={bgMotionEasing}
                            onChange={(e) => setBgMotionEasing(e.target.value as any)}
                            className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-0 cursor-pointer"
                          >
                            <option value="ease-in-out">Ease In-Out (Hyper-smooth)</option>
                            <option value="linear">Linear (Constant Velocity)</option>
                            <option value="ease-in">Ease-In (Accelerating)</option>
                            <option value="ease-out">Ease-Out (Decelerating)</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Timeline visualization */}
                    <div className="pt-2">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                          <span>Graph Editor</span>
                          <span className="text-indigo-500 font-mono">Loop Status: Seamless</span>
                        </div>
                        {/* Simulated Easing Graph */}
                        <div className="h-10 w-full relative overflow-hidden bg-slate-100/50 rounded-lg flex items-end">
                          <svg className="absolute inset-0 w-full h-full text-indigo-200" viewBox="0 0 100 40" preserveAspectRatio="none">
                            {bgMotionEasing === 'linear' && <path d="M0,40 L50,0 L100,40" fill="none" stroke="currentColor" strokeWidth="2" />}
                            {bgMotionEasing === 'ease-in-out' && <path d="M0,40 C25,40 25,0 50,0 C75,0 75,40 100,40" fill="none" stroke="currentColor" strokeWidth="2" />}
                            {bgMotionEasing === 'ease-in' && <path d="M0,40 Q50,40 100,0" fill="none" stroke="currentColor" strokeWidth="2" />}
                            {bgMotionEasing === 'ease-out' && <path d="M0,40 Q50,0 100,0" fill="none" stroke="currentColor" strokeWidth="2" />}
                          </svg>
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200/50"></div>
                          <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400">t = 4.0s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Sticker Layer Controls */
                  (() => {
                    const sticker = stickers.find(s => s.id === selectedLayer);
                    if (!sticker) return (
                      <p className="text-xs text-slate-400 italic text-center py-4">No active sticker layer found.</p>
                    );

                    const motionEas = sticker.motionEasing ?? 'ease-in-out';
                    
                    // Generate dynamic SVG path points for the Graph Editor curve representation
                    const points: string[] = [];
                    for (let i = 0; i <= 100; i++) {
                      const px = i;
                      const t = i / 100;
                      const eased = getEasedProgress(t, motionEas);
                      const py = 35 - eased * 30; // Scale to fit standard SVG viewbox (0,0 to 100,40)
                      points.push(`${px},${py}`);
                    }
                    const pathD = `M ${points.join(' L ')}`;

                    return (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        
                        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <h4 className="text-xs font-bold text-slate-800">Text Layer Transform</h4>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedLayer('background');
                            }}
                            className="text-[9px] text-indigo-600 hover:underline font-bold"
                          >
                            Select BG Layer
                          </button>
                        </div>

                        {/* Static transform parameters representing keyframes */}
                        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 space-y-3">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex justify-between">
                            <span>Keyframe Transforms</span>
                            <span className="text-rose-500 font-medium text-[8px]">Editable</span>
                          </div>

                          {/* Position X (Anchor X) */}
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Anchor X (Position)</span>
                              <span className="font-mono text-slate-700">{sticker.x}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={sticker.x}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, x: val } : s));
                              }}
                              onMouseUp={() => recordState()}
                              className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Position Y (Anchor Y) */}
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Anchor Y (Position)</span>
                              <span className="font-mono text-slate-700">{sticker.y}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={sticker.y}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, y: val } : s));
                              }}
                              onMouseUp={() => recordState()}
                              className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Scale Slider */}
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Scale Factor</span>
                              <span className="font-mono text-slate-700">{sticker.scale ?? 100}%</span>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="200"
                              value={sticker.scale ?? 100}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, scale: val } : s));
                              }}
                              onMouseUp={() => recordState()}
                              className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Rotation Slider */}
                          <div className="space-y-0.5">
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Rotation Angle</span>
                              <span className="font-mono text-slate-700">{sticker.rotation ?? 0}°</span>
                            </div>
                            <input
                              type="range"
                              min="-45"
                              max="45"
                              value={sticker.rotation ?? 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, rotation: val } : s));
                              }}
                              onMouseUp={() => recordState()}
                              className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Layer Motion Behaviors */}
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                            <h4 className="text-xs font-bold text-slate-800">Layer Motion Presets (FX)</h4>
                          </div>

                          {/* Behavior Preset Selection */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Motion FX Behavior</label>
                            <select
                              value={sticker.motionPreset ?? 'none'}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, motionPreset: val } : s));
                              }}
                              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-0 cursor-pointer"
                            >
                              <option value="none">None (Static Keyframes)</option>
                              <option value="float">Float & Breathe (Wobbly Flow)</option>
                              <option value="spin">Continuous Rotation (Logo Spin)</option>
                              <option value="shake">Jitter Shake (Vibrational Buzz)</option>
                              <option value="pulse">Elastic Pulse (Bouncing Scale)</option>
                              <option value="slide">Horizontal Slide (Swaying Drift)</option>
                            </select>
                          </div>

                          {sticker.motionPreset && sticker.motionPreset !== 'none' && (
                            <>
                              {/* Motion Speed Slider */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] text-slate-500">
                                  <span>Behavior Frequency (Speed)</span>
                                  <span className="font-mono text-rose-600 font-bold">{sticker.motionSpeed ?? 1.0}x</span>
                                </div>
                                <input
                                  type="range"
                                  min="0.2"
                                  max="3.0"
                                  step="0.1"
                                  value={sticker.motionSpeed ?? 1.0}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, motionSpeed: val } : s));
                                  }}
                                  onMouseUp={() => recordState()}
                                  className="w-full accent-rose-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              {/* Motion Intensity Slider */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] text-slate-500">
                                  <span>Behavior Amplitude (Intensity)</span>
                                  <span className="font-mono text-rose-600 font-bold">{sticker.motionIntensity ?? 50}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  value={sticker.motionIntensity ?? 50}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, motionIntensity: val } : s));
                                  }}
                                  onMouseUp={() => recordState()}
                                  className="w-full accent-rose-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              {/* Motion Easing Selector */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Interpolation Curve</label>
                                <select
                                  value={sticker.motionEasing ?? 'ease-in-out'}
                                  onChange={(e) => {
                                    const val = e.target.value as any;
                                    setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, motionEasing: val } : s));
                                  }}
                                  onMouseUp={() => recordState()}
                                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-0 cursor-pointer"
                                >
                                  <option value="ease-in-out">Smooth Ease (S-Curve)</option>
                                  <option value="linear">Linear Step (Constant)</option>
                                  <option value="elastic">Elastic Snap (Boing Spring)</option>
                                  <option value="bounce">Boing Bounce (Elastic Drop)</option>
                                </select>
                              </div>

                              {/* After Effects Curve Graph Editor */}
                              <div className="pt-2">
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 shadow-inner">
                                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                                    <span className="flex items-center gap-1">
                                      <Activity className="w-3 h-3 text-indigo-500 animate-pulse" /> AE Graph Editor v2.4
                                    </span>
                                    <span className="font-mono text-slate-500">Speed: {sticker.motionSpeed ?? 1.0}x</span>
                                  </div>
                                  
                                  {/* Easing Math Details */}
                                  <div className="text-[10px] text-slate-400 font-medium leading-normal bg-slate-950/60 p-2 rounded border border-slate-800/80">
                                    {motionEas === 'ease-in-out' && (
                                      <span><strong>Cubic Ease S-Curve:</strong> Smooth acceleration and deceleration phases with zero velocity peaks at loop boundaries.</span>
                                    )}
                                    {motionEas === 'linear' && (
                                      <span><strong>Linear Step Vector:</strong> Constant velocity throughout the loop. Perfect for continuous scrolling tickers.</span>
                                    )}
                                    {motionEas === 'elastic' && (
                                      <span><strong>Elastic Snap Spring:</strong> Over-shoots boundaries with high physical damping resistance before snapping back.</span>
                                    )}
                                    {motionEas === 'bounce' && (
                                      <span><strong>Boing Bounce Drop:</strong> Simulates a gravity coefficient bounce, accelerating towards peaks and slowing at apex.</span>
                                    )}
                                  </div>

                                  {/* Interactive SVG Easing Plot */}
                                  <div className="h-16 w-full relative overflow-hidden bg-slate-950 rounded-lg flex items-end p-1 border border-slate-800">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                      <div className="border-b border-slate-700 w-full h-0"></div>
                                      <div className="border-b border-slate-700 w-full h-0"></div>
                                      <div className="border-b border-slate-700 w-full h-0"></div>
                                    </div>
                                    <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                                      <div className="border-r border-slate-700 h-full w-0"></div>
                                      <div className="border-r border-slate-700 h-full w-0"></div>
                                      <div className="border-r border-slate-700 h-full w-0"></div>
                                      <div className="border-r border-slate-700 h-full w-0"></div>
                                    </div>

                                    <svg className="w-full h-full text-indigo-500 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                      {/* Baseline */}
                                      <line x1="0" y1="35" x2="100" y2="35" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                                      {/* Main curve path */}
                                      <path 
                                        d={pathD} 
                                        fill="none" 
                                        stroke={
                                          motionEas === 'elastic' ? '#f43f5e' : 
                                          motionEas === 'bounce' ? '#fbbf24' : 
                                          motionEas === 'linear' ? '#10b981' : 
                                          '#6366f1'
                                        } 
                                        strokeWidth="1.5" 
                                        className="transition-all duration-300"
                                      />
                                      {/* Realtime playhead vertical line */}
                                      <line 
                                        x1={previewProgress * 100} 
                                        y1="0" 
                                        x2={previewProgress * 100} 
                                        y2="40" 
                                        stroke="#475569" 
                                        strokeWidth="0.5" 
                                        strokeDasharray="1,1" 
                                      />
                                      {/* Pulsing real-time playhead dot */}
                                      <circle 
                                        cx={previewProgress * 100} 
                                        cy={35 - getEasedProgress(previewProgress, motionEas) * 30} 
                                        r="2.5" 
                                        fill={
                                          motionEas === 'elastic' ? '#f43f5e' : 
                                          motionEas === 'bounce' ? '#fbbf24' : 
                                          motionEas === 'linear' ? '#10b981' : 
                                          '#6366f1'
                                        }
                                        className="animate-pulse"
                                        style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
                                      />
                                    </svg>
                                    
                                    {/* Eased value display badge */}
                                    <div className="absolute top-1 right-2 text-[8px] font-mono text-slate-500 flex items-center gap-1.5 bg-slate-900/90 px-1 py-0.5 rounded border border-slate-800">
                                      <span>t = {(previewProgress * 100).toFixed(0)}%</span>
                                      <span className="w-1 h-2 bg-slate-700"></span>
                                      <span className="text-indigo-400 font-bold">Val: {getEasedProgress(previewProgress, motionEas).toFixed(2)}</span>
                                    </div>
                                  </div>

                                  {/* Acceleration & Ease Info Bar */}
                                  <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
                                    <span>0.00s (0%)</span>
                                    <span>Interactive Graph Curve</span>
                                    <span>4.00s (100%)</span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
              )}
            </div>
          )}

          {/* Copyright Shield notice panel */}
          <div className="p-4 bg-slate-50/80 mt-auto">
            <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-100">
              <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" /> Copyright Shield Active
              </h4>
              <p className="text-[10px] text-indigo-600/90 leading-relaxed">
                Curated procedural assets are automatically generated to maintain distinct shapes from famous copyrighted design brands, keeping your commercial livestreams 100% compliant.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer: Prompts, Bleeds, and History Gallery */}
      <footer className="bg-white border-t border-slate-200 shrink-0 z-10">
        
        {/* Gallery Slider Drawer */}
        <div className="px-6 py-3.5 border-b border-slate-100 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" /> Active Render Library
            </h4>
            <span className="text-[9px] text-slate-400 font-medium">Select to swap active stage theme background instantly</span>
          </div>

          <motion.div layout className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-thin">
            <AnimatePresence mode="popLayout">
              {gallery.map((item) => {
                const isActive = activeBg.id === item.id;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: -30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 30 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      layout: { duration: 0.25, type: 'spring' }
                    }}
                    onClick={() => {
                      setActiveBg(item);
                      setSelectedPresetId(item.isPreset ? item.id : '');
                    }}
                    className={`relative h-20 aspect-[9/16] rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition-shadow ${
                      isActive
                        ? 'border-indigo-600 scale-102 shadow-md ring-2 ring-indigo-500/10'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.prompt || 'Gallery backdrop'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-[6.5px] text-white px-1 py-0.5 rounded-xs font-mono">
                      {item.isPreset ? 'Preset' : item.modelUsed ? 'AI' : 'Custom'}
                    </div>

                    {isActive && (
                      <div className="absolute inset-0 bg-indigo-600/15 flex items-center justify-center">
                        <div className="p-0.5 bg-indigo-600 rounded-full text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Big Smart Prompt Input Bar as detailed in "Professional Polish" footer */}
        <div className="h-20 px-6 flex items-center space-x-6">
          <div className="flex-1 bg-slate-100 rounded-xl h-12 flex items-center px-4 space-x-4 border border-slate-200">
            <div className="text-indigo-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95l.1 2.378a9.001 9.001 0 017.653 7.653l2.378.1a1 1 0 01.95.897 1 1 0 01-.95.897l-2.378.1a9.001 9.001 0 01-7.653 7.653l-.1 2.378a1 1 0 01-.897.95 1 1 0 01-.897-.95l-.1-2.378a9.001 9.001 0 01-7.653-7.653l-2.378-.1a1 1 0 01-.95-.897 1 1 0 01.95-.897l2.378-.1a9.001 9.001 0 017.653-7.653l.1-2.378a1 1 0 01.897-.95zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-transparent flex-1 text-xs md:text-sm text-slate-800 placeholder-slate-400 border-none outline-none focus:ring-0" 
              placeholder="Describe your 3D live scene... e.g. 'Minimalist luxury vanity with soft morning light, floating geometric spheres, pastel peach backdrop'"
            />
            <button 
              onClick={() => {
                setEditorMode('new');
                handleGenerateImage();
              }}
              className="bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Refine Prompt
            </button>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Sampling Quality</span>
              <span className="text-xs text-slate-700 font-bold">512 Steps / Ultra 3D</span>
            </div>
            <button 
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-100 transition duration-150 transform active:scale-95 cursor-pointer"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                </svg>
              )}
            </button>
          </div>

        </div>
      </footer>

      {isRecordingVideo && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4 animate-bounce">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Generating High-Fidelity Video Loop</h3>
            <p className="text-xs text-slate-500 mb-5 max-w-sm">
              We are capturing the live heart animations and interactive overlays at ultra-sharp <span className="font-semibold text-slate-700">1080x1920</span> resolution. This will take just a few seconds.
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
              <div 
                className="bg-rose-500 h-2.5 rounded-full transition-all duration-150"
                style={{ width: `${videoRecordingProgress}%` }}
              />
            </div>
            
            <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
              <span>Encoding Looping Frame</span>
              <span className="text-rose-500">{videoRecordingProgress}% Complete</span>
            </div>

            <div className="text-[10px] text-slate-400 italic">
              Please keep this window active for smooth capturing.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
