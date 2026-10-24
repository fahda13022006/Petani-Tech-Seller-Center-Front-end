import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSellerNavigation } from '@/navigation/hooks';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { StatCard } from '@/components/common/StatCard';
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

  const activeProductsCount = products.filter((p) => p.status === 'Aktif').length || 42;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const processingOrdersCount = orders.filter((o) => o.status === 'Diproses').length;

  const quickMenus = [
    { name: 'Produk', screen: 'Products' as const, icon: Package, color: '#D97706', bgColor: '#FFFBEB' },
    { name: 'Pesanan', screen: 'Orders' as const, icon: ShoppingCart, color: '#059669', bgColor: '#ECFDF5', count: processingOrdersCount ? String(processingOrdersCount) : undefined },
    { name: 'Keuangan', screen: 'Finance' as const, icon: Wallet, color: '#2563EB', bgColor: '#EFF6FF' },
    { name: 'Inventori', screen: 'Inventory' as const, icon: Boxes, color: '#4B5563', bgColor: '#F3F4F6', count: lowStockCount ? String(lowStockCount) : undefined },
    { name: 'Promosi', screen: 'Promotions' as const, icon: Tags, color: '#7C3AED', bgColor: '#F5F3FF' },
    { name: 'Analitik', screen: 'Analytics' as const, icon: BarChart3, color: '#E11D48', bgColor: '#FFF1F2' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Profile Banner */}
        <View style={styles.profileBanner}>
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileText}>
            <View style={styles.storeTitleRow}>
              <Text style={styles.storeName}>{user?.storeName || 'Pak Budi Agro Store'}</Text>
              <Badge variant="success" dot size="sm">
                {user?.status || 'Aktif'}
              </Badge>
            </View>
            <Text style={styles.storeSub}>
              ⭐ 4.9 · Mitra Petani & Distributor Agrikultur
            </Text>
          </View>
        </View>

        {/* 2. Order Quick Status Bar */}
        <Card style={styles.cardPadding}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>STATUS PESANAN TERKINI</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.linkRow}
            >
              <Text style={styles.linkText}>Lihat Semua</Text>
              <ChevronRight size={14} color="#34764A" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusGrid}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.statusCol}
            >
              <Truck size={20} color="#34764A" />
              <Text style={styles.statusCount}>{processingOrdersCount}</Text>
              <Text style={styles.statusLabel}>Perlu Dikirim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.statusCol}
            >
              <Package size={20} color="#D97706" />
              <Text style={styles.statusCount}>1</Text>
              <Text style={styles.statusLabel}>Pembatalan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Informasi', 'Tidak ada pengajuan pengembalian barang saat ini.')}
              style={styles.statusCol}
            >
              <RotateCcw size={20} color="#818981" />
              <Text style={styles.statusCount}>0</Text>
              <Text style={styles.statusLabel}>Pengembalian</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Ulasan Buyer', '4 ulasan bintang 5 baru dari mitra tani Subang')}
              style={styles.statusCol}
            >
              <MessageSquare size={20} color="#E9A23B" />
              <Text style={[styles.statusCount, { color: '#E9A23B' }]}>4</Text>
              <Text style={styles.statusLabel}>Penilaian</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 3. Dashboard KPI Summary Cards */}
        <View style={styles.kpiGrid}>
          <StatCard
            title="Total Penjualan"
            value="Rp 25.500.000"
            subtitle="Bulan Oktober 2026"
            icon={TrendingUp}
            iconBgColor="#EAF4E3"
            iconColor="#34764A"
            trend={{ value: '18.4% vs bln lalu', isPositive: true }}
            onPress={() => navigation.navigate('Analytics')}
            style={styles.kpiCard}
          />
          <StatCard
            title="Saldo Tersedia"
            value={formatRupiah(financeSummary?.availableBalance || 8500000)}
            subtitle="Siap ditarik"
            icon={Wallet}
            iconBgColor="#EFF6FF"
            iconColor="#2563EB"
            onPress={() => navigation.navigate('Finance')}
            style={styles.kpiCard}
          />
        </View>

        <View style={styles.kpiGrid}>
          <StatCard
            title="Pesanan Baru"
            value="15"
            subtitle="12 terbayar otomatis"
            icon={ShoppingCart}
            iconBgColor="#EFF6FF"
            iconColor="#2563EB"
            trend={{ value: '+5 hari ini', isPositive: true }}
            onPress={() => navigation.navigate('Orders')}
            style={styles.kpiCard}
          />
          <StatCard
            title="Produk Aktif"
            value={activeProductsCount.toString()}
            subtitle="4 kategori agro"
            icon={Package}
            iconBgColor="#ECFDF5"
            iconColor="#059669"
            trend={{ value: '100% verifikasi', isPositive: true }}
            onPress={() => navigation.navigate('Products')}
            style={styles.kpiCard}
          />
        </View>

        {/* 4. Quick Action Menu Grid */}
        <Card style={styles.cardPadding}>
          <Text style={styles.sectionTitle}>AKSES MENU CEPAT TOKO</Text>
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
                  {item.count ? (
                    <View style={styles.quickMenuBadge}>
                      <Text style={styles.quickMenuBadgeText}>{item.count}</Text>
                    </View>
                  ) : null}
                  <View style={[styles.quickMenuIcon, { backgroundColor: item.bgColor }]}>
                    <Icon size={20} color={item.color} />
                  </View>
                  <Text style={styles.quickMenuLabel}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* 5. Rekomendasi Bisnis Agrikultur Banner */}
        {showRecommendation ? (
          <Card style={[styles.recommendationCard, styles.cardPadding]}>
            <TouchableOpacity
              onPress={() => setShowRecommendation(false)}
              style={styles.recommendationClose}
            >
              <X size={16} color="#818981" />
            </TouchableOpacity>

            <View style={styles.recommendationHeader}>
              <View style={styles.recommendationBadge}>
                <Sparkles size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.recommendationBadgeText}>Rekomendasi Musim Tanam</Text>
            </View>

            <Text style={styles.recommendationTitle}>
              Optimalkan Penjualan Pupuk & Alat Pertanian
            </Text>
            <Text style={styles.recommendationDesc}>
              Aktifkan promo diskon voucher untuk meningkatkan penjualan saat petani mulai membajak sawah.
            </Text>

            <Button
              variant="primary"
              size="sm"
              onPress={() => navigation.navigate('Promotions')}
              style={styles.recommendationButton}
            >
              Aktifkan Voucher Promo
            </Button>
          </Card>
        ) : null}

        {/* 6. Peringatan Stok Menipis */}
        <Card style={styles.cardPadding}>
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

        {/* 7. Pesanan Terbaru */}
        <Card style={styles.cardPadding}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>PESANAN TERBARU</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.linkRow}
            >
              <Text style={styles.linkText}>Lihat Semua</Text>
              <ChevronRight size={14} color="#34764A" />
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
    backgroundColor: '#F6F8F4',
  },
  content: {
    padding: 16,
    paddingBottom: 96,
    gap: 14,
  },
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8ECE7',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#7FB257',
  },
  profileText: {
    flex: 1,
    gap: 3,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#213329',
  },
  storeSub: {
    fontSize: 11,
    color: '#68746B',
  },
  cardPadding: {
    padding: 16,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#818981',
    letterSpacing: 0.8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34764A',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  statusCol: {
    alignItems: 'center',
    gap: 4,
  },
  statusCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#213329',
  },
  statusLabel: {
    fontSize: 11,
    color: '#68746B',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
  },
  quickMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickMenuItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAF7',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    gap: 6,
    position: 'relative',
  },
  quickMenuBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: '#D95757',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  quickMenuBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  quickMenuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickMenuLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#213329',
  },
  recommendationCard: {
    backgroundColor: '#EAF4E3',
    borderColor: '#A9CF8C',
    position: 'relative',
  },
  recommendationClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recommendationBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#34764A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34764A',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#213329',
  },
  recommendationDesc: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
  },
  recommendationButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  stockItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF7',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EAEFE6',
    gap: 10,
  },
  stockItemImg: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  stockItemText: {
    flex: 1,
    gap: 2,
  },
  stockItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  stockItemSub: {
    fontSize: 11,
    color: '#818981',
  },
  stockAlertText: {
    color: '#D95757',
    fontWeight: '700',
  },
  recentOrderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EC',
  },
  orderLeft: {
    gap: 2,
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  orderBuyer: {
    fontSize: 11,
    color: '#68746B',
  },
  orderTotal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#34764A',
  },
});