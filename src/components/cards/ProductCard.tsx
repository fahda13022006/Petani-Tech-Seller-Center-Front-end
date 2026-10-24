import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Product } from '@/types/product';
import { Card } from './Card';
import { Badge } from '@/components/common/Badge';
import { formatRupiah } from '@/utils/formatters';
import { colors } from '@/theme/colors';
import { Package, Star } from 'lucide-react-native';

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
  const getBadgeVariant = (status: Product['status']) => {
    switch (status) {
      case 'Aktif':
        return 'success';
      case 'Stok Menipis':
        return 'warning';
      case 'Habis':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <Card onPress={onPress} style={[styles.card, style]}>
      <View style={styles.row}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={styles.imageFallback}>
            <Package size={24} color={colors.neutral[400]} />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <Badge variant={getBadgeVariant(product.status)} size="sm">
              {product.status}
            </Badge>
          </View>

          <Text style={styles.category}>{product.category} {product.subcategory ? `· ${product.subcategory}` : ''}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatRupiah(product.price)}</Text>
            <Text style={styles.stock}>Stok: {product.stock} {product.unit}</Text>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.ratingRow}>
              <Star size={12} color="#EAB308" fill="#EAB308" />
              <Text style={styles.ratingText}>{product.rating} · Terjual {product.soldCount}</Text>
            </View>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
                <Text style={styles.editBtnText}>Ubah</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: colors.neutral[100],
  },
  imageFallback: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  category: {
    fontSize: 11,
    color: colors.neutral[500],
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary.DEFAULT,
  },
  stock: {
    fontSize: 11,
    color: colors.neutral[600],
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 10,
    color: colors.neutral[600],
  },
  editBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.primary.soft,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary.deep,
  },
});
