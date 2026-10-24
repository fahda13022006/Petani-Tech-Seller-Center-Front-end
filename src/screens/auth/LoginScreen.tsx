import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mail,
  Lock,
  Store,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/common/Button';
import { assets } from '@/assets';


export function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Tab State: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form Fields - Login
  const [identifier, setIdentifier] = useState('fahda@petanitech.id');
  const [password, setPassword] = useState('123456');

  // Form Fields - Register
  const [regName, setRegName] = useState('Fahda Febriya');
  const [regStoreName, setRegStoreName] = useState('Toko Tani Makmur Fahda');
  const [regPhone, setRegPhone] = useState('0812-3456-7890');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('Indramayu, Jawa Barat');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Alert.alert('Data Belum Lengkap', 'Masukkan email atau nomor HP serta kata sandi toko Anda.');
      return;
    }
    try {
      await login(identifier.trim(), password);
    } catch (error) {
      Alert.alert(
        'Gagal Masuk',
        error instanceof Error ? error.message : 'Silakan periksa kembali data login Anda.'
      );
    }
  };

  const handleRegister = async () => {
    if (!regName.trim() || !regStoreName.trim() || !regPhone.trim() || !regEmail.trim()) {
      Alert.alert('Data Belum Lengkap', 'Mohon lengkapi seluruh informasi pendaftaran seller.');
      return;
    }
    try {
      await register({
        name: regName.trim(),
        storeName: regStoreName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        storeAddress: regAddress.trim(),
        password: regPassword || '123456',
      });
      Alert.alert('Pendaftaran Berhasil', 'Selamat datang di Petani Tech Seller Center!');
    } catch (error) {
      Alert.alert(
        'Gagal Mendaftar',
        error instanceof Error ? error.message : 'Terjadi kendala saat mendaftarkan akun.'
      );
    }
  };

  const fillDemoAccount = () => {
    setIdentifier('fahda@petanitech.id');
    setPassword('123456');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Gradient Elegant */}
          <LinearGradient
            colors={['#F0FDF4', '#FFFFFF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.headerHero}
          >
            {/* Logo Petani Tech */}
            <View style={styles.logoWrapper}>
              <Image source={assets.logo} style={styles.logoImage} resizeMode="contain" />
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.greenPill}>
                <Sparkles size={13} color="#15803D" />
                <Text style={styles.greenPillText}>SELLER CENTER RESMI</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>Petani Tech Seller</Text>
            <Text style={styles.heroSubtitle}>
              Solusi digital terlengkap untuk mitra petani, toko sarana produksi, dan distributor hasil bumi.
            </Text>
          </LinearGradient>

          {/* Card Form */}
          <View style={styles.cardContainer}>
            {/* Segmented Tab Switcher */}
            <View style={styles.tabSwitcher}>
              <TouchableOpacity
                onPress={() => setActiveTab('login')}
                style={[styles.tabButton, activeTab === 'login' && styles.tabButtonActive]}
                activeOpacity={0.8}
              >
                {activeTab === 'login' ? (
                  <LinearGradient
                    colors={['#32CD32', '#22C55E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.tabGradientActive}
                  >
                    <Text style={styles.tabTextActive}>Masuk Akun</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.tabTextInactive}>Masuk Akun</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('register')}
                style={[styles.tabButton, activeTab === 'register' && styles.tabButtonActive]}
                activeOpacity={0.8}
              >
                {activeTab === 'register' ? (
                  <LinearGradient
                    colors={['#32CD32', '#22C55E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.tabGradientActive}
                  >
                    <Text style={styles.tabTextActive}>Buka Toko Baru</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.tabTextInactive}>Buka Toko Baru</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* TAB LOGIN */}
            {activeTab === 'login' ? (
              <View style={styles.formGroup}>
                <Input
                  label="Email atau Nomor WhatsApp / HP"
                  placeholder="Contoh: fahda@petanitech.id"
                  value={identifier}
                  onChangeText={setIdentifier}
                  leftIcon={<Mail size={18} color="#94A3B8" />}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />

                <Input
                  label="Kata Sandi Toko"
                  placeholder="Masukkan kata sandi akun"
                  value={password}
                  onChangeText={setPassword}
                  leftIcon={<Lock size={18} color="#94A3B8" />}
                  secureTextEntry
                  type="password"
                  returnKeyType="done"
                  onSubmitEditing={() => void handleLogin()}
                />

                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  onPress={() => void handleLogin()}
                  style={styles.submitBtn}
                >
                  Masuk ke Seller Center
                </Button>

                {/* Demo Helper Button */}
                <TouchableOpacity
                  onPress={fillDemoAccount}
                  style={styles.demoBox}
                  activeOpacity={0.7}
                >
                  <View style={styles.demoLeft}>
                    <CheckCircle2 size={16} color="#32CD32" />
                    <View>
                      <Text style={styles.demoTitle}>Akun Demo: Fahda Febriya</Text>
                      <Text style={styles.demoSub}>fahda@petanitech.id · sandi: 123456</Text>
                    </View>
                  </View>
                  <Text style={styles.demoAction}>Terapkan</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* TAB REGISTER */
              <View style={styles.formGroup}>
                <Input
                  label="Nama Pemilik Toko"
                  placeholder="Contoh: Fahda Febriya"
                  value={regName}
                  onChangeText={setRegName}
                  leftIcon={<User size={18} color="#94A3B8" />}
                  required
                />

                <Input
                  label="Nama Toko Pertanian"
                  placeholder="Contoh: Toko Tani Makmur Fahda"
                  value={regStoreName}
                  onChangeText={setRegStoreName}
                  leftIcon={<Store size={18} color="#94A3B8" />}
                  required
                />

                <Input
                  label="Nomor Telepon / WhatsApp"
                  placeholder="0812-3456-7890"
                  value={regPhone}
                  onChangeText={setRegPhone}
                  leftIcon={<Phone size={18} color="#94A3B8" />}
                  keyboardType="phone-pad"
                  required
                />

                <Input
                  label="Alamat Email Resmi"
                  placeholder="seller@petanitech.id"
                  value={regEmail}
                  onChangeText={setRegEmail}
                  leftIcon={<Mail size={18} color="#94A3B8" />}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  required
                />

                <Input
                  label="Kota / Lokasi Gudang"
                  placeholder="Indramayu, Jawa Barat"
                  value={regAddress}
                  onChangeText={setRegAddress}
                  leftIcon={<MapPin size={18} color="#94A3B8" />}
                  hint="Contoh: Indramayu, Jawa Barat"
                  required
                />

                <Input
                  label="Buat Kata Sandi"
                  placeholder="Minimal 6 karakter"
                  value={regPassword}
                  onChangeText={setRegPassword}
                  leftIcon={<Lock size={18} color="#94A3B8" />}
                  secureTextEntry
                  type="password"
                />

                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  onPress={() => void handleRegister()}
                  style={styles.submitBtn}
                >
                  Daftarkan Toko Saya Sekarang
                </Button>
              </View>
            )}

            {/* Footer Trust Indicator */}
            <View style={styles.trustFooter}>
              <ShieldCheck size={16} color="#15803D" />
              <Text style={styles.trustText}>
                Data transaksi terlindungi dengan enkripsi perbankan digital.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 36,
  },
  headerHero: {
    paddingTop: 18,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0FDF4',
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#32CD32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
  },
  logoImage: {
    width: 72,
    height: 72,
  },
  badgeRow: {
    marginBottom: 8,
  },
  greenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  greenPillText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 340,
  },
  cardContainer: {
    marginHorizontal: 20,
    marginTop: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'transparent',
  },
  tabGradientActive: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#32CD32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  tabTextInactive: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  formGroup: {
    gap: 16,
  },
  submitBtn: {
    marginTop: 6,
  },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  demoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  demoSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 1,
  },
  demoAction: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
    paddingLeft: 8,
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  trustText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
});
