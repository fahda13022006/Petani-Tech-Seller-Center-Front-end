import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useToastStore } from '@/store/useToastStore';
import { InventoryItem } from '@/types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { StatCard } from '@/components/cards/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchInput } from '@/components/forms/SearchInput';
import { Input } from '@/components/forms/Input';
import { formatRupiah, PRODUCT_CATEGORIES } from '@/constants';
import { colors } from '@/theme/colors';
import { useTheme } from '@/theme';
import {
  Boxes,
  AlertTriangle,
  XCircle,
  Plus,
  Minus,
  History,
  ArrowUp,
  ArrowDown,
  X,
  MapPin,
  Building2,
} from 'lucide-react-native';

type ModalMode = 'add' | 'remove' | 'movement' | null;

export function InventoryScreen() {
  const { themeColors, isDarkMode } = useTheme();
  const {
    items,
    movements,
    summary,
    fetchInventory,
    fetchMovements,
    fetchSuppliers,
    addStock,
    removeStock,
    setFilterStatus,
    setFilterCategory,
    setSearchQuery,
    filterStatus,
    filterCategory,
    searchQuery,
  } = useInventoryStore();

  const toast = useToastStore();

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchSuppliers();
  }, [fetchInventory, fetchSuppliers]);

  const openModal = (item: InventoryItem, mode: ModalMode) => {
    setSelectedItem(item);
    setModalMode(mode);
    setQty('');
    setReason('');
    if (mode === 'movement') {
      fetchMovements(item.id);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalMode(null);
    setQty('');
    setReason('');
  };

  const handleSubmitStock = async () => {
    if (!selectedItem || !qty || !reason.trim()) return;
    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        await addStock(selectedItem.id, Number(qty), reason);
        toast.success('Stok Berhasil Masuk', `+${qty} ${selectedItem.unit} telah ditambahkan`);
      } else if (modalMode === 'remove') {
        await removeStock(selectedItem.id, Number(qty), reason);
        toast.warning('Stok Berhasil Keluar', `-${qty} ${selectedItem.unit} telah dikurangi`);
      }
      closeModal();
    } catch (err: unknown) {
      toast.error('Gagal', err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusFilters = [
    { key: 'all', label: 'Semua' },
    { key: 'Aman', label: 'Stok Aman' },
    { key: 'Menipis', label: 'Menipis' },
    { key: 'Habis', label: 'Habis' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={themeColors.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <View style={styles.titleCol}>
          <Text style={[styles.screenTitle, { color: themeColors.textPrimary }]}>Inventori & Gudang</Text>
          <Text style={[styles.screenSubtitle, { color: themeColors.textSecondary }]}>
            Pantau stok produk, batas minimum, dan pencatatan mutasi barang
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Summary Cards */}
        {summary ? (
          <View style={styles.kpiContainer}>
            <View style={styles.kpiRow}>
              <StatCard
                title="Total Item"
                value={`${summary.totalItems} Produk`}
                icon={Boxes}
                iconBgColor={isDarkMode ? 'rgba(64,145,108,0.2)' : '#EAF4EE'}
                iconColor={themeColors.accent}
                style={styles.kpiCard}
              />
              <StatCard
                title="Nilai Inventori"
                value={formatRupiah(summary.totalStockValue)}
                icon={Boxes}
                iconBgColor={isDarkMode ? 'rgba(37,99,235,0.18)' : '#EFF6FF'}
                iconColor="#3B82F6"
                style={styles.kpiCard}
              />
            </View>

            <View style={styles.kpiRow}>
              <StatCard
                title="Stok Menipis"
                value={`${summary.lowItems} Produk`}
                icon={AlertTriangle}
                iconBgColor={isDarkMode ? 'rgba(217,119,6,0.18)' : '#FFFBEB'}
                iconColor="#F59E0B"
                style={styles.kpiCard}
              />
              <StatCard
                title="Stok Habis"
                value={`${summary.emptyItems} Produk`}
                icon={XCircle}
                iconBgColor={isDarkMode ? 'rgba(239,68,68,0.18)' : '#FFF1F2'}
                iconColor={colors.semantic.danger.DEFAULT}
                style={styles.kpiCard}
              />
            </View>
          </View>
        ) : null}

        {/* Modern Search Input */}
        <View style={styles.searchRow}>
          <SearchInput
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              fetchInventory();
            }}
            placeholder="Cari SKU, nama produk, supplier..."
          />
        </View>

        {/* Status Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {statusFilters.map((flt) => {
            const isActive = filterStatus === flt.key;
            return (
              <TouchableOpacity
                key={flt.key}
                onPress={() => {
                  setFilterStatus(flt.key);
                  fetchInventory();
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: themeColors.cardBackground,
                    borderColor: themeColors.cardBorder,
                  },
                  isActive && {
                    backgroundColor: themeColors.primary,
                    borderColor: themeColors.primary,
                  },
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: themeColors.textSecondary },
                    isActive && styles.chipTextActive,
                  ]}
                >
                  {flt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {PRODUCT_CATEGORIES.map((cat) => {
            const isActive = filterCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => {
                  setFilterCategory(cat);
                  fetchInventory();
                }}
                style={[
                  styles.chipSmall,
                  {
                    backgroundColor: themeColors.cardBackground,
                    borderColor: themeColors.cardBorder,
                  },
                  isActive && {
                    backgroundColor: themeColors.primary,
                    borderColor: themeColors.primary,
                  },
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.chipSmallText,
                    { color: themeColors.textSecondary },
                    isActive && styles.chipSmallTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Inventory Item Cards */}
        {items.length === 0 ? (
          <EmptyState
            variant="default"
            title="Tidak Ada Data Inventori"
            description="Tidak ada item gudang yang cocok dengan kriteria filter Anda."
          />
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              style={[
                styles.inventoryCard,
                {
                  backgroundColor: themeColors.cardBackground,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={[styles.itemSku, { color: themeColors.textMuted }]}>
                    SKU: {item.sku}
                  </Text>
                  <Text style={[styles.itemName, { color: themeColors.textPrimary }]}>
                    {item.productName}
                  </Text>
                  <Text style={[styles.itemCategory, { color: themeColors.textSecondary }]}>
                    {item.category}
                  </Text>
                </View>
                <Badge
                  variant={
                    item.status === 'Aman'
                      ? 'brand'
                      : item.status === 'Menipis'
                      ? 'warning'
                      : 'danger'
                  }
                  size="sm"
                >
                  {item.status}
                </Badge>
              </View>

              {/* Stock Numbers */}
              <View
                style={[
                  styles.stockDetailsGrid,
                  {
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.04)'
                      : '#F7FAF7',
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <View style={styles.stockCol}>
                  <Text style={[styles.stockColLabel, { color: themeColors.textMuted }]}>
                    Stok Saat Ini
                  </Text>
                  <Text style={[styles.stockColVal, { color: themeColors.textPrimary }]}>
                    {item.currentStock} {item.unit}
                  </Text>
                </View>
                <View style={styles.stockCol}>
                  <Text style={[styles.stockColLabel, { color: themeColors.textMuted }]}>
                    Batas Minimum
                  </Text>
                  <Text style={[styles.stockColVal, { color: themeColors.textPrimary }]}>
                    {item.minimumStock} {item.unit}
                  </Text>
                </View>
                <View style={styles.stockCol}>
                  <Text style={[styles.stockColLabel, { color: themeColors.textMuted }]}>
                    Harga Beli
                  </Text>
                  <Text style={[styles.stockColVal, { color: themeColors.accent }]}>
                    {formatRupiah(item.purchasePrice)}
                  </Text>
                </View>
              </View>

              {/* Warehouse & Supplier */}
              <View
                style={[
                  styles.supplierLocBox,
                  {
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.03)'
                      : '#F0F5F1',
                  },
                ]}
              >
                <View style={styles.locRow}>
                  <MapPin size={12} color={themeColors.textMuted} />
                  <Text style={[styles.locText, { color: themeColors.textSecondary }]}>
                    Lokasi: {item.warehouseLocation}
                  </Text>
                </View>
                <View style={styles.locRow}>
                  <Building2 size={12} color={themeColors.accent} />
                  <Text style={[styles.locText, { color: themeColors.textSecondary }]}>
                    Supplier: {item.supplierName}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus size={14} color="#FFFFFF" />}
                  onPress={() => openModal(item, 'add')}
                >
                  Masuk
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Minus size={14} color={themeColors.accent} />}
                  onPress={() => openModal(item, 'remove')}
                >
                  Keluar
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<History size={14} color={themeColors.textSecondary} />}
                  onPress={() => openModal(item, 'movement')}
                >
                  Riwayat
                </Button>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Adjust Stock Modal */}
      <Modal
        visible={modalMode === 'add' || modalMode === 'remove'}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalBox,
              {
                backgroundColor: themeColors.modalBackground,
                borderColor: themeColors.modalBorder,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>
              {modalMode === 'add' ? 'Tambah Stok Masuk' : 'Kurangi Stok Keluar'}
            </Text>
            <Text style={[styles.modalSub, { color: themeColors.textSecondary }]}>
              {selectedItem?.productName} (Sisa saat ini: {selectedItem?.currentStock}{' '}
              {selectedItem?.unit})
            </Text>

            <Input
              label={`Jumlah (${selectedItem?.unit})`}
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              placeholder="0"
              autoFocus
            />

            <Input
              label="Keterangan / Alasan"
              value={reason}
              onChangeText={setReason}
              placeholder="Contoh: Kiriman dari distributor / Retur pembeli"
            />

            <View style={styles.modalActions}>
              <Button variant="ghost" size="sm" onPress={closeModal} disabled={isSubmitting}>
                Batal
              </Button>
              <Button
                variant={modalMode === 'add' ? 'primary' : 'danger'}
                size="sm"
                onPress={handleSubmitStock}
                isLoading={isSubmitting}
              >
                Simpan
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Movements History Modal */}
      <Modal
        visible={modalMode === 'movement'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalBox,
              {
                maxHeight: '80%',
                backgroundColor: themeColors.modalBackground,
                borderColor: themeColors.modalBorder,
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.movementHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>
                Riwayat Mutasi Stok
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={20} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSub, { color: themeColors.textSecondary }]}>
              {selectedItem?.productName}
            </Text>

            <ScrollView style={{ marginTop: 12 }}>
              {movements.length === 0 ? (
                <Text style={[styles.emptyMovementText, { color: themeColors.textMuted }]}>
                  Belum ada riwayat mutasi.
                </Text>
              ) : (
                movements.map((mov) => (
                  <View
                    key={mov.id}
                    style={[
                      styles.movementRow,
                      { borderBottomColor: themeColors.divider },
                    ]}
                  >
                    <View style={styles.movementIcon}>
                      {mov.type === 'masuk' ? (
                        <ArrowDown size={16} color={themeColors.accent} />
                      ) : (
                        <ArrowUp size={16} color={colors.semantic.danger.DEFAULT} />
                      )}
                    </View>
                    <View style={styles.movementDetails}>
                      <Text style={[styles.movementReason, { color: themeColors.textPrimary }]}>
                        {mov.reason}
                      </Text>
                      <Text style={[styles.movementMeta, { color: themeColors.textMuted }]}>
                        {mov.date} · oleh {mov.performedBy}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.movementQty,
                        mov.type === 'masuk' ? { color: themeColors.accent } : styles.qtyRed,
                      ]}
                    >
                      {mov.type === 'masuk' ? `+${mov.quantity}` : `-${mov.quantity}`}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleCol: {
    gap: 2,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[900],
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12,
    color: colors.neutral[600],
    fontFamily: 'Poppins, sans-serif',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 12,
  },
  kpiContainer: {
    gap: 10,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
  },
  searchRow: {
    paddingVertical: 2,
  },
  filterRow: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EDE7',
  },
  chipActive: {
    backgroundColor: colors.primary.DEFAULT,
    borderColor: colors.primary.DEFAULT,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[600],
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipSmall: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#EAF4EE',
    borderWidth: 1,
    borderColor: '#D2DDD4',
  },
  chipSmallActive: {
    backgroundColor: colors.primary.forest,
    borderColor: colors.primary.forest,
  },
  chipSmallText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins, sans-serif',
    color: colors.primary.dark,
  },
  chipSmallTextActive: {
    color: '#FFFFFF',
  },
  inventoryCard: {
    padding: 16,
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6EDE7',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flex: 1,
    gap: 2,
  },
  itemSku: {
    fontSize: 10.5,
    color: colors.neutral[500],
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[900],
  },
  itemCategory: {
    fontSize: 11,
    color: colors.primary.DEFAULT,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
  },
  stockDetailsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    padding: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E6EDE7',
  },
  stockCol: {
    gap: 2,
  },
  stockColLabel: {
    fontSize: 10,
    color: colors.neutral[500],
    fontFamily: 'Poppins, sans-serif',
  },
  stockColVal: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[900],
  },
  supplierLocBox: {
    gap: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locText: {
    fontSize: 11,
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[600],
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F1',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 38, 29, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    gap: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[900],
  },
  modalSub: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[600],
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyMovementText: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[500],
    textAlign: 'center',
    paddingVertical: 20,
  },
  movementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F1',
    gap: 10,
  },
  movementIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F4F7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  movementDetails: {
    flex: 1,
    gap: 2,
  },
  movementReason: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[900],
  },
  movementMeta: {
    fontSize: 10.5,
    fontFamily: 'Poppins, sans-serif',
    color: colors.neutral[500],
  },
  movementQty: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Poppins, sans-serif',
  },
  qtyGreen: {
    color: colors.primary.DEFAULT,
  },
  qtyRed: {
    color: colors.semantic.danger.DEFAULT,
  },
});