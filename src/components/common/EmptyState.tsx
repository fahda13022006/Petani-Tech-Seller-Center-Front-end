import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import {
  AlertCircle,
  SearchX,
  Package,
  ShoppingCart,
  Inbox,
} from 'lucide-react-native';
import { Button } from './Button';

export type EmptyStateVariant = 'products' | 'orders' | 'transactions' | 'search' | 'error' | 'default';

const VARIANT_CONFIG = {
  products: {
    emoji: '🌱',
    title: 'Belum Ada Produk',
    description: 'Tambahkan produk pertanian pertama Anda untuk mulai berjualan ke ribuan petani.',
    icon: Package,
  },
  orders: {
    emoji: '📦',
    title: 'Belum Ada Pesanan',
    description: 'Aktifkan fitur promosi musim tanam untuk mendatangkan pesanan baru.',
    icon: ShoppingCart,
  },
  transactions: {
    emoji: '💳',
    title: 'Belum Ada Transaksi',
    description: 'Riwayat transaksi keuangan toko akan muncul di sini setelah ada penjualan.',
    icon: Inbox,
  },
  search: {
    emoji: '🔍',
    title: 'Hasil Pencarian Kosong',
    description: 'Tidak ada data yang sesuai dengan kata kunci atau filter yang Anda pilih.',
    icon: SearchX,
  },
  error: {
    emoji: '⚠️',
    title: 'Terjadi Kesalahan',
    description: 'Gagal memuat data. Periksa koneksi internet dan coba lagi.',
    icon: AlertCircle,
  },
  default: {
    emoji: '📋',
    title: 'Data Kosong',
    description: 'Belum ada data yang tersedia untuk ditampilkan saat ini.',
    icon: Inbox,
  },
};

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  emoji?: string;
  action?: {
    label: string;
    onClick?: () => void;
    onPress?: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    onPress?: () => void;
  };
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'default',
  title,
  description,
  emoji,
  action,
  secondaryAction,
  style,
}) => {
  const config = VARIANT_CONFIG[variant];
  const displayEmoji = emoji ?? config.emoji;
  const displayTitle = title ?? config.title;
  const displayDesc = description ?? config.description;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.emojiCircle}>
        <Text style={styles.emojiText}>{displayEmoji}</Text>
      </View>

      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.description}>{displayDesc}</Text>

      {action ? (
        <View style={styles.actionRow}>
          <Button
            variant="primary"
            size="md"
            onPress={action.onPress || action.onClick}
          >
            {action.label}
          </Button>
          {secondaryAction ? (
            <Button
              variant="ghost"
              size="md"
              onPress={secondaryAction.onPress || secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Gagal memuat data. Silakan coba lagi.',
  onRetry,
  style,
}) => (
  <View style={[styles.container, style]}>
    <View style={[styles.emojiCircle, styles.errorCircle]}>
      <AlertCircle size={32} color="#D95757" />
    </View>
    <Text style={styles.title}>Oops! Terjadi Kesalahan</Text>
    <Text style={styles.description}>{message}</Text>
    {onRetry ? (
      <Button variant="outline" size="sm" onPress={onRetry}>
        Coba Lagi
      </Button>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 8,
  },
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAF4E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  errorCircle: {
    backgroundColor: '#FDF0F0',
  },
  emojiText: {
    fontSize: 28,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#213329',
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#818981',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
