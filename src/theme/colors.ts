// ============================================================================
// Petani Tech Seller Center - Design Tokens: Colors
// ============================================================================

export const colors = {
  // Brand Primary (Tema Hijau Pertanian Modern #32CD32)
  primary: {
    DEFAULT: '#32CD32', // LimeGreen brand utama
    hover: '#28B828',
    dark: '#1E8224',    // Kontras tinggi untuk teks di atas background putih
    deep: '#15803D',    // Deep forest green
    vibrant: '#32CD32', // Vibrant accent
    light: '#4ADE80',   // Light green
    border: '#A7F3D0',  // Border aksen hijau
    soft: '#F0FDF4',    // Background badge & icon container
    tint: '#DCFCE7',    // Tint lembut
    gradient: ['#32CD32', '#22C55E'] as [string, string],
    gradientLight: ['#F0FDF4', '#FFFFFF'] as [string, string],
    gradientHero: ['#32CD32', '#16A34A'] as [string, string],
    gradientHeader: ['#F0FDF4', '#FFFFFF'] as [string, string],
  },

  // Netral, Surface & Latar Belakang (Dominan Putih & Bersih)
  neutral: {
    900: '#0F172A', // Slate Dark (Judul & Heading)
    800: '#1E293B', // Charcoal Slate (Tombol Sekunder)
    700: '#334155', // Body Text Utama
    600: '#64748B', // Muted Body / Subtitle
    500: '#94A3B8', // Subtle Secondary Slate
    400: '#CBD5E1', // Border / Slate Gray
    300: '#E2E8F0', // Border Card Lembut & Placeholder
    200: '#E5E7EB', // Divider halus
    100: '#F1F5F9', // Surface Lembut
    50: '#F8FAFC',  // Background Halaman Utama (Dominan Putih-Abu Sejuk)
    white: '#FFFFFF',
  },

  // Status & Umpan Balik (Semantic)
  semantic: {
    success: {
      DEFAULT: '#22C55E',
      text: '#166534',
      bg: '#F0FDF4',
      border: '#BBF7D0',
    },
    warning: {
      DEFAULT: '#F59E0B',
      text: '#B45309',
      bg: '#FFFBEB',
      border: '#FDE68A',
    },
    danger: {
      DEFAULT: '#EF4444',
      text: '#B91C1C',
      bg: '#FEF2F2',
      border: '#FECACA',
    },
    info: {
      DEFAULT: '#3B82F6',
      text: '#1D4ED8',
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
  },

  // Aksen Kategori & Quick Menu (Dashboard)
  categories: {
    products: { icon: '#F59E0B', bg: '#FFFBEB' },
    orders: { icon: '#10B981', bg: '#ECFDF5' },
    finance: { icon: '#3B82F6', bg: '#EFF6FF' },
    inventory: { icon: '#64748B', bg: '#F1F5F9' },
    promotions: { icon: '#8B5CF6', bg: '#F5F3FF' },
    analytics: { icon: '#EC4899', bg: '#FDF2F8' },
  },
} as const;

export type Colors = typeof colors;

