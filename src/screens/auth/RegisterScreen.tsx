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
import { useNavigation } from '@react-navigation/native';
import {
  Mail,
  Lock,
  Store,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/common/Button';
import { assets } from '@/assets';

export function RegisterScreen() {
  const navigation = useNavigation<any>();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [name, setName] = useState('Fahda Febriya');
  const [storeName, setStoreName] = useState('Toko Tani Makmur Fahda');
  const [phone, setPhone] = useState('0812-3456-7890');
  const [email, setEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('Indramayu, Jawa Barat');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !storeName.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Data Belum Lengkap', 'Mohon lengkapi seluruh formulir registrasi toko.');
      return;
    }
    try {
      await register({
        name: name.trim(),
        storeName: storeName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        storeAddress: storeAddress.trim(),
        password: password || '123456',
      });
      Alert.alert('Sukses', 'Toko Anda berhasil terdaftar!');
    } catch (err: unknown) {
      Alert.alert('Gagal', err instanceof Error ? err.message : 'Gagal mendaftar');
    }
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
          {/* Header */}
          <LinearGradient
            colors={['#F0FDF4', '#FFFFFF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <ChevronLeft size={22} color="#0F172A" />
            </TouchableOpacity>

            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Buka Toko Pertanian</Text>
            <Text style={styles.subtitle}>
              Gabung bersama ribuan distributor dan toko tani modern di Petani Tech
            </Text>
          </LinearGradient>

          {/* Form */}
          <View style={styles.card}>
            <View style={styles.form}>
              <Input
                label="Nama Pemilik Toko"
                placeholder="Contoh: Fahda Febriya"
                value={name}
                onChangeText={setName}
                leftIcon={<User size={18} color="#94A3B8" />}
                required
              />

              <Input
                label="Nama Toko"
                placeholder="Contoh: Toko Tani Makmur Fahda"
                value={storeName}
                onChangeText={setStoreName}
                leftIcon={<Store size={18} color="#94A3B8" />}
                required
              />

              <Input
                label="Nomor WhatsApp Aktif"
                placeholder="0812-3456-7890"
                value={phone}
                onChangeText={setPhone}
                leftIcon={<Phone size={18} color="#94A3B8" />}
                keyboardType="phone-pad"
                required
              />

              <Input
                label="Email Toko"
                placeholder="seller@petanitech.id"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Mail size={18} color="#94A3B8" />}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />

              <Input
                label="Alamat / Kota Asal Pengiriman"
                placeholder="Indramayu, Jawa Barat"
                value={storeAddress}
                onChangeText={setStoreAddress}
                leftIcon={<MapPin size={18} color="#94A3B8" />}
                required
              />

              <Input
                label="Kata Sandi"
                placeholder="Minimal 6 karakter"
                value={password}
                onChangeText={setPassword}
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
                Mulai Berjualan Sekarang
              </Button>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Sudah punya akun seller?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}> Masuk di sini</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.trustFooter}>
              <ShieldCheck size={16} color="#15803D" />
              <Text style={styles.trustText}>
                Verifikasi cepat dalam waktu 1x24 jam oleh tim Petani Tech.
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
    paddingBottom: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    marginHorizontal: 20,
    marginTop: -6,
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
  form: {
    gap: 16,
  },
  submitBtn: {
    marginTop: 8,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 13,
    color: '#64748B',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#32CD32',
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
