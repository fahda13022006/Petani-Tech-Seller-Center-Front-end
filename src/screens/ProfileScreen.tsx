import React, { useState } from 'react';
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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  LogOut,
  Edit2,
  ShieldCheck,
  Bell,
  X,
} from 'lucide-react-native';

export function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [storeName, setStoreName] = useState(user?.storeName || 'Pak Budi Agro Store');
  const [email, setEmail] = useState(user?.email || 'seller@petanitech.id');
  const [phone, setPhone] = useState(user?.phone || '0812-9876-5432');
  const [storeAddress, setStoreAddress] = useState(
    user?.storeAddress ||
      'Sentra Distribusi Agribisnis Blok C No. 14, Pagaden, Kab. Subang, Jawa Barat 41252'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun Petani Tech Seller Center?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    if (!storeName.trim() || !email.trim()) {
      Alert.alert('Perhatian', 'Nama toko dan email tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        storeName: storeName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        storeAddress: storeAddress.trim(),
      });
      setIsEditModalOpen(false);
      Alert.alert('Sukses', 'Informasi toko berhasil diperbarui!');
    } catch (err: unknown) {
      Alert.alert('Gagal', err instanceof Error ? err.message : 'Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.screenTitle}>Profil Toko</Text>
          <Text style={styles.screenSubtitle}>
            Identitas resmi toko pertanian, alamat gudang, dan keamanan
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Store Identity Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri:
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
              }}
              style={styles.avatar}
            />

            <View style={styles.profileDetails}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.storeName}>{user?.storeName || 'Pak Budi Agro Store'}</Text>
                <Badge variant="success" size="sm" dot>
                  {user?.status || 'Aktif'}
                </Badge>
              </View>

              <Text style={styles.ownerText}>
                Pemilik: {user?.name || 'Budi Santoso'} · Sejak {user?.joinedDate || '2025'}
              </Text>

              <View style={styles.tagRow}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>
                    ⭐ {user?.rating || 4.9} ({user?.totalReview || 842} Ulasan)
                  </Text>
                </View>
                <Text style={styles.storeIdText}>ID: {user?.storeId || 'ID-AGRO-7729'}</Text>
              </View>
            </View>
          </View>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 size={14} color="#34764A" />}
            onPress={() => {
              setStoreName(user?.storeName || '');
              setEmail(user?.email || '');
              setPhone(user?.phone || '');
              setStoreAddress(user?.storeAddress || '');
              setIsEditModalOpen(true);
            }}
          >
            Ubah Informasi Toko
          </Button>
        </Card>

        {/* Store Contact & Address */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>KONTAK & ALAMAT GUDANG</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Mail size={16} color="#34764A" />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Email Toko</Text>
              <Text style={styles.infoVal}>{user?.email || 'seller@petanitech.id'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Phone size={16} color="#34764A" />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Nomor WhatsApp / HP</Text>
              <Text style={styles.infoVal}>{user?.phone || '0812-9876-5432'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <MapPin size={16} color="#34764A" />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Alamat Gudang Pengiriman</Text>
              <Text style={styles.infoVal}>
                {user?.storeAddress ||
                  'Sentra Distribusi Agribisnis Blok C No. 14, Pagaden, Kab. Subang, Jawa Barat 41252'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Bank Account */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>REKENING BANK PENCAIRAN</Text>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <CreditCard size={16} color="#2563EB" />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoVal}>
                {user?.bankAccount?.bankName || 'BRI'} -{' '}
                {user?.bankAccount?.accountNumber || '0123-01-084920-50-8'}
              </Text>
              <Text style={styles.infoLabel}>
                Atas Nama: {user?.bankAccount?.accountHolder || 'Budi Santoso'} (Terverifikasi)
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings & Preferences */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>PENGATURAN & KEAMANAN</Text>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Bell size={18} color="#68746B" />
              <View>
                <Text style={styles.preferenceTitle}>Notifikasi Pesanan Baru</Text>
                <Text style={styles.preferenceDesc}>Dapatkan pemberitahuan seketika ada pesanan</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E2E8DE', true: '#A9CF8C' }}
              thumbColor={notificationsEnabled ? '#34764A' : '#FFFFFF'}
            />
          </View>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <ShieldCheck size={18} color="#059669" />
              <View>
                <Text style={styles.preferenceTitle}>Status Verifikasi Legalitas Toko</Text>
                <Text style={styles.preferenceDesc}>Terdaftar resmi di Kementerian Pertanian</Text>
              </View>
            </View>
            <Badge variant="success" size="sm">
              Verified
            </Badge>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          variant="danger"
          size="md"
          leftIcon={<LogOut size={18} color="#FFFFFF" />}
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          Keluar dari Toko
        </Button>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ubah Informasi Toko</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <X size={20} color="#818981" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 8 }} keyboardShouldPersistTaps="handled">
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nama Toko Pertanian</Text>
                <TextInput
                  style={styles.formInput}
                  value={storeName}
                  onChangeText={setStoreName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Toko</Text>
                <TextInput
                  style={styles.formInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nomor Telepon / WhatsApp</Text>
                <TextInput
                  style={styles.formInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Alamat Gudang Toko</Text>
                <TextInput
                  style={[styles.formInput, { height: 64, textAlignVertical: 'top' }]}
                  value={storeAddress}
                  onChangeText={setStoreAddress}
                  multiline
                />
              </View>

              <View style={styles.modalActions}>
                <Button
                  variant="ghost"
                  size="md"
                  onPress={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onPress={handleUpdate}
                  isLoading={isSaving}
                >
                  Simpan Perubahan
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
  profileCard: {
    padding: 16,
    gap: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#7FB257',
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#213329',
  },
  ownerText: {
    fontSize: 11,
    color: '#818981',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#EAF4E3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34764A',
  },
  storeIdText: {
    fontSize: 10,
    color: '#818981',
    fontWeight: '600',
  },
  sectionCard: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#818981',
    letterSpacing: 0.8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F6F8F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoTextCol: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 10,
    color: '#818981',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
    lineHeight: 18,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EC',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  preferenceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#213329',
  },
  preferenceDesc: {
    fontSize: 10,
    color: '#818981',
  },
  logoutBtn: {
    marginTop: 8,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
});