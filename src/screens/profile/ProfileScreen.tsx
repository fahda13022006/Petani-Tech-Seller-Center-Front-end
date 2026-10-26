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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/forms/Input';
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/ThemeContext';
import { useBottomTabSpace } from '@/navigation/hooks';
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
  Palette,
  ShieldCheck,
  Bell,
  Power,
  Calendar,
  Star,
} from 'lucide-react-native';

export function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore();
  const { colors: themeColors, isDark } = useTheme();
  const bottomSpace = useBottomTabSpace(24);

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
        if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
          await updateProfile({ avatar: result.assets[0].uri });
          Alert.alert('Foto Profil Diperbarui', 'Foto profil toko Anda berhasil diperbarui.');
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
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
          await updateProfile({ avatar: result.assets[0].uri });
          Alert.alert('Foto Profil Diperbarui', 'Foto profil toko berhasil dipilih dari perangkat.');
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
      'Pilih sumber gambar dari perangkat Anda:',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Pilih dari Galeri Perangkat',
          onPress: () => void pickImage(false),
        },
        {
          text: 'Ambil Foto dengan Kamera',
          onPress: () => void pickImage(true),
        },
      ]
    );
  };

  const handleStoreOpenToggle = (val: boolean) => {
    if (!val) {
      Alert.alert(
        'Tutup Toko Sementara?',
        'Saat toko ditutup, pembeli tidak dapat membuat pesanan baru hingga Anda mengaktifkannya kembali.',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Tutup Toko',
            style: 'destructive',
            onPress: () => setStoreIsOpen(false),
          },
        ]
      );
    } else {
      setStoreIsOpen(true);
    }
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

  const handleOpenEditModal = () => {
    setName(user?.name || 'Fahda Febriya');
    setStoreName(user?.storeName || 'Toko Tani Makmur Fahda');
    setEmail(user?.email || 'fahda@petanitech.id');
    setPhone(user?.phone || '0812-3456-7890');
    setStoreAddress(
      user?.storeAddress ||
        'Jl. Raya Indramayu - Cirebon No. 88, Kec. Jatibarang, Kab. Indramayu, Jawa Barat 45214'
    );
    setIsEditModalOpen(true);
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

  // Mask bank account number safely preserving real digits
  const maskedAccountNumber = React.useMemo(() => {
    const raw = user?.bankAccount?.accountNumber?.trim();
    if (!raw) return '4321-01-••••••-53-2';
    const parts = raw.split('-');
    if (parts.length >= 3) {
      return `${parts[0]}-${parts[1]}-••••••-${parts[parts.length - 1]}`;
    }
    if (raw.length > 6) {
      return `${raw.slice(0, 4)} •••• ${raw.slice(-4)}`;
    }
    return raw;
  }, [user?.bankAccount?.accountNumber]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
      edges={['top']}
    >
      {/* Ambient Glow */}
      <View
        style={[
          styles.ambientGlow,
          {
            borderColor: isDark ? 'rgba(209, 245, 232, 0.12)' : 'rgba(64, 145, 108, 0.08)',
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={
            isDark
              ? ['rgba(209, 245, 232, 0.16)', 'rgba(64, 145, 108, 0.04)', 'transparent']
              : ['rgba(209, 245, 232, 0.45)', 'rgba(255, 255, 255, 0.15)', 'transparent']
          }
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Screen Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? 'rgba(22, 58, 38, 0.85)' : '#FFFFFF',
            borderBottomColor: isDark ? 'rgba(209, 245, 232, 0.14)' : '#DDE8E0',
          },
        ]}
      >
        <View
          style={[
            styles.sheenLine,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.18)'
                : 'rgba(255, 255, 255, 0.95)',
            },
          ]}
        />
        <View style={styles.titleCol}>
          <View style={styles.eyebrowRow}>
            <View
              style={[
                styles.eyebrowDot,
                { backgroundColor: isDark ? themeColors.mint : themeColors.primary },
              ]}
            />
            <Text
              style={[
                styles.eyebrow,
                { color: isDark ? themeColors.mint : themeColors.primary },
              ]}
            >
              PROFIL & PENGATURAN TOKO
            </Text>
          </View>
          <Text style={[styles.screenTitle, { color: themeColors.textPrimary }]}>
            Profil Seller
          </Text>
          <Text style={[styles.screenSubtitle, { color: themeColors.textSecondary }]}>
            Identitas toko, alamat gudang, rekening pencairan, & sistem
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomSpace }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. MAIN SELLER IDENTITY CARD */}
        <Card
          style={[
            styles.identityCard,
            {
              backgroundColor: isDark ? 'rgba(22, 58, 38, 0.75)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(209, 245, 232, 0.18)' : '#E6EDE7',
            },
          ]}
        >
          {/* Header Row: Avatar + Main Details */}
          <View style={styles.identityHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                }}
                style={[
                  styles.avatar,
                  {
                    borderColor: isDark ? themeColors.mint : themeColors.primary,
                  },
                ]}
              />
              <TouchableOpacity
                onPress={handleAvatarPress}
                style={[
                  styles.cameraBtn,
                  {
                    backgroundColor: isDark ? '#183D2A' : themeColors.primary,
                    borderColor: isDark ? themeColors.mint : '#FFFFFF',
                  },
                ]}
                activeOpacity={0.8}
                accessibilityLabel="Ganti foto profil toko"
              >
                <Camera size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.identityDetails}>
              <Text
                style={[styles.storeNameText, { color: themeColors.textPrimary }]}
                numberOfLines={1}
              >
                {user?.storeName || 'Toko Tani Makmur Fahda'}
              </Text>

              <View style={styles.badgeLine}>
                <Badge variant="brand" size="sm" dot>
                  {user?.status || 'Seller Terverifikasi'}
                </Badge>
                <Text style={[styles.storeIdText, { color: themeColors.textMuted }]}>
                  ID: {user?.storeId || 'ID-AGRO-INDRAMAYU-01'}
                </Text>
              </View>

              <Text style={[styles.ownerText, { color: themeColors.textSecondary }]}>
                Pemilik:{' '}
                <Text style={[styles.ownerNameText, { color: themeColors.textPrimary }]}>
                  {user?.name || 'Fahda Febriya'}
                </Text>
              </Text>
            </View>
          </View>

          {/* Metadata & Rating Row */}
          <View
            style={[
              styles.metaPillsRow,
              {
                backgroundColor: isDark ? 'rgba(11, 32, 20, 0.65)' : '#FAF9F6',
                borderColor: isDark ? 'rgba(209, 245, 232, 0.12)' : '#EDF2EE',
              },
            ]}
          >
            <View style={styles.metaPill}>
              <Star size={13} color="#D97706" fill="#D97706" />
              <Text style={[styles.metaPillText, { color: themeColors.textPrimary }]}>
                {user?.rating || 4.95} ({user?.totalReview || 1280} Ulasan)
              </Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaPill}>
              <MapPin size={13} color={isDark ? themeColors.mint : themeColors.primary} />
              <Text style={[styles.metaPillText, { color: themeColors.textSecondary }]}>
                Indramayu, Jabar
              </Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaPill}>
              <Calendar size={13} color={themeColors.textMuted} />
              <Text style={[styles.metaPillText, { color: themeColors.textMuted }]}>
                Mitra {user?.joinedDate || 'Jan 2024'}
              </Text>
            </View>
          </View>

          {/* Action Button: Edit Store Info */}
          <Button
            variant="outline"
            size="md"
            leftIcon={<Edit3 size={15} color={isDark ? themeColors.mint : themeColors.primaryDark} />}
            onPress={handleOpenEditModal}
            style={styles.editProfileBtn}
          >
            Ubah Informasi Toko & Kontak
          </Button>
        </Card>

        {/* 2. CONTACT & WAREHOUSE INFORMATION */}
        <Card
          style={[
            styles.sectionCard,
            {
              backgroundColor: isDark ? 'rgba(22, 58, 38, 0.70)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(209, 245, 232, 0.18)' : '#E6EDE7',
            },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <User size={15} color={isDark ? themeColors.mint : themeColors.primary} />
            <Text style={[styles.sectionHeading, { color: themeColors.textSecondary }]}>
              INFORMASI KONTAK & GUDANG
            </Text>
          </View>

          {/* Row 1: Owner Name */}
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIconBox,
                {
                  backgroundColor: isDark ? 'rgba(64, 145, 108, 0.22)' : '#EAF4EE',
                },
              ]}
            >
              <User size={17} color={isDark ? themeColors.mint : themeColors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={[styles.infoLabel, { color: themeColors.textMuted }]}>
                Nama Pemilik Usaha
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>
                {user?.name || 'Fahda Febriya'}
              </Text>
            </View>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: isDark ? 'rgba(209, 245, 232, 0.10)' : '#F0F5F1' }]} />

          {/* Row 2: Official Email */}
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIconBox,
                {
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.22)' : '#EFF6FF',
                },
              ]}
            >
              <Mail size={17} color="#3B82F6" />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={[styles.infoLabel, { color: themeColors.textMuted }]}>
                Email Resmi Toko
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>
                {user?.email || 'fahda@petanitech.id'}
              </Text>
            </View>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: isDark ? 'rgba(209, 245, 232, 0.10)' : '#F0F5F1' }]} />

          {/* Row 3: WhatsApp / Phone */}
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIconBox,
                {
                  backgroundColor: isDark ? 'rgba(64, 145, 108, 0.22)' : '#EAF4EE',
                },
              ]}
            >
              <Phone size={17} color={isDark ? themeColors.mint : themeColors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={[styles.infoLabel, { color: themeColors.textMuted }]}>
                Nomor WhatsApp / Kontak Toko
              </Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>
                {user?.phone || '0812-3456-7890'}
              </Text>
            </View>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: isDark ? 'rgba(209, 245, 232, 0.10)' : '#F0F5F1' }]} />

          {/* Row 4: Shipping Origin Address */}
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIconBox,
                {
                  backgroundColor: isDark ? 'rgba(245, 158, 11, 0.22)' : '#FFFBEB',
                },
              ]}
            >
              <MapPin size={17} color="#F59E0B" />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={[styles.infoLabel, { color: themeColors.textMuted }]}>
                Alamat Gudang Asal Pengiriman
              </Text>
              <Text style={[styles.infoValueAddress, { color: themeColors.textPrimary }]}>
                {user?.storeAddress ||
                  'Jl. Raya Indramayu - Cirebon No. 88, Kec. Jatibarang, Kab. Indramayu, Jawa Barat 45214'}
              </Text>
            </View>
          </View>
        </Card>

        {/* 3. PAYOUT ACCOUNT (Aligned with Finance Screen) */}
        <Card
          style={[
            styles.sectionCard,
            {
              backgroundColor: isDark ? 'rgba(22, 58, 38, 0.70)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(209, 245, 232, 0.18)' : '#E6EDE7',
            },
          ]}
        >
          {/* Header Row */}
          <View style={styles.payoutHeaderRow}>
            <View style={styles.payoutTitleWrap}>
              <View
                style={[
                  styles.payoutIconCircle,
                  {
                    backgroundColor: isDark ? 'rgba(64, 145, 108, 0.22)' : '#EAF4EE',
                  },
                ]}
              >
                <Building2 size={17} color={isDark ? themeColors.mint : themeColors.primary} />
              </View>
              <View style={styles.payoutTitleCol}>
                <Text style={[styles.payoutHeaderTitle, { color: themeColors.textPrimary }]}>
                  Rekening Pencairan Terdaftar
                </Text>
                <Text style={[styles.payoutHeaderSub, { color: themeColors.textMuted }]}>
                  Pencairan instan tanpa biaya admin
                </Text>
              </View>
            </View>

            <Badge variant="brand" size="sm" dot>
              Terverifikasi
            </Badge>
          </View>

          {/* Account Details Box */}
          <View
            style={[
              styles.payoutDetailBox,
              {
                backgroundColor: isDark ? 'rgba(11, 32, 20, 0.65)' : '#FAF9F6',
                borderColor: isDark ? 'rgba(209, 245, 232, 0.12)' : '#EDF2EE',
              },
            ]}
          >
            <View style={styles.payoutBankRow}>
              <Text style={[styles.payoutBankName, { color: themeColors.textPrimary }]}>
                {user?.bankAccount?.bankName || 'Bank Rakyat Indonesia (BRI)'}
              </Text>
              <Text style={[styles.payoutAccountNumber, { color: themeColors.textSecondary }]}>
                {maskedAccountNumber}
              </Text>
            </View>

            <View style={styles.payoutHolderRow}>
              <Text style={[styles.payoutHolderLabel, { color: themeColors.textMuted }]}>
                Atas Nama:
              </Text>
              <Text style={[styles.payoutHolderName, { color: themeColors.textPrimary }]}>
                {user?.bankAccount?.accountHolder || user?.name || 'Mitra Petani Terdaftar'}
              </Text>
            </View>
          </View>

          {/* Security Guarantee Note */}
          <View style={styles.payoutSecurityRow}>
            <ShieldCheck size={13} color={isDark ? themeColors.mint : '#40916C'} />
            <Text style={[styles.payoutSecurityText, { color: themeColors.textMuted }]}>
              Dilindungi verifikasi biometrik & notifikasi mutasi otomatis
            </Text>
          </View>
        </Card>

        {/* 4. THEME & DISPLAY PREFERENCES */}
        <Card
          style={[
            styles.sectionCard,
            {
              backgroundColor: isDark ? 'rgba(22, 58, 38, 0.70)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(209, 245, 232, 0.18)' : '#E6EDE7',
            },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Palette size={15} color={isDark ? themeColors.mint : themeColors.primary} />
            <Text style={[styles.sectionHeading, { color: themeColors.textSecondary }]}>
              PENGATURAN TEMA & TAMPILAN
            </Text>
          </View>

          <ThemeSelector />
        </Card>

        {/* 5. OPERATIONAL SETTINGS */}
        <Card
          style={[
            styles.sectionCard,
            {
              backgroundColor: isDark ? 'rgba(22, 58, 38, 0.70)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(209, 245, 232, 0.18)' : '#E6EDE7',
            },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Power size={15} color={isDark ? themeColors.mint : themeColors.primary} />
            <Text style={[styles.sectionHeading, { color: themeColors.textSecondary }]}>
              PENGATURAN OPERASIONAL TOKO
            </Text>
          </View>

          {/* Switch 1: Store Open / Accepting Orders */}
          <View style={styles.switchRow}>
            <View
              style={[
                styles.switchIconBox,
                {
                  backgroundColor: storeIsOpen
                    ? isDark
                      ? 'rgba(64, 145, 108, 0.22)'
                      : '#EAF4EE'
                    : isDark
                    ? 'rgba(239, 68, 68, 0.15)'
                    : '#FEF2F2',
                },
              ]}
            >
              <Store
                size={17}
                color={
                  storeIsOpen
                    ? isDark
                      ? themeColors.mint
                      : themeColors.primary
                    : '#EF4444'
                }
              />
            </View>
            <View style={styles.switchTextCol}>
              <Text style={[styles.switchTitle, { color: themeColors.textPrimary }]}>
                Status Toko Buka Menerima Pesanan
              </Text>
              <Text style={[styles.switchSub, { color: themeColors.textMuted }]}>
                {storeIsOpen
                  ? 'Toko aktif menerima pesanan dari pembeli.'
                  : 'Toko libur sementara. Pembeli tidak dapat memesan.'}
              </Text>
            </View>
            <Switch
              value={storeIsOpen}
              onValueChange={handleStoreOpenToggle}
              trackColor={{
                false: isDark ? '#334155' : '#CBD5E1',
                true: isDark ? '#2D6A4F' : '#A7C8A9',
              }}
              thumbColor={storeIsOpen ? (isDark ? themeColors.mint : themeColors.primary) : '#F1F5F9'}
            />
          </View>

          <View style={[styles.rowDivider, { backgroundColor: isDark ? 'rgba(209, 245, 232, 0.10)' : '#F0F5F1' }]} />

          {/* Switch 2: Order & Chat Notifications */}
          <View style={styles.switchRow}>
            <View
              style={[
                styles.switchIconBox,
                {
                  backgroundColor: notificationsEnabled
                    ? isDark
                      ? 'rgba(64, 145, 108, 0.22)'
                      : '#EAF4EE'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : '#F1F5F9',
                },
              ]}
            >
              <Bell
                size={17}
                color={
                  notificationsEnabled
                    ? isDark
                      ? themeColors.mint
                      : themeColors.primary
                    : themeColors.textMuted
                }
              />
            </View>
            <View style={styles.switchTextCol}>
              <Text style={[styles.switchTitle, { color: themeColors.textPrimary }]}>
                Notifikasi Pesanan & Chat Baru
              </Text>
              <Text style={[styles.switchSub, { color: themeColors.textMuted }]}>
                Dapatkan notifikasi seketika saat pembeli memesan produk
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: isDark ? '#334155' : '#CBD5E1',
                true: isDark ? '#2D6A4F' : '#A7C8A9',
              }}
              thumbColor={notificationsEnabled ? (isDark ? themeColors.mint : themeColors.primary) : '#F1F5F9'}
            />
          </View>
        </Card>

        {/* 6. LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutBtn,
            {
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FFF1F2',
              borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : '#FECDD3',
            },
          ]}
          activeOpacity={0.8}
        >
          <LogOut size={17} color="#EF4444" />
          <Text style={styles.logoutText}>Keluar dari Akun Seller</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 7. MODAL EDIT INFORMASI TOKO */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => {
          if (!isSaving) setIsEditModalOpen(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#163A26' : '#FFFFFF',
                borderColor: isDark ? 'rgba(209, 245, 232, 0.22)' : '#DDE8E0',
              },
            ]}
          >
            {/* Modal Header */}
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: isDark ? 'rgba(209, 245, 232, 0.14)' : '#F0F5F1' },
              ]}
            >
              <View style={styles.modalTitleCol}>
                <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>
                  Ubah Informasi Toko
                </Text>
                <Text style={[styles.modalSubtitle, { color: themeColors.textSecondary }]}>
                  Perbarui identitas pemilik, toko, dan gudang pengiriman
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                disabled={isSaving}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={[
                  styles.modalCloseBtn,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.10)' : '#F2FBF5',
                  },
                ]}
              >
                <X size={18} color={themeColors.textSecondary} />
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
                leftIcon={<User size={18} color={isDark ? themeColors.mint : themeColors.textMuted} />}
                required
              />

              <Input
                label="Nama Toko"
                value={storeName}
                onChangeText={setStoreName}
                leftIcon={<Store size={18} color={isDark ? themeColors.mint : themeColors.textMuted} />}
                required
              />

              <Input
                label="Email Resmi"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Mail size={18} color={isDark ? themeColors.mint : themeColors.textMuted} />}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />

              <Input
                label="Nomor WhatsApp"
                value={phone}
                onChangeText={setPhone}
                leftIcon={<Phone size={18} color={isDark ? themeColors.mint : themeColors.textMuted} />}
                keyboardType="phone-pad"
                required
              />

              <Input
                label="Alamat Lengkap Gudang (Indramayu)"
                value={storeAddress}
                onChangeText={setStoreAddress}
                leftIcon={<MapPin size={18} color={isDark ? themeColors.mint : themeColors.textMuted} />}
                multiline
                required
              />

              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
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
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 260,
    height: 260,
    borderRadius: 130,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    position: 'relative',
  },
  sheenLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  titleCol: {
    gap: 3,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eyebrow: {
    fontSize: 10.5,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.8,
  },
  screenTitle: {
    fontSize: 21,
    fontFamily: typography.fontFamily.extrabold,
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 16,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // 1. Identity Card
  identityCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
  },
  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  identityDetails: {
    flex: 1,
    gap: 4,
  },
  storeNameText: {
    fontSize: 17,
    fontFamily: typography.fontFamily.extrabold,
    letterSpacing: -0.3,
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  storeIdText: {
    fontSize: 10.5,
    fontFamily: typography.fontFamily.medium,
  },
  ownerText: {
    fontSize: 11.5,
    fontFamily: typography.fontFamily.regular,
  },
  ownerNameText: {
    fontFamily: typography.fontFamily.bold,
  },
  metaPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaPillText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semibold,
  },
  metaDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  editProfileBtn: {
    marginTop: 2,
  },

  // Section Cards Generic
  sectionCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.6,
  },

  // 2. Contact & Warehouse
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextBox: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semibold,
  },
  infoValueAddress: {
    fontSize: 12.5,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 17,
  },
  rowDivider: {
    height: 1,
    marginVertical: 1,
  },

  // 3. Payout Account
  payoutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  payoutTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  payoutIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutTitleCol: {
    flex: 1,
    gap: 2,
  },
  payoutHeaderTitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.2,
  },
  payoutHeaderSub: {
    fontSize: 10.5,
    fontFamily: typography.fontFamily.regular,
  },
  payoutDetailBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  payoutBankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payoutBankName: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
  },
  payoutAccountNumber: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semibold,
    letterSpacing: 0.4,
  },
  payoutHolderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  payoutHolderLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
  },
  payoutHolderName: {
    fontSize: 11.5,
    fontFamily: typography.fontFamily.semibold,
  },
  payoutSecurityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  payoutSecurityText: {
    fontSize: 10.5,
    fontFamily: typography.fontFamily.regular,
    flex: 1,
  },

  // 5. Operational Switches
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 2,
  },
  switchIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTextCol: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontSize: 12.5,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.2,
  },
  switchSub: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 15,
  },

  // 6. Logout Button
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    marginTop: 4,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13.5,
    fontFamily: typography.fontFamily.bold,
  },

  // 7. Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  modalTitleCol: {
    flex: 1,
    gap: 2,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: typography.fontFamily.extrabold,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 11.5,
    fontFamily: typography.fontFamily.regular,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    gap: 14,
    paddingVertical: 14,
    paddingBottom: 28,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.6,
  },
});