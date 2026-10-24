import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'gradient' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'softGreen';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || isLoading;
  const isGradient = variant === 'primary' || variant === 'gradient';

  const isTextLike =
    typeof children === 'string' ||
    typeof children === 'number' ||
    (Array.isArray(children) && children.every((c) => typeof c === 'string' || typeof c === 'number'));

  const content = (
    <>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost' || variant === 'softGreen'
              ? colors.primary.dark
              : '#FFFFFF'
          }
          style={styles.spinner}
        />
      ) : (
        leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>
      )}

      {isTextLike ? (
        <Text
          style={[
            styles.text,
            isGradient ? styles.primaryText : styles[`${variant}Text`],
            styles[`${size}Text`],
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}

      {!isLoading && rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </>
  );

  if (isGradient) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        onPress={onPress}
        style={[styles.touchableWrapper, isDisabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={colors.primary.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.8 }}
          style={[styles.base, styles[size], styles.gradientBase]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#32CD32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    gap: 8,
  },
  gradientBase: {
    width: '100%',
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 46,
  },
  lg: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary.DEFAULT,
  },
  gradient: {
    backgroundColor: colors.primary.DEFAULT,
  },
  secondary: {
    backgroundColor: colors.neutral[800],
  },
  outline: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.primary.DEFAULT,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.semantic.danger.DEFAULT,
  },
  softGreen: {
    backgroundColor: colors.primary.soft,
    borderWidth: 1,
    borderColor: colors.primary.border,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 15,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  gradientText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.primary.dark,
  },
  ghostText: {
    color: colors.neutral[800],
  },
  dangerText: {
    color: '#FFFFFF',
  },
  softGreenText: {
    color: colors.primary.dark,
  },
  spinner: {
    marginRight: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

