import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { Card } from './Card';
import { colors } from '@/theme/colors';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = colors.primary.soft,
  iconColor = colors.primary.vibrant,
  trend,
  onClick,
  onPress,
  style,
}) => {
  return (
    <Card
      onPress={onPress || onClick}
      style={[styles.container, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.textColumn}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
          <Icon size={20} color={iconColor} />
        </View>
      </View>

      {(subtitle || trend) && (
        <View style={styles.bottomRow}>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : <View />}
          {trend ? (
            <Text
              style={[
                styles.trendText,
                trend.isPositive ? styles.trendPositive : styles.trendNegative,
              ]}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </Text>
          ) : null}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textColumn: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[500],
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.neutral[900],
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  subtitle: {
    fontSize: 11,
    color: colors.neutral[500],
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendPositive: {
    color: colors.semantic.success.DEFAULT,
  },
  trendNegative: {
    color: colors.semantic.danger.DEFAULT,
  },
});
