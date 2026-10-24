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
  return (
    <View style={[styles.base, styles[variant], size === 'sm' ? styles.sizeSm : styles.sizeMd, style]}>
      {dot && <View style={[styles.dot, styles[`${variant}Dot`]]} />}
      {typeof children === 'string' || typeof children === 'number' ? (
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
    paddingVertical: 2,
    gap: 4,
  },
  sizeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: 10,
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
    backgroundColor: '#EAF4E3',
    borderColor: '#A9CF8C',
  },
  brandText: {
    color: '#3E7821',
  },
  brandDot: {
    backgroundColor: '#5A9B2E',
  },
  success: {
    backgroundColor: '#EAF6EB',
    borderColor: '#A5D6A7',
  },
  successText: {
    color: '#2E7D32',
  },
  successDot: {
    backgroundColor: '#4C9B52',
  },
  warning: {
    backgroundColor: '#FFF8E7',
    borderColor: '#FDE68A',
  },
  warningText: {
    color: '#D97706',
  },
  warningDot: {
    backgroundColor: '#E9A23B',
  },
  danger: {
    backgroundColor: '#FDF0F0',
    borderColor: '#FCA5A5',
  },
  dangerText: {
    color: '#D95757',
  },
  dangerDot: {
    backgroundColor: '#D95757',
  },
  info: {
    backgroundColor: '#EDF5FD',
    borderColor: '#BFDBFE',
  },
  infoText: {
    color: '#2563EB',
  },
  infoDot: {
    backgroundColor: '#4C89C6',
  },
  neutral: {
    backgroundColor: '#F4F4F4',
    borderColor: '#E5E5E5',
  },
  neutralText: {
    color: '#555555',
  },
  neutralDot: {
    backgroundColor: '#8E8E8E',
  },
});
