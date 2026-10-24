import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

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
      ...props
    },
    ref
  ) => {
    const isPassword = type === 'password' || props.secureTextEntry;
    const keyboardType =
      props.keyboardType || (type === 'number' ? 'numeric' : type === 'email' ? 'email-address' : 'default');

    const handleChangeText = (text: string) => {
      if (onChangeText) {
        onChangeText(text);
      }
      if (onChange) {
        onChange({ target: { value: text } });
      }
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
          {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            secureTextEntry={isPassword}
            keyboardType={keyboardType}
            placeholderTextColor="#A0A8A0"
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeftIcon : null,
              rightIcon ? styles.inputWithRightIcon : null,
              inputStyle,
            ]}
            {...props}
          />
          {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
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
    color: '#24342A',
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8DE',
    borderRadius: 14,
    minHeight: 46,
  },
  inputError: {
    borderColor: '#D95757',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#213329',
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  errorText: {
    fontSize: 11,
    color: '#D95757',
    fontWeight: '500',
  },
  hintText: {
    fontSize: 11,
    color: '#818981',
  },
});
