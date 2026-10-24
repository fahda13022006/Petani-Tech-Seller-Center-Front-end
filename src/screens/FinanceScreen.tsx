import React, { useEffect, useState } from 'react';
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
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { formatRupiah } from '@/constants';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  CreditCard,
  Clock,
  X,
} from 'lucide-react-native';

export function FinanceScreen() {
  const { summary, transactions, fetchFinance, withdrawBalance } = useFinanceStore();
  const { user } = useAuthStore();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('2000000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  const handleWithdraw = async () => {
    const num = Number(withdrawAmount);
    if (!withdrawAmount || isNaN(num) || num <= 0) {
      Alert.alert('Error', 'Masukkan nominal penarikan yang valid.');
      return;
    }

    if (num > (summary?.availableBalance || 0)) {
      Alert.alert('Gagal', 'Nominal melebihi saldo yang tersedia.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bankInfo = `${user?.bankAccount?.bankName || 'BRI'} (${user?.bankAccount?.accountNumber || '0123-***-50-8'})`;
      await withdrawBalance(num, bankInfo);
      setIsWithdrawModalOpen(false);
      Alert.alert(
        'Penarikan Berhasil',
        `Penarikan dana ${formatRupiah(num)} sedang diproses ke rekening ${bankInfo}.`
      );
    } catch (err: unknown) {
      Alert.alert('Gagal', err instanceof Error ? err.message : 'Gagal memproses penarikan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  const filterTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'Penjualan', label: 'Penjualan' },
    { key: 'Pencairan', label: 'Pencairan' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.screenTitle}>Keuangan & Saldo</Text>
          <Text style={styles.screenSubtitle}>
            Pantau saldo hasil penjualan dan riwayat pencairan dana
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Balance Card */}
        <Card style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <View>
              <Text style={styles.balanceLabel}>SALDO TERSEDIA</Text>
              <Text style={styles.balanceValue}>
                {formatRupiah(summary?.availableBalance || 8500000)}
              </Text>
            </View>
            <View style={styles.walletIconCircle}>
              <Wallet size={24} color="#34764A" />
            </View>
          </View>

          <Button
            variant="primary"
            size="md"
            leftIcon={<ArrowUpRight size={18} color="#FFFFFF" />}
            onPress={() => setIsWithdrawModalOpen(true)}
            style={styles.withdrawBtn}
          >
            Tarik Saldo ke Rekening
          </Button>
        </Card>

        {/* Secondary Metric Cards */}
        <View style={styles.metricsRow}>
          <Card style={styles.metricHalfCard}>
            <Text style={styles.metricLabel}>Pendapatan Bulan Ini</Text>
            <Text style={styles.metricVal}>
              {formatRupiah(summary?.monthlyRevenue || 15200000)}
            </Text>
            <Text style={styles.metricSub}>+18.4% dari bulan lalu</Text>
          </Card>

          <Card style={styles.metricHalfCard}>
            <Text style={styles.metricLabel}>Total Sudah Ditarik</Text>
            <Text style={styles.metricVal}>
              {formatRupiah(summary?.totalWithdrawn || 12000000)}
            </Text>
            <Text style={styles.metricSub}>Berhasil ditransfer</Text>
          </Card>
        </View>

        {/* Bank Account Details Card */}
        <Card style={styles.bankCard}>
          <View style={styles.bankHeader}>
            <Building size={18} color="#34764A" />
            <Text style={styles.bankTitle}>Rekening Pencairan Terdaftar</Text>
          </View>
          <View style={styles.bankInfoRow}>
            <CreditCard size={16} color="#818981" />
            <Text style={styles.bankText}>
              {user?.bankAccount?.bankName || 'Bank Rakyat Indonesia (BRI)'} -{' '}
              {user?.bankAccount?.accountNumber || '0123-01-084920-50-8'}
            </Text>
          </View>
          <Text style={styles.bankHolder}>
            a.n {user?.bankAccount?.accountHolder || user?.name || 'Pak Budi Santoso'}
          </Text>
        </Card>

        {/* Transaction History Section */}
        <View style={styles.txHeader}>
          <Text style={styles.sectionTitle}>RIWAYAT TRANSAKSI</Text>
          <View style={styles.filterTabsRow}>
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilterType(tab.key)}
                style={[
                  styles.filterTab,
                  filterType === tab.key && styles.filterTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    filterType === tab.key && styles.filterTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <EmptyState
            variant="transactions"
            title="Belum Ada Transaksi"
            description="Riwayat mutasi transaksi keuangan akan muncul di sini."
          />
        ) : (
          filteredTransactions.map((tx) => {
            const isNegative = tx.amount < 0;
            return (
              <Card key={tx.id} style={styles.txCard}>
                <View style={styles.txTopRow}>
                  <View style={styles.txLeft}>
                    <View style={styles.txIconBox}>
                      {isNegative ? (
                        <ArrowUpRight size={16} color="#D95757" />
                      ) : (
                        <ArrowDownLeft size={16} color="#059669" />
                      )}
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txDesc}>{tx.description}</Text>
                      <View style={styles.txMetaRow}>
                        <Clock size={11} color="#818981" />
                        <Text style={styles.txMetaText}>{tx.date} · Ref: {tx.referenceNo}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.txRight}>
                    <Text
                      style={[
                        styles.txAmount,
                        isNegative ? styles.amountRed : styles.amountGreen,
                      ]}
                    >
                      {isNegative ? '' : '+'}{formatRupiah(tx.amount)}
                    </Text>
                    <Badge
                      variant={tx.status === 'Berhasil' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {tx.status}
                    </Badge>
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal
        visible={isWithdrawModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsWithdrawModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tarik Saldo Toko</Text>
              <TouchableOpacity onPress={() => setIsWithdrawModalOpen(false)}>
                <X size={20} color="#818981" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Saldo tersedia:{' '}
              <Text style={styles.balanceHighlight}>
                {formatRupiah(summary?.availableBalance || 0)}
              </Text>
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nominal Penarikan (Rp)</Text>
              <TextInput
                style={styles.modalInput}
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
                placeholder="Contoh: 1000000"
              />
            </View>

            {/* Quick Amount Chips */}
            <View style={styles.quickAmountRow}>
              {[500000, 1000000, 2000000, summary?.availableBalance || 0].map(
                (amt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setWithdrawAmount(String(amt))}
                    style={styles.quickChip}
                  >
                    <Text style={styles.quickChipText}>
                      {idx === 3 ? 'Semua' : `${amt / 1000}rb`}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <View style={styles.bankDetailNotice}>
              <Text style={styles.bankNoticeText}>
                Dana akan dikirim ke rekening {user?.bankAccount?.bankName || 'BRI'} (
                {user?.bankAccount?.accountNumber || '0123-***-50-8'}).
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Button
                variant="ghost"
                size="md"
                onPress={() => setIsWithdrawModalOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={handleWithdraw}
                isLoading={isSubmitting}
              >
                Konfirmasi Penarikan
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
    backgroundColor: '#F6F8F4',
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
    color: '#213329',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#818981',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 14,
  },
  balanceCard: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A9CF8C',
    borderRadius: 18,
    gap: 16,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34764A',
    letterSpacing: 0.6,
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#213329',
    marginTop: 2,
  },
  walletIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF4E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawBtn: {
    width: '100%',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricHalfCard: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#818981',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#213329',
  },
  metricSub: {
    fontSize: 10,
    color: '#34764A',
    fontWeight: '600',
  },
  bankCard: {
    padding: 14,
    backgroundColor: '#F8FAF7',
    gap: 6,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  bankInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34764A',
  },
  bankHolder: {
    fontSize: 11,
    color: '#818981',
  },
  txHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#818981',
    letterSpacing: 0.8,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
  },
  filterTabActive: {
    backgroundColor: '#34764A',
    borderColor: '#34764A',
  },
  filterTabText: {
    fontSize: 11,
    color: '#68746B',
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  txCard: {
    padding: 12,
  },
  txTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F6F8F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
    gap: 2,
  },
  txDesc: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  txMetaText: {
    fontSize: 10,
    color: '#818981',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  amountGreen: {
    color: '#059669',
  },
  amountRed: {
    color: '#D95757',
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
    fontSize: 17,
    fontWeight: '800',
    color: '#213329',
  },
  modalSub: {
    fontSize: 12,
    color: '#68746B',
  },
  balanceHighlight: {
    fontWeight: '700',
    color: '#34764A',
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#213329',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8DE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#213329',
  },
  quickAmountRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAF7',
    borderWidth: 1,
    borderColor: '#E2E8DE',
    alignItems: 'center',
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34764A',
  },
  bankDetailNotice: {
    backgroundColor: '#F6F8F4',
    padding: 10,
    borderRadius: 10,
  },
  bankNoticeText: {
    fontSize: 11,
    color: '#68746B',
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
});