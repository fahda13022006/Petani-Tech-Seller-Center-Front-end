import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Alert,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/forms/Input';
import {
  Mail,
  Phone,
  MapPin,
  LogOut,
  Edit3,
  X,
  Camera,
  Store,
  User,
  Building2,
} from 'lucide-react-native';


export function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [storeName, setStoreName] = useState(user?.storeName || 'Toko Tani Makmur Fahda');
  const [name, setName] = useState(user?.name || 'Fahda Febriya');
  const [email, setEmail] = useState(user?.email || 'fahda@petanitech.id');
  const [phone, setPhone] = useState(user?.phone || '0812-3456-7890');
  const [storeAddress, setStoreAddress] = useState(
    user?.storeAddress ||
      'Jl. Raya Indramayu - Cirebon No. 88, Kec. Jatibarang, Kab. Indramayu, Jawa Barat 45214'
  );

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [storeIsOpen, setStoreIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Pick Image from Gallery or Camera
  const pickImage = async (useCamera = false) => {
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Izin Kamera Ditolak', 'Aplikasi membutuhkan izin kamera untuk mengambil foto.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        if (!result.canceled && result.assets[0]?.uri) {
          await updateProfile({ avatar: result.assets[0].uri });
          Alert.alert('Foto Profil Diperbarui', 'Foto toko Anda berhasil diganti.');
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Izin Galeri Ditolak',
            'Aplikasi membutuhkan izin galeri untuk memilih foto dari perangkat Anda.'
          );
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        if (!result.canceled && result.assets[0]?.uri) {
          await updateProfile({ avatar: result.assets[0].uri });
          Alert.alert('Foto Profil Diperbarui', 'Foto toko Anda berhasil diganti dari galeri.');
        }
      }
    } catch (err: unknown) {
      Alert.alert(
        'Gagal Membuka Gambar',
        err instanceof Error ? err.message : 'Terjadi kendala saat memilih foto.'
      );
    }
  };

  const handleAvatarPress = () => {
    Alert.alert(
      'Ganti Foto Profil Toko',
      'Pilih sumber gambar untuk profil toko pertanian Anda:',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Pilih dari Galeri',
          onPress: () => void pickImage(false),
        },
        {
          text: 'Ambil Foto Baru',
          onPress: () => void pickImage(true),
        },
      ]
    );
  };

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

  const handleSaveProfile = async () => {
    if (!storeName.trim() || !name.trim() || !email.trim() || !storeAddress.trim()) {
      Alert.alert('Perhatian', 'Nama toko, nama pemilik, email, dan alamat tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        storeName: storeName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        storeAddress: storeAddress.trim(),
      });
      setIsEditModalOpen(false);
      Alert.alert('Sukses', 'Informasi profil toko berhasil diperbarui!');
    } catch (err: unknown) {
      Alert.alert('Gagal', err instanceof Error ? err.message : 'Gagal memperbarui profil toko');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <LinearGradient
        colors={['#F0FDF4', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <View style={styles.titleCol}>
          <Text style={styles.screenTitle}>Profil Seller</Text>
          <Text style={styles.screenSubtitle}>
            Identitas toko, alamat gudang distribusi, dan pengaturan akun
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Store Identity Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                onPress={handleAvatarPress}
                style={styles.cameraBtn}
                activeOpacity={0.8}
                accessibilityLabel="Ganti foto profil toko"
              >
                <Camera size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.storeName}>{user?.storeName || 'Toko Tani Makmur Fahda'}</Text>
              </View>

              <View style={styles.badgeLine}>
                <Badge variant="success" size="sm" dot>
                  {user?.status || 'Seller Terverifikasi'}
                </Badge>
                <Text style={styles.storeIdText}>ID: {user?.storeId || 'ID-AGRO-INDRAMAYU-01'}</Text>
              </View>

              <Text style={styles.ownerText}>
                Pemilik: <Text style={styles.ownerNameText}>{user?.name || 'Fahda Febriya'}</Text>
              </Text>

              <View style={styles.tagRow}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>
                    ⭐ {user?.rating || 4.95} ({user?.totalReview || 1280} Ulasan)
                  </Text>
                </View>
                <Text style={styles.cityBadge}>📍 Indramayu, Jawa Barat</Text>
              </View>
            </View>
          </View>

          <Button
            variant="outline"
            size="md"
            leftIcon={<Edit3 size={15} color="#15803D" />}
            onPress={() => {
              setName(user?.name || 'Fahda Febriya');
              setStoreName(user?.storeName || 'Toko Tani Makmur Fahda');
              setEmail(user?.email || 'fahda@petanitech.id');
              setPhone(user?.phone || '0812-3456-7890');
              setStoreAddress(
                user?.storeAddress ||
                  'Jl. Raya Indramayu - Cirebon No. 88, Kec. Jatibarang, Kab. Indramayu, Jawa Barat 45214'
              );
              setIsEditModalOpen(true);
            }}
            style={styles.editProfileBtn}
          >
            Ubah Informasi Toko & Kontak
          </Button>
        </Card>

        {/* Detail Kontak & Lokasi Gudang */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>INFORMASI KONTAK & GUDANG</Text>

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#F0FDF4' }]}>
              <User size={18} color="#15803D" />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Nama Pemilik</Text>
              <Text style={styles.infoValue}>{user?.name || 'Fahda Febriya'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Mail size={18} color="#2563EB" />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Email Resmi</Text>
              <Text style={styles.infoValue}>{user?.email || 'fahda@petanitech.id'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Phone size={18} color="#059669" />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Nomor WhatsApp / HP</Text>
              <Text style={styles.infoValue}>{user?.phone || '0812-3456-7890'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#FFFBEB' }]}>
              <MapPin size={18} color="#D97706" />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Alamat Gudang Asal Pengiriman</Text>
              <Text style={styles.infoValue}>
                {user?.storeAddress ||
                  'Jl. Raya Indramayu - Cirebon No. 88, Kec. Jatibarang, Kab. Indramayu, Jawa Barat 45214'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Rekening Penarikan Dana Bank */}
        <Card style={styles.sectionCard}>
          <View style={styles.rekeningHeader}>
            <Text style={styles.sectionHeading}>REKENING PENCAIRAN SALDO</Text>
            <Badge variant="success" size="sm">Terverifikasi</Badge>
          </View>

          <View style={styles.bankCardBox}>
            <View style={styles.bankRow}>
              <Building2 size={20} color="#15803D" />
              <Text style={styles.bankName}>Bank Rakyat Indonesia (BRI)</Text>
            </View>
            <Text style={styles.bankNumber}>4321 - 01 - 098765 - 53 - 2</Text>
            <Text style={styles.bankHolder}>A.N. FAHDA FEBRIYA</Text>
          </View>
        </Card>

        {/* Pengaturan Operasional Toko */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>PENGATURAN OPERASIONAL</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Status Toko Aktif Menerima Pesanan</Text>
              <Text style={styles.switchSub}>
                Jika dinonaktifkan, pembeli tidak dapat membuat pesanan baru
              </Text>
            </View>
            <Switch
              value={storeIsOpen}
              onValueChange={setStoreIsOpen}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={storeIsOpen ? '#32CD32' : '#F1F5F9'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Notifikasi Pesanan & Chat Baru</Text>
              <Text style={styles.switchSub}>
                Dapatkan pemberitahuan seketika saat pembeli memesan
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={notificationsEnabled ? '#32CD32' : '#F1F5F9'}
            />
          </View>
        </Card>

        {/* Tombol Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
          activeOpacity={0.8}
        >
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Keluar dari Akun Seller</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Edit Informasi Toko */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ubah Informasi Toko</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Input
                label="Nama Pemilik Toko"
                value={name}
                onChangeText={setName}
                leftIcon={<User size={18} color="#94A3B8" />}
                required
              />

              <Input
                label="Nama Toko"
                value={storeName}
                onChangeText={setStoreName}
                leftIcon={<Store size={18} color="#94A3B8" />}
                required
              />

              <Input
                label="Email Resmi"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Mail size={18} color="#94A3B8" />}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />

              <Input
                label="Nomor WhatsApp"
                value={phone}
                onChangeText={setPhone}
                leftIcon={<Phone size={18} color="#94A3B8" />}
                keyboardType="phone-pad"
                required
              />

              <Input
                label="Alamat Lengkap Gudang (Indramayu)"
                value={storeAddress}
                onChangeText={setStoreAddress}
                leftIcon={<MapPin size={18} color="#94A3B8" />}
                multiline
                required
              />

              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setIsEditModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  onPress={() => void handleSaveProfile()}
                  style={styles.saveBtn}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FDF4',
  },
  titleCol: {
    gap: 3,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 96 : 80,
    gap: 14,
  },
  profileCard: {
    padding: 18,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#32CD32',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#32CD32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 1,
  },
  storeIdText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  ownerText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  ownerNameText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  ratingBadge: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '700',
  },
  cityBadge: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '700',
  },
  editProfileBtn: {
    marginTop: 4,
  },
  sectionCard: {
    padding: 18,
    borderRadius: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextBox: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  rekeningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankCardBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  bankNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  bankHolder: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  switchTextCol: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  switchSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 14,
    marginTop: 4,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13.5,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalScroll: {
    gap: 16,
    paddingBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.5,
  },
});