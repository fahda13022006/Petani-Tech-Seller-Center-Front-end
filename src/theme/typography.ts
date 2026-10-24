// ============================================================================
// Petani Tech Seller Center - Design Tokens: Typography
// ============================================================================

export const typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 14,
    snug: 18,
    normal: 20,
    relaxed: 24,
    loose: 32,
  },
} as const;
