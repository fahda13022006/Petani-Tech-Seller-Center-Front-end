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
import { useOrderStore } from '@/store/useOrderStore';
import { OrderFilterTab, Order } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { formatRupiah } from '@/constants';
import {
  Search,
  Truck,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react-native';

const TABS: { key: OrderFilterTab; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'unpaid', label: 'Menunggu Bayar' },
  { key: 'processing', label: 'Diproses' },
  { key: 'shipped', label: 'Dikirim' },
  { key: 'completed', label: 'Selesai' },
  { key: 'cancelled', label: 'Dibatalkan' },
];

export function OrdersScreen() {
  const {
    orders,
    activeTab,
    searchQuery,
    fetchOrders,
    setActiveTab,
    setSearchQuery,
    shipOrder,
    completeOrder,
    cancelOrder,
  } = useOrderStore();

  const [selectedOrderForShip, setSelectedOrderForShip] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleShipSubmit = async () => {
    if (!selectedOrderForShip || !trackingNumberInput.trim()) return;
    await shipOrder(selectedOrderForShip.id, trackingNumberInput.trim());
    setSelectedOrderForShip(null);
    setTrackingNumberInput('');
  };

  const handleCancelOrder = (id: string, orderNumber: string) => {
    Alert.alert(
      'Batalkan Pesanan',
      `Apakah Anda yakin ingin membatalkan pesanan ${orderNumber}?`,
      [
        { text: 'Kembali', style: 'cancel' },
        {
          text: 'Batalkan Pesanan',
          style: 'destructive',
          onPress: async () => {
            await cancelOrder(id, 'Dibatalkan oleh penjual');
          },
        },
      ]
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Diproses':
        return 'warning';
      case 'Dikirim':
        return 'info';
      case 'Selesai':
        return 'success';
      case 'Dibatalkan':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.screenTitle}>Pesanan Masuk</Text>
          <Text style={styles.screenSubtitle}>
            Pantau dan proses pengiriman produk pertanian ke pembeli
          </Text>
        </View>
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
              fetchOrders();
            }}
            placeholder="Cari no. pesanan, nama pembeli, produk..."
            placeholderTextColor="#A0A8A0"
          />
        </View>
      </View>

      {/* Tabs */}
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

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {orders.length === 0 ? (
          <EmptyState
            variant="orders"
            title="Tidak Ada Pesanan"
            description="Tidak ada pesanan yang sesuai dengan filter atau kata kunci pencarian."
          />
        ) : (
          orders.map((order) => (
            <Card key={order.id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderCardHeader}>
                <View style={styles.orderHeaderLeft}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <View style={styles.clockRow}>
                    <Clock size={12} color="#818981" />
                    <Text style={styles.orderDate}>{order.createdAt}</Text>
                  </View>
                </View>
                <Badge variant={getStatusBadgeVariant(order.status)} size="sm">
                  {order.status}
                </Badge>
              </View>

              {/* Buyer Info */}
              <View style={styles.buyerBox}>
                <View style={styles.buyerRow}>
                  <Text style={styles.buyerName}>{order.buyerName}</Text>
                  <View style={styles.phoneRow}>
                    <Phone size={12} color="#34764A" />
                    <Text style={styles.buyerPhone}>{order.buyerPhone}</Text>
                  </View>
                </View>
                <View style={styles.addressRow}>
                  <MapPin size={12} color="#818981" />
                  <Text style={styles.addressText} numberOfLines={2}>
                    {order.buyerAddress}
                  </Text>
                </View>
                <View style={styles.courierRow}>
                  <Truck size={12} color="#34764A" />
                  <Text style={styles.courierText}>
                    {order.courier}
                    {order.trackingNumber ? ` (Resi: ${order.trackingNumber})` : ''}
                  </Text>
                </View>
              </View>

              {/* Order Items */}
              <View style={styles.itemsList}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Image source={{ uri: item.productImage }} style={styles.itemImage} />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.productName}
                      </Text>
                      <Text style={styles.itemSub}>
                        {item.quantity} x {formatRupiah(item.unitPrice)}
                      </Text>
                    </View>
                    <Text style={styles.itemSubtotal}>
                      {formatRupiah(item.unitPrice * item.quantity)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Card Footer */}
              <View style={styles.orderFooter}>
                <View>
                  <Text style={styles.totalLabel}>Total Pembayaran</Text>
                  <Text style={styles.totalAmount}>{formatRupiah(order.totalAmount)}</Text>
                </View>

                <View style={styles.actionBtnGroup}>
                  {order.status === 'Diproses' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Truck size={14} color="#FFFFFF" />}
                      onPress={() => {
                        setSelectedOrderForShip(order);
                        setTrackingNumberInput(`AGRO-${Math.floor(1000000 + Math.random() * 9000000)}`);
                      }}
                    >
                      Kirim Pesanan
                    </Button>
                  ) : order.status === 'Dikirim' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle2 size={14} color="#FFFFFF" />}
                      onPress={async () => {
                        await completeOrder(order.id);
                      }}
                    >
                      Selesaikan
                    </Button>
                  ) : null}

                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setSelectedOrderReceipt(order)}
                  >
                    Detail
                  </Button>

                  {order.status === 'Diproses' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => handleCancelOrder(order.id, order.orderNumber)}
                      textStyle={{ color: '#D95757' }}
                    >
                      Batal
                    </Button>
                  ) : null}
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Ship Order Modal */}
      <Modal
        visible={!!selectedOrderForShip}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedOrderForShip(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Input Resi Pengiriman</Text>
            <Text style={styles.modalDesc}>
              Pesanan {selectedOrderForShip?.orderNumber} ({selectedOrderForShip?.courier})
            </Text>
            <TextInput
              style={styles.modalInput}
              value={trackingNumberInput}
              onChangeText={setTrackingNumberInput}
              placeholder="Nomor Resi / AWB"
              autoFocus
            />
            <View style={styles.modalActions}>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setSelectedOrderForShip(null)}
              >
                Batal
              </Button>
              <Button variant="primary" size="sm" onPress={handleShipSubmit}>
                Konfirmasi Kirim
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Order Detail / Receipt Modal */}
      <Modal
        visible={!!selectedOrderReceipt}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrderReceipt(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { maxHeight: '80%' }]}>
            <View style={styles.receiptHeader}>
              <Text style={styles.modalTitle}>Rincian Pesanan</Text>
              <TouchableOpacity onPress={() => setSelectedOrderReceipt(null)}>
                <X size={20} color="#818981" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 10 }}>
              <Text style={styles.receiptLabel}>No. Pesanan:</Text>
              <Text style={styles.receiptVal}>{selectedOrderReceipt?.orderNumber}</Text>

              <Text style={[styles.receiptLabel, { marginTop: 8 }]}>Pembeli:</Text>
              <Text style={styles.receiptVal}>{selectedOrderReceipt?.buyerName} ({selectedOrderReceipt?.buyerPhone})</Text>

              <Text style={[styles.receiptLabel, { marginTop: 8 }]}>Alamat:</Text>
              <Text style={styles.receiptVal}>{selectedOrderReceipt?.buyerAddress}</Text>

              <Text style={[styles.receiptLabel, { marginTop: 8 }]}>Metode Pembayaran:</Text>
              <Text style={styles.receiptVal}>{selectedOrderReceipt?.paymentMethod}</Text>

              <Text style={[styles.receiptLabel, { marginTop: 8 }]}>Kurir:</Text>
              <Text style={styles.receiptVal}>{selectedOrderReceipt?.courier} (Ongkir: {selectedOrderReceipt ? formatRupiah(selectedOrderReceipt.shippingFee) : 'Rp0'})</Text>

              <Text style={[styles.receiptLabel, { marginTop: 12 }]}>Produk Dipesan:</Text>
              {selectedOrderReceipt?.items.map((it, idx) => (
                <View key={idx} style={styles.receiptItemRow}>
                  <Text style={styles.receiptItemName}>{it.productName} (x{it.quantity})</Text>
                  <Text style={styles.receiptItemPrice}>{formatRupiah(it.unitPrice * it.quantity)}</Text>
                </View>
              ))}

              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Total:</Text>
                <Text style={styles.receiptTotalVal}>
                  {selectedOrderReceipt ? formatRupiah(selectedOrderReceipt.totalAmount) : ''}
                </Text>
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
    borderColor: '#E2E8DE',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#213329',
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
  listContent: {
    padding: 16,
    paddingBottom: 96,
    gap: 12,
  },
  orderCard: {
    padding: 14,
    gap: 10,
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EC',
  },
  orderHeaderLeft: {
    gap: 2,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#213329',
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderDate: {
    fontSize: 10,
    color: '#818981',
  },
  buyerBox: {
    backgroundColor: '#F8FAF7',
    borderRadius: 10,
    padding: 10,
    gap: 5,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buyerPhone: {
    fontSize: 11,
    color: '#34764A',
    fontWeight: '600',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  addressText: {
    fontSize: 11,
    color: '#68746B',
    flex: 1,
  },
  courierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  courierText: {
    fontSize: 11,
    color: '#34764A',
    fontWeight: '600',
  },
  itemsList: {
    gap: 8,
    paddingVertical: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E8ECE7',
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  itemSub: {
    fontSize: 11,
    color: '#818981',
  },
  itemSubtotal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F3EC',
  },
  totalLabel: {
    fontSize: 10,
    color: '#818981',
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34764A',
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    color: '#213329',
  },
  modalDesc: {
    fontSize: 12,
    color: '#68746B',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8DE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#213329',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#818981',
  },
  receiptVal: {
    fontSize: 13,
    color: '#213329',
    marginTop: 1,
  },
  receiptItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  receiptItemName: {
    fontSize: 12,
    color: '#213329',
  },
  receiptItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34764A',
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8ECE7',
  },
  receiptTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#213329',
  },
  receiptTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#34764A',
  },
});