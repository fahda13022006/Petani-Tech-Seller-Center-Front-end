import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductStore } from '@/store/useProductStore';
import { ProductFilterTab, Product } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { formatRupiah, PRODUCT_CATEGORIES } from '@/constants';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Boxes,
  AlertTriangle,
} from 'lucide-react-native';

const TABS: { key: ProductFilterTab; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'low_stock', label: 'Stok Menipis' },
  { key: 'out_of_stock', label: 'Habis' },
  { key: 'review', label: 'Review' },
];

export function ProductsScreen() {
  const {
    products,
    activeTab,
    searchQuery,
    selectedCategory,
    fetchProducts,
    setActiveTab,
    setSearchQuery,
    setSelectedCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
  } = useProductStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [newStockInput, setNewStockInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStockSave = async () => {
    if (!stockModalProduct || newStockInput.trim() === '') return;
    const num = parseInt(newStockInput, 10);
    if (isNaN(num) || num < 0) {
      Alert.alert('Error', 'Masukkan jumlah stok yang valid.');
      return;
    }
    await updateStock(stockModalProduct.id, num);
    setStockModalProduct(null);
    setNewStockInput('');
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Hapus Produk',
      `Yakin ingin menghapus produk "${name}" dari katalog toko?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(id);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.screenTitle}>Produk Saya</Text>
          <Text style={styles.screenSubtitle}>
            Kelola katalog pupuk, benih, dan alat pertanian
          </Text>
        </View>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} color="#FFFFFF" />}
          onPress={() => {
            setEditingProduct(null);
            setIsAddModalOpen(true);
          }}
        >
          Tambah
        </Button>
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Search size={18} color="#818981" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              fetchProducts();
            }}
            placeholder="Cari nama produk, SKU, kategori..."
            placeholderTextColor="#A0A8A0"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabChip,
                activeTab === tab.key && styles.tabChipActive,
              ]}
            >
              <Text
                style={[
                  styles.tabChipText,
                  activeTab === tab.key && styles.tabChipTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setSelectedCategory(cat);
                fetchProducts();
              }}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {products.length === 0 ? (
          <EmptyState
            variant="products"
            title="Tidak Ada Produk"
            description="Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih."
            action={{
              label: 'Tambah Produk',
              onPress: () => {
                setEditingProduct(null);
                setIsAddModalOpen(true);
              },
            }}
          />
        ) : (
          products.map((product) => {
            const isLow = product.stock > 0 && product.stock <= product.minStockAlert;
            const isOut = product.stock === 0;

            return (
              <Card key={product.id} style={styles.productCard}>
                <View style={styles.productTopRow}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <View style={styles.categoryAndBadge}>
                      <Text style={styles.productCategory}>{product.category}</Text>
                      <Badge
                        variant={
                          product.status === 'Aktif'
                            ? 'success'
                            : product.status === 'Stok Menipis'
                            ? 'warning'
                            : product.status === 'Habis'
                            ? 'danger'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {product.status}
                      </Badge>
                    </View>

                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.skuText}>SKU: {product.sku}</Text>
                    <Text style={styles.productPrice}>{formatRupiah(product.price)}</Text>
                  </View>
                </View>

                {/* Stock Alert Warning Bar */}
                {isLow ? (
                  <View style={styles.warningStrip}>
                    <AlertTriangle size={14} color="#D97706" />
                    <Text style={styles.warningStripText}>
                      Stok menipis! Sisa {product.stock} {product.unit} (Batas: {product.minStockAlert})
                    </Text>
                  </View>
                ) : isOut ? (
                  <View style={[styles.warningStrip, styles.dangerStrip]}>
                    <AlertTriangle size={14} color="#D95757" />
                    <Text style={[styles.warningStripText, styles.dangerStripText]}>
                      Stok habis! Pembeli tidak dapat memesan produk ini.
                    </Text>
                  </View>
                ) : null}

                {/* Action Footer */}
                <View style={styles.cardFooter}>
                  <Text style={styles.stockFooterText}>
                    Stok: <Text style={styles.stockBold}>{product.stock} {product.unit}</Text> · Terjual: {product.soldCount}
                  </Text>

                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      onPress={() => {
                        setStockModalProduct(product);
                        setNewStockInput(String(product.stock));
                      }}
                      style={styles.iconActionBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Boxes size={16} color="#32CD32" />

                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setEditingProduct(product);
                        setIsAddModalOpen(true);
                      }}
                      style={styles.iconActionBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Edit2 size={16} color="#2563EB" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(product.id, product.name)}
                      style={styles.iconActionBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Trash2 size={16} color="#D95757" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <ProductFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          initialData={
            editingProduct
              ? {
                  name: editingProduct.name,
                  category: editingProduct.category,
                  price: editingProduct.price,
                  stock: editingProduct.stock,
                  unit: editingProduct.unit,
                  description: editingProduct.description,
                  minStockAlert: editingProduct.minStockAlert,
                  image: editingProduct.image,
                }
              : undefined
          }
          onSubmit={async (data) => {
            if (editingProduct) {
              await updateProduct(editingProduct.id, data);
            } else {
              await addProduct(data);
            }
            fetchProducts();
          }}
        />
      )}

      {/* Quick Stock Modal */}
      <Modal
        visible={!!stockModalProduct}
        transparent
        animationType="fade"
        onRequestClose={() => setStockModalProduct(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.stockModalBox}>
            <Text style={styles.stockModalTitle}>Ubah Jumlah Stok</Text>
            <Text style={styles.stockModalDesc}>
              {stockModalProduct?.name} ({stockModalProduct?.unit})
            </Text>
            <TextInput
              style={styles.stockModalInput}
              value={newStockInput}
              onChangeText={setNewStockInput}
              keyboardType="numeric"
              placeholder="0"
              autoFocus
            />
            <View style={styles.stockModalActions}>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setStockModalProduct(null)}
              >
                Batal
              </Button>
              <Button variant="primary" size="sm" onPress={handleStockSave}>
                Simpan Stok
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleCol: {
    flex: 1,
    gap: 2,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  tabsContainer: {
    paddingVertical: 4,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabChipActive: {
    backgroundColor: '#32CD32',
    borderColor: '#32CD32',
  },

  tabChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#68746B',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingVertical: 4,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
  },
  categoryChipActive: {
    backgroundColor: '#EAF4E3',
    borderColor: '#A9CF8C',
  },
  categoryChipText: {
    fontSize: 11,
    color: '#68746B',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#3E7821',
  },
  listContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 12,
  },
  productCard: {
    padding: 14,
    gap: 10,
  },
  productTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  productImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#E8ECE7',
  },
  productInfo: {
    flex: 1,
    gap: 3,
  },
  categoryAndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  skuText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15803D',
  },
  warningStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningStripText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
  },
  dangerStrip: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  dangerStripText: {
    color: '#EF4444',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  stockFooterText: {
    fontSize: 11,
    color: '#64748B',
  },
  stockBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stockModalBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  stockModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#213329',
  },
  stockModalDesc: {
    fontSize: 12,
    color: '#68746B',
  },
  stockModalInput: {
    borderWidth: 1,
    borderColor: '#E2E8DE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#213329',
  },
  stockModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
});