import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSellerNavigation } from '@/navigation/hooks';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { formatRupiah } from '@/constants';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Boxes,
  Wallet,
  Sparkles,
  Truck,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  X,
  Tags,
  BarChart3,
  PlusCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react-native';


export function DashboardScreen() {
  const navigation = useSellerNavigation();
  const { user } = useAuthStore();
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();
  const { summary: financeSummary, fetchFinance } = useFinanceStore();

  const [showRecommendation, setShowRecommendation] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchFinance();
  }, [fetchProducts, fetchOrders, fetchFinance]);

  const activeProductsCount = products.filter((p) => p.status === 'Aktif').length || 38;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const processingOrdersCount = orders.filter((o) => o.status === 'Diproses').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Menunggu Pembayaran').length;

  const quickMenus = [
    { name: 'Tambah Produk', screen: 'Products' as const, icon: PlusCircle, color: '#32CD32', bgColor: '#F0FDF4' },
    { name: 'Semua Produk', screen: 'Products' as const, icon: Package, color: '#F59E0B', bgColor: '#FFFBEB' },
    { name: 'Pesanan Masuk', screen: 'Orders' as const, icon: ShoppingCart, color: '#10B981', bgColor: '#ECFDF5', count: processingOrdersCount ? String(processingOrdersCount) : undefined },
    { name: 'Kelola Stok', screen: 'Inventory' as const, icon: Boxes, color: '#64748B', bgColor: '#F1F5F9', count: lowStockCount ? String(lowStockCount) : undefined },
    { name: 'Dompet Toko', screen: 'Finance' as const, icon: Wallet, color: '#3B82F6', bgColor: '#EFF6FF' },
    { name: 'Voucher Promo', screen: 'Promotions' as const, icon: Tags, color: '#8B5CF6', bgColor: '#F5F3FF' },
    { name: 'Analitik Bisnis', screen: 'Analytics' as const, icon: BarChart3, color: '#EC4899', bgColor: '#FDF2F8' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Profile Banner with Subtle Green-White Gradient */}
        <LinearGradient
          colors={['#F0FDF4', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileBanner}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarTouchable}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri:
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.onlineBadge} />
          </TouchableOpacity>

          <View style={styles.profileText}>
            <View style={styles.storeTitleRow}>
              <Text style={styles.storeName} numberOfLines={1}>
                {user?.storeName || 'Toko Tani Makmur Fahda'}
              </Text>
              <Badge variant="success" dot size="sm">
                {user?.status || 'Seller Terverifikasi'}
              </Badge>
            </View>

            <Text style={styles.ownerSubtitle}>
              Pemilik: {user?.name || 'Fahda Febriya'} · {user?.storeAddress?.split(',')[0] || 'Indramayu'}
            </Text>

            <View style={styles.storeStatsRow}>
              <Text style={styles.ratingText}>⭐ 4.95 (1.2k ulasan)</Text>
              <Text style={styles.dotDivider}>•</Text>
              <Text style={styles.joinedText}>Bergabung 2025</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileActionBtn}
            activeOpacity={0.7}
          >
            <ChevronRight size={18} color="#15803D" />
          </TouchableOpacity>
        </LinearGradient>

        {/* 2. Order Fulfillment Pipeline (Shopee Seller Center Style) */}
        <Card style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.headerTitleLeft}>
              <View style={styles.headerGreenDot} />
              <Text style={styles.sectionTitle}>STATUS PESANAN SAYA</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.linkRow}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Lihat Semua</Text>
              <ChevronRight size={14} color="#32CD32" />
            </TouchableOpacity>
          </View>

          <View style={styles.pipelineGrid}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.pipelineCol}
              activeOpacity={0.7}
            >
              <View style={[styles.pipelineIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Truck size={20} color="#15803D" />
                {processingOrdersCount > 0 && (
                  <View style={styles.badgeIndicator}>
                    <Text style={styles.badgeIndicatorText}>{processingOrdersCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.pipelineCount}>{processingOrdersCount}</Text>
              <Text style={styles.pipelineLabel}>Perlu Dikirim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.pipelineCol}
              activeOpacity={0.7}
            >
              <View style={[styles.pipelineIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Clock size={20} color="#D97706" />
                {pendingOrdersCount > 0 && (
                  <View style={[styles.badgeIndicator, { backgroundColor: '#F59E0B' }]}>
                    <Text style={styles.badgeIndicatorText}>{pendingOrdersCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.pipelineCount}>{pendingOrdersCount}</Text>
              <Text style={styles.pipelineLabel}>Menunggu Bayar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Informasi', 'Belum ada permintaan pembatalan pembeli.')}
              style={styles.pipelineCol}
              activeOpacity={0.7}
            >
              <View style={[styles.pipelineIconBox, { backgroundColor: '#FEF2F2' }]}>
                <RotateCcw size={20} color="#EF4444" />
              </View>
              <Text style={styles.pipelineCount}>0</Text>
              <Text style={styles.pipelineLabel}>Pengembalian</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Ulasan Mitra Tani', 'Toko Anda memiliki 1.280 ulasan dengan kepuasan 99.4%!')}
              style={styles.pipelineCol}
              activeOpacity={0.7}
            >
              <View style={[styles.pipelineIconBox, { backgroundColor: '#EFF6FF' }]}>
                <MessageSquare size={20} color="#3B82F6" />
              </View>
              <Text style={[styles.pipelineCount, { color: '#3B82F6' }]}>12</Text>
              <Text style={styles.pipelineLabel}>Ulasan Baru</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 3. Sales & Balance Performance Cards */}
        <View style={styles.kpiContainer}>
          {/* Card 1: Saldo Penghasilan dengan Gradasi */}
          <LinearGradient
            colors={['#32CD32', '#22C55E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.balanceTop}>
              <View style={styles.balanceIconWrapper}>
                <Wallet size={18} color="#15803D" />
              </View>
              <Text style={styles.balanceLabel}>SALDO SIAP DITARIK</Text>
              <ArrowUpRight size={16} color="#FFFFFF" style={styles.arrowTopRight} />
            </View>

            <Text style={styles.balanceValue}>
              {formatRupiah(financeSummary?.availableBalance || 12850000)}
            </Text>

            <View style={styles.balanceBottom}>
              <Text style={styles.balanceSub}>Rekening: BRI **** 53-2</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Finance')}
                style={styles.withdrawButton}
                activeOpacity={0.8}
              >
                <Text style={styles.withdrawBtnText}>Tarik Dana</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Card 2 & 3 Grid KPI */}
          <View style={styles.kpiRow}>
            <Card style={styles.kpiCardHalf}>
              <View style={styles.kpiHeaderRow}>
                <Text style={styles.kpiMiniTitle}>Penjualan Bulan Ini</Text>
                <View style={[styles.kpiMiniIcon, { backgroundColor: '#F0FDF4' }]}>
                  <TrendingUp size={16} color="#15803D" />
                </View>
              </View>
              <Text style={styles.kpiMainNumber}>Rp 34,5 Jt</Text>
              <View style={styles.trendRow}>
                <Text style={styles.trendGreen}>↑ +18.4%</Text>
                <Text style={styles.trendSub}>vs bln lalu</Text>
              </View>
            </Card>

            <Card style={styles.kpiCardHalf}>
              <View style={styles.kpiHeaderRow}>
                <Text style={styles.kpiMiniTitle}>Produk Aktif</Text>
                <View style={[styles.kpiMiniIcon, { backgroundColor: '#FFFBEB' }]}>
                  <Package size={16} color="#D97706" />
                </View>
              </View>
              <Text style={styles.kpiMainNumber}>{activeProductsCount}</Text>
              <View style={styles.trendRow}>
                <Text style={styles.trendNeutral}>4 Kategori Tani</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* 4. Quick Action Marketplace Grid */}
        <Card style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.headerTitleLeft}>
              <View style={styles.headerGreenDot} />
              <Text style={styles.sectionTitle}>MENU PENGELOLAAN TOKO</Text>
            </View>
          </View>

          <View style={styles.quickMenuGrid}>
            {quickMenus.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => navigation.navigate(item.screen)}
                  style={styles.quickMenuItem}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickMenuIcon, { backgroundColor: item.bgColor }]}>
                    <Icon size={22} color={item.color} />
                    {item.count ? (
                      <View style={styles.quickMenuBadge}>
                        <Text style={styles.quickMenuBadgeText}>{item.count}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.quickMenuLabel} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* 5. Rekomendasi Bisnis Musim Tanam Banner */}
        {showRecommendation ? (
          <LinearGradient
            colors={['#F0FDF4', '#DCFCE7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.recommendationBanner}
          >
            <TouchableOpacity
              onPress={() => setShowRecommendation(false)}
              style={styles.recommendationClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={16} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.recommendationHeader}>
              <View style={styles.recommendationBadge}>
                <Sparkles size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.recommendationBadgeText}>Tips Musim Tanam Indramayu</Text>
            </View>

            <Text style={styles.recommendationTitle}>
              Tingkatkan Penjualan Pupuk NPK & Benih Padi Unggul
            </Text>
            <Text style={styles.recommendationDesc}>
              Musim tanam rendeng di wilayah pesisir Jawa Barat telah dimulai. Aktifkan voucher diskon ongkir untuk menarik kelompok tani.
            </Text>

            <Button
              variant="primary"
              size="sm"
              onPress={() => navigation.navigate('Promotions')}
              style={styles.recommendationButton}
            >
              Buat Voucher Diskon Sekarang
            </Button>
          </LinearGradient>
        ) : null}

        {/* 6. Peringatan Stok Menipis */}
        <Card style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.headerWithIcon}>
              <AlertTriangle size={18} color="#D97706" />
              <Text style={styles.sectionTitle}>PERINGATAN STOK MENIPIS</Text>
            </View>
            <Badge variant="warning" size="sm">
              {lowStockCount} Produk
            </Badge>
          </View>

          {products
            .filter((p) => p.stock <= p.minStockAlert)
            .slice(0, 3)
            .map((item) => (
              <View key={item.id} style={styles.stockItemRow}>
                <Image source={{ uri: item.image }} style={styles.stockItemImg} />
                <View style={styles.stockItemText}>
                  <Text style={styles.stockItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.stockItemSub}>
                    {item.category} · Sisa:{' '}
                    <Text style={styles.stockAlertText}>
                      {item.stock} {item.unit}
                    </Text>
                  </Text>
                </View>
                <Button
                  variant="softGreen"
                  size="sm"
                  onPress={() => navigation.navigate('Inventory')}
                >
                  Restock
                </Button>
              </View>
            ))}
        </Card>

        {/* 7. Pesanan Terbaru Preview */}
        <Card style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.headerTitleLeft}>
              <View style={styles.headerGreenDot} />
              <Text style={styles.sectionTitle}>PESANAN TERBARU MASUK</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.linkRow}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Lihat Semua</Text>
              <ChevronRight size={14} color="#32CD32" />
            </TouchableOpacity>
          </View>

          {orders.slice(0, 3).map((order) => (
            <View key={order.id} style={styles.recentOrderRow}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.orderBuyer}>{order.buyerName}</Text>
                <Text style={styles.orderTotal}>{formatRupiah(order.totalAmount)}</Text>
              </View>
              <Badge
                variant={
                  order.status === 'Selesai'
                    ? 'success'
                    : order.status === 'Diproses'
                    ? 'brand'
                    : order.status === 'Dibatalkan'
                    ? 'danger'
                    : 'warning'
                }
                size="sm"
              >
                {order.status}
              </Badge>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 96 : 80,
    gap: 14,
  },
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#32CD32',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileText: {
    flex: 1,
    gap: 3,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  ownerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  storeStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '700',
  },
  dotDivider: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  joinedText: {
    fontSize: 11,
    color: '#64748B',
  },
  profileActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  cardSection: {
    padding: 16,
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#32CD32',
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#32CD32',
  },
  pipelineGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  pipelineCol: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  pipelineIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 2,
  },
  badgeIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  pipelineCount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  pipelineLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  kpiContainer: {
    gap: 12,
  },
  balanceCard: {
    padding: 18,
    borderRadius: 20,
    shadowColor: '#32CD32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  balanceIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  arrowTopRight: {
    position: 'absolute',
    right: 0,
    top: 2,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 10,
    letterSpacing: -0.5,
  },
  balanceBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
  },
  balanceSub: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  withdrawButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  withdrawBtnText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCardHalf: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  kpiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiMiniTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  kpiMiniIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiMainNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  trendSub: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  trendNeutral: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  quickMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  quickMenuItem: {
    width: '22%',
    alignItems: 'center',
    gap: 6,
  },
  quickMenuIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  quickMenuBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  quickMenuBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  quickMenuLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 14,
  },
  recommendationBanner: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    position: 'relative',
    gap: 6,
  },
  recommendationClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recommendationBadge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#32CD32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.4,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 19,
  },
  recommendationDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  recommendationButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  stockItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stockItemImg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  stockItemText: {
    flex: 1,
    gap: 2,
  },
  stockItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  stockItemSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  stockAlertText: {
    color: '#D97706',
    fontWeight: '700',
  },
  recentOrderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  orderLeft: {
    gap: 2,
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderBuyer: {
    fontSize: 11.5,
    color: '#64748B',
  },
  orderTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
});