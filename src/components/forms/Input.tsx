import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export interface InputProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  onChange?: (e: { target: { value: string } }) => void;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      containerStyle,
      inputStyle,
      type,
      onChange,
      onChangeText,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const isPasswordType = type === 'password' || props.secureTextEntry;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const keyboardType =
      props.keyboardType ||
      (type === 'number' ? 'numeric' : type === 'email' ? 'email-address' : 'default');

    const handleChangeText = (text: string) => {
      if (onChangeText) {
        onChangeText(text);
      }
      if (onChange) {
        onChange({ target: { value: text } });
      }
    };

    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Text style={styles.label}>
            {label}
            {props.required && <Text style={styles.required}> *</Text>}
          </Text>
        ) : null}

        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputFocused,
            error ? styles.inputError : null,
          ]}
        >
          {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isPasswordType && !isPasswordVisible}
            keyboardType={keyboardType}
            placeholderTextColor={colors.neutral[400]}
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeftIcon : null,
              rightIcon || isPasswordType ? styles.inputWithRightIcon : null,
              inputStyle,
            ]}
            {...props}
          />

          {isPasswordType ? (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.rightIcon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              {isPasswordVisible ? (
                <EyeOff size={18} color={isFocused ? colors.primary.DEFAULT : colors.neutral[500]} />
              ) : (
                <Eye size={18} color={isFocused ? colors.primary.DEFAULT : colors.neutral[500]} />
              )}
            </TouchableOpacity>
          ) : rightIcon ? (
            <View style={styles.rightIcon}>{rightIcon}</View>
          ) : null}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!error && hint ? <Text style={styles.hintText}>{hint}</Text> : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[800],
    letterSpacing: 0.1,
  },
  required: {
    color: colors.semantic.danger.DEFAULT,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    minHeight: 48,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  inputFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primary.DEFAULT,
    shadowColor: colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  inputError: {
    borderColor: colors.semantic.danger.DEFAULT,
    backgroundColor: '#FFF8F8',
    shadowColor: colors.semantic.danger.DEFAULT,
    shadowOpacity: 0.12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.neutral[900],
  },
  inputWithLeftIcon: {
    paddingLeft: 44,
  },
  inputWithRightIcon: {
    paddingRight: 44,
  },
  leftIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 14,
    zIndex: 1,
  },
  errorText: {
    fontSize: 11.5,
    color: colors.semantic.danger.DEFAULT,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 11.5,
    color: colors.neutral[500],
  },
});

