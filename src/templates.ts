import { PromptPreset } from './types';

export const CATEGORIES = [
  'All Presets',
  'Beauty & Cosmetics',
  'Fashion & Apparel',
  'Tech & Gadgets',
  'Kitchen & Food',
  'Minimalist 3D',
  'Luxury & Sparkle'
];

export const PRESETS: PromptPreset[] = [
  {
    id: 'beauty-pink',
    name: 'Cosmetic Vanity Studio',
    category: 'Beauty & Cosmetics',
    prompt: 'A minimalist soft pink cosmetics vanity studio, clean wooden shelf displaying elegant glass skincare bottles, pastel pink organic plaster wall, cinematic warm studio lights, ultra clean details',
    accentColor: '#f43f5e'
  },
  {
    id: 'organic-beige',
    name: 'Eco Skincare & Spa',
    category: 'Beauty & Cosmetics',
    prompt: 'A premium natural eco skincare display shelf with fresh eucalyptus branch, raw stone pedestal, soft beige textured lime-wash wall, morning golden light streaming through a window with shadows',
    accentColor: '#059669'
  },
  {
    id: 'fashion-boutique',
    name: 'Elegant Warm Boutique',
    category: 'Fashion & Apparel',
    prompt: 'An elegant apparel boutique corner, minimalist golden clothing rack with pastel hangers, arch doorway in background, cream concrete floor, warm ambient soft glow, smooth rendering',
    accentColor: '#d97706'
  },
  {
    id: 'fashion-aesthetic',
    name: 'Neutral Aesthetic Closet',
    category: 'Fashion & Apparel',
    prompt: 'A neutral warm aesthetic walk-in closet, round velvet ottoman in the center, beige paneling walls, soft indirect shelf lighting, cozy welcoming premium vibes',
    accentColor: '#78350f'
  },
  {
    id: 'tech-neon',
    name: 'Cyber Neon Showcase',
    category: 'Tech & Gadgets',
    prompt: 'A premium futuristic electronic device showcase, dark blue slate background, subtle cyan and purple soft LED neon lighting, floating geometric glass panels, smooth and colourful',
    accentColor: '#7c3aed'
  },
  {
    id: 'tech-minimal',
    name: 'Warm Scandinavian Workspace',
    category: 'Tech & Gadgets',
    prompt: 'A clean Scandinavian minimal desk setup with a wooden pegboard, a green succulent plant in a ceramic pot, soft warm desk lamp, light grey wall, comfortable cozy workspace',
    accentColor: '#2563eb'
  },
  {
    id: 'kitchen-marble',
    name: 'Modern Marble Kitchen',
    category: 'Kitchen & Food',
    prompt: 'A modern bright live cooking kitchen background, clean white marble countertop, elegant gold faucet, light wood cabinets, fresh herbs in a ceramic bowl, bright daylight',
    accentColor: '#0ea5e9'
  },
  {
    id: 'food-bakery',
    name: 'Warm Cozy Coffee Shop',
    category: 'Kitchen & Food',
    prompt: 'A warm cozy bakery cafe counter, aesthetic glass dome displaying colorful macarons, soft espresso machine steam, warm pendant lighting, brick wall in soft focus',
    accentColor: '#b45309'
  },
  {
    id: 'pastel-geometric',
    name: '3D Abstract Pastel Shapes',
    category: 'Minimalist 3D',
    prompt: 'An abstract 3D unreal engine render of soft geometric spheres and arches, pastel pink, mint green and pale yellow color blocks, smooth glossy texture, modern pop aesthetic',
    accentColor: '#ec4899'
  },
  {
    id: 'minimal-arches',
    name: 'Beige Architectural Arches',
    category: 'Minimalist 3D',
    prompt: 'A series of minimalist architectural plaster arches, soft light casting dramatic but pleasant curves, clean beige sand textured walls, peaceful elegant background',
    accentColor: '#6b7280'
  },
  {
    id: 'luxury-gold',
    name: 'Golden Velvet Stage',
    category: 'Luxury & Sparkle',
    prompt: 'A premium luxury product stage with gold trim, deep royal emerald green velvet background, subtle floating gold dust particles, warm elegant spotlights, premium 3D render',
    accentColor: '#10b981'
  }
];

// High-quality CDN Fallback Images corresponding to categories for instant high-fidelity rendering
export const FALLBACK_IMAGES: Record<string, string> = {
  'beauty-pink': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=720&q=80',
  'organic-beige': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=720&q=80',
  'fashion-boutique': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=720&q=80',
  'fashion-aesthetic': 'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=720&q=80',
  'tech-neon': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=720&q=80',
  'tech-minimal': 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=720&q=80',
  'kitchen-marble': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=720&q=80',
  'food-bakery': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=720&q=80',
  'pastel-geometric': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=720&q=80',
  'minimal-arches': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=720&q=80',
  'luxury-gold': 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?auto=format&fit=crop&w=720&q=80',
};
