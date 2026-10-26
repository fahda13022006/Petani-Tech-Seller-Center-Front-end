import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Sun, Moon, Smartphone, Check } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { ThemeMode } from '@/theme/types';
import { typography } from '@/theme/typography';

interface ThemeOption {
  key: ThemeMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: typeof Sun;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    key: 'light',
    label: 'Mode Terang',
    shortLabel: 'Terang',
    description: 'Latar bersih dan aksen hijau alami khas Petani Tech',
    icon: Sun,
  },
  {
    key: 'dark',
    label: 'Mode Gelap',
    shortLabel: 'Gelap',
    description: 'Nuansa forest green yang nyaman di mata untuk malam hari',
    icon: Moon,
  },
  {
    key: 'system',
    label: 'Ikuti Sistem',
    shortLabel: 'Sistem',
    description: 'Tema otomatis menyesuaikan preferensi tampilan perangkat Anda',
    icon: Smartphone,
  },
];

export function ThemeSelector() {
  const { mode, setMode, colors, isDark } = useTheme();

  const currentOption = THEME_OPTIONS.find((opt) => opt.key === mode) || THEME_OPTIONS[0];

  return (
    <View style={styles.container}>
      {/* 3-Column Segmented Cards */}
      <View style={styles.gridRow}>
        {THEME_OPTIONS.map((option) => {
          const isSelected = mode === option.key;
          const Icon = option.icon;

          return (
            <TouchableOpacity
              key={option.key}
              onPress={() => setMode(option.key)}
              activeOpacity={0.75}
              style={[
                styles.optionCard,
                {
                  backgroundColor: isSelected
                    ? isDark
                      ? 'rgba(64, 145, 108, 0.32)'
                      : '#D1F5E8'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : '#FFFFFF',
                  borderColor: isSelected
                    ? isDark
                      ? colors.mint
                      : colors.primary
                    : isDark
                    ? 'rgba(209, 245, 232, 0.15)'
                    : '#E6EDE7',
                },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option.label}
            >
              {/* Top Row: Icon + Checkmark */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(209, 245, 232, 0.25)'
                          : colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : '#F0F5F1',
                    },
                  ]}
                >
                  <Icon
                    size={18}
                    color={
                      isSelected
                        ? isDark
                          ? '#D1F5E8'
                          : '#FFFFFF'
                        : isDark
                        ? colors.mint
                        : colors.primaryDark
                    }
                  />
                </View>

                {isSelected ? (
                  <View
                    style={[
                      styles.checkCircle,
                      {
                        backgroundColor: isDark ? colors.mint : colors.primary,
                      },
                    ]}
                  >
                    <Check
                      size={10}
                      color={isDark ? '#183D2A' : '#FFFFFF'}
                      strokeWidth={3}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.uncheckCircle,
                      {
                        borderColor: isDark
                          ? 'rgba(255, 255, 255, 0.2)'
                          : '#DDE8E0',
                      },
                    ]}
                  />
                )}
              </View>

              {/* Title */}
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color: isSelected
                      ? isDark
                        ? '#FFFFFF'
                        : '#183D2A'
                      : colors.text,
                    fontFamily: isSelected
                      ? typography.fontFamily.bold
                      : typography.fontFamily.medium,
                  },
                ]}
                numberOfLines={1}
              >
                {option.shortLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Supporting Description of Active Theme */}
      <View
        style={[
          styles.descriptionBox,
          {
            backgroundColor: isDark ? 'rgba(11, 32, 20, 0.65)' : '#FAF9F6',
            borderColor: isDark ? 'rgba(209, 245, 232, 0.12)' : '#EDF2EE',
          },
        ]}
      >
        <Text style={[styles.descTitle, { color: colors.textSecondary }]}>
          {currentOption.label} Aktif
        </Text>
        <Text style={[styles.descText, { color: colors.textMuted }]}>
          {currentOption.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
  },
  optionLabel: {
    fontSize: 12.5,
    letterSpacing: -0.2,
  },
  descriptionBox: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    gap: 2,
  },
  descTitle: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
  },
  descText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 15,
  },
});
