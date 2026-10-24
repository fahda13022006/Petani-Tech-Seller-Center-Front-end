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

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'softGreen';
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
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' || variant === 'softGreen' ? '#3E7821' : '#FFFFFF'}
          style={styles.spinner}
        />
      ) : (
        leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>
      )}

      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}

      {!isLoading && rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    gap: 8,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 34,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 52,
  },
  primary: {
    backgroundColor: '#5A9B2E',
  },
  secondary: {
    backgroundColor: '#2F2F2F',
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7FB257',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#D95757',
  },
  softGreen: {
    backgroundColor: '#EAF4E3',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#3E7821',
  },
  ghostText: {
    color: '#2F2F2F',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  softGreenText: {
    color: '#3E7821',
  },
  spinner: {
    marginRight: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
