import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Product } from '@/types/product';
import { Card } from './Card';
import { Badge } from '@/components/common/Badge';
import { formatRupiah } from '@/constants';
import { resolveProductImage } from '@/utils/productImage';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/ThemeContext';
import { Edit2 } from 'lucide-react-native';

export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onEdit?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const getBadgeVariant = (status: Product['status']): 'brand' | 'warning' | 'danger' | 'neutral' => {
    switch (status) {
      case 'Aktif':
        return 'brand';
      case 'Stok Menipis':
        return 'warning';
      case 'Habis':
        return 'danger';
      case 'Sedang Diperiksa':
      default:
        return 'neutral';
    }
  };

  return (
    <Card
      onPress={onPress}
      sheen
      variant="elevated"
      style={[
        styles.card,
        {
          backgroundColor: isDark ? 'rgba(22, 58, 38, 0.72)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(209, 245, 232, 0.16)' : '#DDE8E0',
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {/* Thumbnail */}
        <Image
          source={resolveProductImage(product.image, product.name)}
          style={[
            styles.image,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F8FAF8',
              borderColor: isDark ? 'rgba(209, 245, 232, 0.18)' : '#DDE8E0',
            },
          ]}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.category,
                { color: isDark ? '#D1F5E8' : '#64746A' },
              ]}
              numberOfLines={1}
            >
              {product.category}
            </Text>
            <Badge variant={getBadgeVariant(product.status)} size="sm" dot>
              {product.status}
            </Badge>
          </View>

          <Text
            style={[
              styles.name,
              { color: isDark ? '#FFFFFF' : '#183326' },
            ]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <Text style={[styles.skuText, { color: isDark ? '#8BA899' : '#7E9180' }]}>
            SKU: {product.sku} {product.unit ? `· ${product.unit}` : ''}
          </Text>

          <View style={styles.footerRow}>
            <Text
              style={[
                styles.price,
                { color: isDark ? '#ECF39E' : colors.primaryDark },
              ]}
            >
              {formatRupiah(product.price)}
            </Text>

            <View style={styles.actionsRight}>
              <Text style={[styles.stock, { color: isDark ? '#D1F5E8' : '#64746A' }]}>
                Stok:{' '}
                <Text style={[styles.stockBold, { color: isDark ? '#FFFFFF' : '#183326' }]}>
                  {product.stock}
                </Text>
              </Text>

              {onEdit ? (
                <TouchableOpacity
                  onPress={onEdit}
                  style={[
                    styles.editBtn,
                    {
                      backgroundColor: isDark ? 'rgba(64, 145, 108, 0.30)' : '#F2FBF5',
                      borderColor: isDark ? 'rgba(209, 245, 232, 0.25)' : '#DDE8E0',
                    },
                  ]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  activeOpacity={0.75}
                  accessibilityLabel="Ubah produk"
                >
                  <Edit2 size={13} color={isDark ? '#D1F5E8' : colors.primaryDark} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#183326',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 16,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  category: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    flex: 1,
    marginRight: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
    lineHeight: 19,
    marginBottom: 2,
  },
  skuText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    marginBottom: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: {
    fontSize: 15.5,
    fontWeight: '800',
    fontFamily: typography.fontFamily.extrabold,
    letterSpacing: -0.2,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stock: {
    fontSize: 11.5,
    fontFamily: typography.fontFamily.regular,
  },
  stockBold: {
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
  },
  editBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
