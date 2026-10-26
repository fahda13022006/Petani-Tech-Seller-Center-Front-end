export * from './colors';
export * from './typography';
export * from './spacing';
export * from './types';
export * from './tokens';
export * from './ThemeContext';

import { colors, brand } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows, glassSurfaces } from './spacing';

export const theme = {
  colors,
  brand,
  typography,
  spacing,
  borderRadius,
  shadows,
  glassSurfaces,
} as const;

export type Theme = typeof theme;
