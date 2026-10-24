import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyticsService } from '@/services/analyticsService';
import { AnalyticsSummary } from '@/types';
import { Card } from '@/components/common/Card';
import { StatCard } from '@/components/common/StatCard';
import { Badge } from '@/components/common/Badge';
import { formatRupiah, formatNumber } from '@/constants';
import {
  Users,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  BarChart3,
} from 'lucide-react-native';

export function AnalyticsScreen() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [metricView, setMetricView] = useState<'revenue' | 'orders'>('revenue');

  useEffect(() => {
    analyticsService.getAnalytics().then(setData);
  }, []);

  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#32CD32" />
          <Text style={styles.loadingText}>Memuat analitik performa toko...</Text>
        </View>
      </SafeAreaView>
    );
  }


  const currentChartData =
    timeframe === 'daily'
      ? data.dailyData
      : timeframe === 'weekly'
      ? data.weeklyData
      : data.monthlyData;

  const maxVal = Math.max(
    ...currentChartData.map((d) => (metricView === 'revenue' ? d.penjualan : d.pesanan)),
    1
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.screenTitle}>Performa Toko</Text>
          <Text style={styles.screenSubtitle}>
            Metrik penjualan produk pertanian dan konversi pembeli
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeframe Switcher */}
        <View style={styles.timeframeRow}>
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTimeframe(t)}
              style={[
                styles.timeframeBtn,
                timeframe === t && styles.timeframeBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.timeframeBtnText,
                  timeframe === t && styles.timeframeBtnTextActive,
                ]}
              >
                {t === 'daily' ? 'Harian (7 Hari)' : t === 'weekly' ? 'Mingguan' : 'Bulanan'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4 Summary Stat Cards */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total Pendapatan"
            value={formatRupiah(data.summary.totalOrders * data.summary.averageOrderValue)}
            icon={DollarSign}
            iconBgColor="#F0FDF4"
            iconColor="#15803D"

            trend={{ value: '+18.4%', isPositive: true }}
            style={styles.statCardHalf}
          />
          <StatCard
            title="Total Pesanan"
            value={`${data.summary.totalOrders} Pesanan`}
            icon={ShoppingCart}
            iconBgColor="#EFF6FF"
            iconColor="#2563EB"
            trend={{ value: '+12%', isPositive: true }}
            style={styles.statCardHalf}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Pengunjung Toko"
            value={formatNumber(data.summary.totalVisitors)}
            icon={Users}
            iconBgColor="#FFFBEB"
            iconColor="#D97706"
            trend={{ value: '+24%', isPositive: true }}
            style={styles.statCardHalf}
          />
          <StatCard
            title="Tingkat Konversi"
            value={`${data.summary.conversionRate}%`}
            icon={TrendingUp}
            iconBgColor="#ECFDF5"
            iconColor="#059669"
            trend={{ value: '+1.8%', isPositive: true }}
            style={styles.statCardHalf}
          />
        </View>

        {/* Interactive Bar Chart Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Grafik Tren Penjualan</Text>
              <Text style={styles.chartSub}>
                {metricView === 'revenue' ? 'Omset Penjualan (Rp)' : 'Volume Jumlah Pesanan'}
              </Text>
            </View>

            <View style={styles.metricSwitchRow}>
              <TouchableOpacity
                onPress={() => setMetricView('revenue')}
                style={[
                  styles.metricSwitchChip,
                  metricView === 'revenue' && styles.metricSwitchChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.metricSwitchText,
                    metricView === 'revenue' && styles.metricSwitchTextActive,
                  ]}
                >
                  Omset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMetricView('orders')}
                style={[
                  styles.metricSwitchChip,
                  metricView === 'orders' && styles.metricSwitchChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.metricSwitchText,
                    metricView === 'orders' && styles.metricSwitchTextActive,
                  ]}
                >
                  Pesanan
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bar Chart Visualization */}
          <View style={styles.barChartContainer}>
            {currentChartData.map((item, idx) => {
              const val = metricView === 'revenue' ? item.penjualan : item.pesanan;
              const barHeightPct = Math.max(12, Math.round((val / maxVal) * 100));
              const label =
                'date' in item
                  ? (item as { date: string }).date
                  : 'week' in item
                  ? (item as { week: string }).week
                  : (item as { month: string }).month;

              return (
                <View key={idx} style={styles.barColumn}>
                  <Text style={styles.barValueText}>
                    {metricView === 'revenue' ? `${Math.round(val / 1000000)}jt` : val}
                  </Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${barHeightPct}%` }]} />
                  </View>
                  <Text style={styles.barLabelText}>{label}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Top Selling Products List */}
        <Card style={styles.topProductsCard}>
          <View style={styles.topProductsHeader}>
            <BarChart3 size={18} color="#15803D" />

            <Text style={styles.topProductsTitle}>Produk Terlaris Bulan Ini</Text>
          </View>

          {data.topProducts.map((prod, idx) => (
            <View key={idx} style={styles.topProductRow}>
              <View style={styles.rankCircle}>
                <Text style={styles.rankText}>{idx + 1}</Text>
              </View>

              <View style={styles.topProductDetails}>
                <Text style={styles.topProductName}>{prod.name}</Text>
                <Text style={styles.topProductSub}>
                  {prod.category} · Terjual {prod.soldCount} pcs
                </Text>
              </View>

              <View style={styles.topProductRight}>
                <Text style={styles.topProductRevenue}>
                  {formatRupiah(prod.revenue)}
                </Text>
                <Badge variant="success" size="sm">
                  {`+${prod.growth}%`}
                </Badge>
              </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 13,
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
    gap: 14,
  },
  timeframeRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  timeframeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  timeframeBtnActive: {
    backgroundColor: '#32CD32',
  },
  timeframeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  timeframeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCardHalf: {
    flex: 1,
  },
  chartCard: {
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  chartSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  metricSwitchRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  metricSwitchChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metricSwitchChipActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  metricSwitchText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  metricSwitchTextActive: {
    color: '#15803D',
    fontWeight: '700',
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    paddingTop: 24,
    paddingBottom: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barValueText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  barTrack: {
    width: 22,
    height: 110,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#32CD32',
    borderRadius: 6,
  },
  barLabelText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  topProductsCard: {
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topProductsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 4,
  },
  topProductsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  topProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rankCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  topProductDetails: {
    flex: 1,
    gap: 2,
  },
  topProductName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  topProductSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  topProductRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  topProductRevenue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
});