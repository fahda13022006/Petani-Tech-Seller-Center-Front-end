import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface CardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bordered?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  bordered = true,
  onClick,
  onPress,
}) => {
  const handlePress = onPress || onClick;

  if (handlePress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={handlePress}
        style={[styles.card, bordered && styles.bordered, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, bordered && styles.bordered, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bordered: {
    borderWidth: 1,
    borderColor: '#E8ECE7',
  },
});
