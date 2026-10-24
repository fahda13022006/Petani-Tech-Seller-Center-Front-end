import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useToastStore } from '@/store/useToastStore';
import { InventoryItem } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { formatRupiah, PRODUCT_CATEGORIES } from '@/constants';
import {
  Boxes,
  AlertTriangle,
  XCircle,
  Plus,
  Minus,
  Search,
  History,
  ArrowUp,
  ArrowDown,
  X,
  MapPin,
  Building2,
} from 'lucide-react-native';

type ModalMode = 'add' | 'remove' | 'movement' | null;

export function InventoryScreen() {
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.screenTitle}>Inventori & Gudang</Text>
          <Text style={styles.screenSubtitle}>
            Pantau stok, batas peringatan, dan pencatatan mutasi barang
          </Text>
        </View>
      </View>

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
                iconBgColor="#F0FDF4"
                iconColor="#15803D"

                style={styles.kpiCard}
              />
              <StatCard
                title="Nilai Inventori"
                value={formatRupiah(summary.totalStockValue)}
                icon={Boxes}
                iconBgColor="#EFF6FF"
                iconColor="#2563EB"
                style={styles.kpiCard}
              />
            </View>

            <View style={styles.kpiRow}>
              <StatCard
                title="Stok Menipis"
                value={`${summary.lowItems} Produk`}
                icon={AlertTriangle}
                iconBgColor="#FFFBEB"
                iconColor="#D97706"
                style={styles.kpiCard}
              />
              <StatCard
                title="Stok Habis"
                value={`${summary.emptyItems} Produk`}
                icon={XCircle}
                iconBgColor="#FEF2F2"
                iconColor="#D95757"
                style={styles.kpiCard}
              />
            </View>
          </View>
        ) : null}

        {/* Search Input */}
        <View style={styles.searchWrapper}>
          <Search size={18} color="#818981" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              fetchInventory();
            }}
            placeholder="Cari SKU, nama produk, supplier..."
            placeholderTextColor="#A0A8A0"
          />
        </View>

        {/* Status Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {statusFilters.map((flt) => (
            <TouchableOpacity
              key={flt.key}
              onPress={() => {
                setFilterStatus(flt.key);
                fetchInventory();
              }}
              style={[
                styles.chip,
                filterStatus === flt.key && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  filterStatus === flt.key && styles.chipTextActive,
                ]}
              >
                {flt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                setFilterCategory(cat);
                fetchInventory();
              }}
              style={[
                styles.chipSmall,
                filterCategory === cat && styles.chipSmallActive,
              ]}
            >
              <Text
                style={[
                  styles.chipSmallText,
                  filterCategory === cat && styles.chipSmallTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
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
            <Card key={item.id} style={styles.inventoryCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                  <Text style={styles.itemName}>{item.productName}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                </View>
                <Badge
                  variant={
                    item.status === 'Aman'
                      ? 'success'
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
              <View style={styles.stockDetailsGrid}>
                <View style={styles.stockCol}>
                  <Text style={styles.stockColLabel}>Stok Saat Ini</Text>
                  <Text style={styles.stockColVal}>
                    {item.currentStock} {item.unit}
                  </Text>
                </View>
                <View style={styles.stockCol}>
                  <Text style={styles.stockColLabel}>Batas Minimum</Text>
                  <Text style={styles.stockColVal}>
                    {item.minimumStock} {item.unit}
                  </Text>
                </View>
                <View style={styles.stockCol}>
                  <Text style={styles.stockColLabel}>Harga Beli</Text>
                  <Text style={styles.stockColVal}>
                    {formatRupiah(item.purchasePrice)}
                  </Text>
                </View>
              </View>

              {/* Warehouse & Supplier */}
              <View style={styles.supplierLocBox}>
                <View style={styles.locRow}>
                  <MapPin size={12} color="#818981" />
                  <Text style={styles.locText}>Lokasi: {item.warehouseLocation}</Text>
                </View>
                <View style={styles.locRow}>
                  <Building2 size={12} color="#15803D" />
                  <Text style={styles.locText}>Supplier: {item.supplierName}</Text>
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
                  leftIcon={<Minus size={14} color="#15803D" />}
                  onPress={() => openModal(item, 'remove')}
                >
                  Keluar
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<History size={14} color="#213329" />}
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
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modalMode === 'add' ? 'Tambah Stok Masuk' : 'Kurangi Stok Keluar'}
            </Text>
            <Text style={styles.modalSub}>
              {selectedItem?.productName} (Sisa saat ini: {selectedItem?.currentStock} {selectedItem?.unit})
            </Text>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Jumlah ({selectedItem?.unit})</Text>
              <TextInput
                style={styles.modalInput}
                value={qty}
                onChangeText={setQty}
                keyboardType="numeric"
                placeholder="0"
                autoFocus
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Keterangan / Alasan</Text>
              <TextInput
                style={styles.modalInput}
                value={reason}
                onChangeText={setReason}
                placeholder="Contoh: Kiriman dari distributor / Retur pembeli"
              />
            </View>

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
          <View style={[styles.modalBox, { maxHeight: '80%' }]}>
            <View style={styles.movementHeader}>
              <Text style={styles.modalTitle}>Riwayat Mutasi Stok</Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={20} color="#818981" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>{selectedItem?.productName}</Text>

            <ScrollView style={{ marginTop: 12 }}>
              {movements.length === 0 ? (
                <Text style={styles.emptyMovementText}>Belum ada riwayat mutasi.</Text>
              ) : (
                movements.map((mov) => (
                  <View key={mov.id} style={styles.movementRow}>
                    <View style={styles.movementIcon}>
                      {mov.type === 'masuk' ? (
                        <ArrowDown size={16} color="#059669" />
                      ) : (
                        <ArrowUp size={16} color="#D95757" />
                      )}
                    </View>
                    <View style={styles.movementDetails}>
                      <Text style={styles.movementReason}>{mov.reason}</Text>
                      <Text style={styles.movementMeta}>
                        {mov.date} · oleh {mov.performedBy}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.movementQty,
                        mov.type === 'masuk' ? styles.qtyGreen : styles.qtyRed,
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
    backgroundColor: '#F8FAFC',
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
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#64748B',
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
  filterRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#32CD32',
    borderColor: '#32CD32',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipSmall: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSmallActive: {
    backgroundColor: '#F0FDF4',

    borderColor: '#A9CF8C',
  },
  chipSmallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#68746B',
  },
  chipSmallTextActive: {
    color: '#3E7821',
  },
  inventoryCard: {
    padding: 14,
    gap: 12,
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
    fontSize: 10,
    color: '#818981',
    fontWeight: '600',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemCategory: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
  },
  stockDetailsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAF8',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },
  stockCol: {
    gap: 2,
  },
  stockColLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  stockColVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  supplierLocBox: {
    gap: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locText: {
    fontSize: 11,
    color: '#64748B',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
  },
  modalField: {
    gap: 4,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
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
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 20,
  },
  movementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  movementIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
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
    color: '#213329',
  },
  movementMeta: {
    fontSize: 10,
    color: '#818981',
  },
  movementQty: {
    fontSize: 13,
    fontWeight: '800',
  },
  qtyGreen: {
    color: '#059669',
  },
  qtyRed: {
    color: '#D95757',
  },
});