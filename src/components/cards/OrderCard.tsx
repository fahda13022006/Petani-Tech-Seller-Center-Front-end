import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { Order } from '@/types/order';
import { Card } from './Card';
import { Badge } from '@/components/common/Badge';
import { formatRupiah, formatDate } from '@/utils/formatters';
import { colors } from '@/theme/colors';
import { Truck, User, Calendar } from 'lucide-react-native';

export interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  style,
}) => {
  const getBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Selesai':
        return 'success';
      case 'Diproses':
        return 'info';
      case 'Dikirim':
        return 'brand';
      case 'Menunggu Pembayaran':
        return 'warning';
      case 'Dibatalkan':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <Card onPress={onPress} style={[styles.card, style]}>
      {/* Header: Order ID & Status */}
      <View style={styles.header}>
        <View style={styles.idCol}>
          <Text style={styles.orderNumber}>{order.orderNumber || order.id}</Text>
          <View style={styles.dateRow}>
            <Calendar size={11} color={colors.neutral[500]} />
            <Text style={styles.dateText}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>
        <Badge variant={getBadgeVariant(order.status)} size="sm">
          {order.status}
        </Badge>
      </View>

      {/* Buyer & Courier Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <User size={13} color={colors.neutral[500]} />
          <Text style={styles.infoText} numberOfLines={1}>{order.buyerName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Truck size={13} color={colors.neutral[500]} />
          <Text style={styles.infoText}>{order.courier}</Text>
        </View>
      </View>

      {/* Item Summary & Total */}
      <View style={styles.footer}>
        <Text style={styles.itemsSummary}>
          {order.items.length} Barang ({order.items.reduce((acc, i) => acc + i.quantity, 0)} Pcs)
        </Text>
        <View style={styles.totalCol}>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalValue}>{formatRupiah(order.totalAmount)}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  idCol: {
    gap: 3,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.neutral[900],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: colors.neutral[500],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral[100],
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: colors.neutral[700],
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemsSummary: {
    fontSize: 11,
    color: colors.neutral[500],
  },
  totalCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.neutral[500],
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary.DEFAULT,
  },
});
