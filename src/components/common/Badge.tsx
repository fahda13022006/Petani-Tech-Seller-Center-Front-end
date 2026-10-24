import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface BadgeProps {

  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  dot = false,
  style,
  textStyle,
}) => {
  const isTextLike =
    typeof children === 'string' ||
    typeof children === 'number' ||
    (Array.isArray(children) && children.every((c) => typeof c === 'string' || typeof c === 'number'));

  return (
    <View style={[styles.base, styles[variant], size === 'sm' ? styles.sizeSm : styles.sizeMd, style]}>
      {dot && <View style={[styles.dot, styles[`${variant}Dot`]]} />}
      {isTextLike ? (
        <Text style={[styles.text, styles[`${variant}Text`], size === 'sm' ? styles.textSm : styles.textMd, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9999,
    borderWidth: 1,
  },
  sizeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    gap: 4,
  },
  sizeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    gap: 5,
  },
  text: {
    fontWeight: '700',
  },
  textSm: {
    fontSize: 10.5,
  },
  textMd: {
    fontSize: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  brand: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  brandText: {
    color: '#15803D',
  },
  brandDot: {
    backgroundColor: '#22C55E',
  },
  success: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  successText: {
    color: '#166534',
  },
  successDot: {
    backgroundColor: '#22C55E',
  },
  warning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  warningText: {
    color: '#B45309',
  },
  warningDot: {
    backgroundColor: '#F59E0B',
  },
  danger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  dangerText: {
    color: '#B91C1C',
  },
  dangerDot: {
    backgroundColor: '#EF4444',
  },
  info: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  infoText: {
    color: '#1D4ED8',
  },
  infoDot: {
    backgroundColor: '#3B82F6',
  },
  neutral: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  neutralText: {
    color: '#64748B',
  },
  neutralDot: {
    backgroundColor: '#94A3B8',
  },
});

