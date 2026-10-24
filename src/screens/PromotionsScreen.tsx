import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { promotionService } from '@/services/promotionService';
import { Promotion, PromotionType } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { formatRupiah } from '@/constants';
import {
  Plus,
  Tag,
  Percent,
  Calendar,
  X,
  Flame,
} from 'lucide-react-native';

const PROMO_TYPES: PromotionType[] = ['Diskon Produk', 'Voucher', 'Campaign'];

export function PromotionsScreen() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'Diskon Produk' | 'Voucher' | 'Campaign'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [promoName, setPromoName] = useState('');
  const [promoType, setPromoType] = useState<PromotionType>('Diskon Produk');
  const [discountValue, setDiscountValue] = useState('20');
  const [minPurchase, setMinPurchase] = useState('100000');
  const [quota, setQuota] = useState('200');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPromos = async () => {
    const list = await promotionService.getPromotions();
    setPromotions(list);
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCreatePromo = async () => {
    if (!promoName.trim() || !discountValue || !minPurchase) {
      Alert.alert('Perhatian', 'Lengkapi nama promosi dan nominal diskon.');
      return;
    }

    setIsSubmitting(true);
    try {
      await promotionService.createPromotion({
        name: promoName.trim(),
        type: promoType,
        discountType: 'percentage',
        discountValue: Number(discountValue),
        minPurchase: Number(minPurchase),
        startDate: 'Hari ini',
        endDate: '30 Hari kedepan',
        status: 'Aktif',
        targetCategory: 'Pupuk & Benih',
        totalQuota: Number(quota) || 100,
      });
      setIsCreateModalOpen(false);
      setPromoName('');
      await loadPromos();
      Alert.alert('Sukses', 'Promosi baru berhasil dibuat dan langsung aktif!');
    } catch (err: unknown) {
      Alert.alert('Gagal', err instanceof Error ? err.message : 'Gagal membuat promosi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = promotions.filter((p) => {
    if (activeTab === 'all') return true;
    return p.type === activeTab;
  });

  const tabs: { key: 'all' | 'Diskon Produk' | 'Voucher' | 'Campaign'; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'Diskon Produk', label: 'Diskon' },
    { key: 'Voucher', label: 'Voucher' },
    { key: 'Campaign', label: 'Campaign' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.screenTitle}>Promosi & Voucher</Text>
          <Text style={styles.screenSubtitle}>
            Tingkatkan omset toko dengan diskon pupuk dan voucher subsidi ongkir
          </Text>
        </View>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} color="#FFFFFF" />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          Buat
        </Button>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Promo Musim Tanam */}
        <Card style={styles.bannerCard}>
          <View style={styles.bannerIconBox}>
            <Flame size={20} color="#FFFFFF" />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Campaign Musim Tanam Padi</Text>
            <Text style={styles.bannerSub}>
              Subsidi komisi 1% untuk produk benih dan pupuk organik SNI.
            </Text>
          </View>
        </Card>

        {/* Promo Cards List */}
        {filtered.length === 0 ? (
          <EmptyState
            variant="default"
            title="Belum Ada Promosi"
            description="Buat program diskon atau voucher belanja untuk menarik lebih banyak pembeli."
            action={{
              label: 'Buat Promosi Baru',
              onPress: () => setIsCreateModalOpen(true),
            }}
          />
        ) : (
          filtered.map((promo) => {
            const usagePercent = promo.totalQuota
              ? Math.min(100, Math.round((promo.usedCount / promo.totalQuota) * 100))
              : 0;

            return (
              <Card key={promo.id} style={styles.promoCard}>
                <View style={styles.promoHeader}>
                  <View style={styles.promoHeaderLeft}>
                    <View style={styles.promoTypeTag}>
                      <Tag size={12} color="#34764A" />
                      <Text style={styles.promoTypeText}>{promo.type}</Text>
                    </View>
                    <Text style={styles.promoName}>{promo.name}</Text>
                  </View>
                  <Badge
                    variant={promo.status === 'Aktif' ? 'success' : 'neutral'}
                    size="sm"
                  >
                    {promo.status}
                  </Badge>
                </View>

                {/* Promo Details */}
                <View style={styles.promoDetailsRow}>
                  <View style={styles.discountBadge}>
                    <Percent size={14} color="#34764A" />
                    <Text style={styles.discountText}>
                      Diskon {promo.discountValue}%
                    </Text>
                  </View>
                  <Text style={styles.minPurchaseText}>
                    Min. Belanja {formatRupiah(promo.minPurchase || 0)}
                  </Text>
                </View>

                {/* Quota Progress */}
                <View style={styles.quotaSection}>
                  <View style={styles.quotaHeader}>
                    <Text style={styles.quotaLabel}>Kuota Terpakai</Text>
                    <Text style={styles.quotaValue}>
                      {promo.usedCount} / {promo.totalQuota} ({usagePercent}%)
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[styles.progressBarFill, { width: `${usagePercent}%` }]}
                    />
                  </View>
                </View>

                {/* Date Footer */}
                <View style={styles.dateFooter}>
                  <Calendar size={12} color="#818981" />
                  <Text style={styles.dateText}>
                    Periode: {promo.startDate} s/d {promo.endDate}
                  </Text>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Create Promo Modal */}
      <Modal
        visible={isCreateModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCreateModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buat Promosi Toko Baru</Text>
              <TouchableOpacity onPress={() => setIsCreateModalOpen(false)}>
                <X size={20} color="#818981" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 8 }} keyboardShouldPersistTaps="handled">
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nama Promosi / Diskon</Text>
                <TextInput
                  style={styles.formInput}
                  value={promoName}
                  onChangeText={setPromoName}
                  placeholder="Contoh: Diskon Pupuk Olah Tanah 20%"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tipe Promosi</Text>
                <View style={styles.typeChipsRow}>
                  {PROMO_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setPromoType(t)}
                      style={[
                        styles.typeChip,
                        promoType === t && styles.typeChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeChipText,
                          promoType === t && styles.typeChipTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Diskon (%)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={discountValue}
                    onChangeText={setDiscountValue}
                    keyboardType="numeric"
                    placeholder="20"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Kuota Voucher</Text>
                  <TextInput
                    style={styles.formInput}
                    value={quota}
                    onChangeText={setQuota}
                    keyboardType="numeric"
                    placeholder="200"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Minimum Pembelian (Rp)</Text>
                <TextInput
                  style={styles.formInput}
                  value={minPurchase}
                  onChangeText={setMinPurchase}
                  keyboardType="numeric"
                  placeholder="100000"
                />
              </View>

              <View style={styles.modalActions}>
                <Button
                  variant="ghost"
                  size="md"
                  onPress={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onPress={handleCreatePromo}
                  isLoading={isSubmitting}
                >
                  Aktifkan Promosi
                </Button>
              </View>
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
    backgroundColor: '#F6F8F4',
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
    color: '#213329',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#818981',
  },
  tabsContainer: {
    paddingVertical: 6,
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
    borderColor: '#E8ECE7',
  },
  tabChipActive: {
    backgroundColor: '#34764A',
    borderColor: '#34764A',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#68746B',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 12,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#EAF4E3',
    borderColor: '#A9CF8C',
  },
  bannerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#34764A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#213329',
  },
  bannerSub: {
    fontSize: 11,
    color: '#4B5563',
  },
  promoCard: {
    padding: 14,
    gap: 10,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  promoHeaderLeft: {
    flex: 1,
    gap: 4,
  },
  promoTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promoTypeText: {
    fontSize: 10,
    color: '#34764A',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  promoName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#213329',
  },
  promoDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF4E3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#34764A',
  },
  minPurchaseText: {
    fontSize: 11,
    color: '#68746B',
  },
  quotaSection: {
    gap: 4,
  },
  quotaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quotaLabel: {
    fontSize: 10,
    color: '#818981',
  },
  quotaValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#213329',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8ECE7',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#34764A',
  },
  dateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F3EC',
  },
  dateText: {
    fontSize: 10,
    color: '#818981',
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
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#213329',
  },
  formGroup: {
    gap: 5,
    marginBottom: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#213329',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E2E8DE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#213329',
  },
  typeChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8DE',
  },
  typeChipActive: {
    backgroundColor: '#EAF4E3',
    borderColor: '#34764A',
  },
  typeChipText: {
    fontSize: 11,
    color: '#68746B',
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: '#34764A',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
});