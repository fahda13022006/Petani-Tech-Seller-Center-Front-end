import { useState } from 'react';
import { KeyRound, Sprout } from 'lucide-react-native';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';

export function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [identifier, setIdentifier] = useState('seller@petanitech.id');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Alert.alert('Data belum lengkap', 'Masukkan email atau nomor telepon dan kata sandi.');
      return;
    }
    try {
      await login(identifier, password);
    } catch (error) {
      Alert.alert('Gagal masuk', error instanceof Error ? error.message : 'Silakan periksa data login Anda.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.brandIcon}><Sprout color="#FFFFFF" size={30} /></View>
          <Text style={styles.brand}>Petani Tech</Text>
          <Text style={styles.title}>Seller Center</Text>
          <Text style={styles.subtitle}>Kelola toko pertanian Anda di mana saja.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email atau nomor HP</Text>
            <TextInput
              accessibilityLabel="Email atau nomor HP"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setIdentifier}
              placeholder="seller@petanitech.id"
              value={identifier}
              style={styles.input}
              returnKeyType="next"
            />
            <Text style={styles.label}>Kata sandi</Text>
            <View style={styles.passwordRow}>
              <KeyRound color="#748077" size={17} />
              <TextInput
                accessibilityLabel="Kata sandi"
                onChangeText={setPassword}
                placeholder="Masukkan kata sandi"
                secureTextEntry
                value={password}
                style={styles.passwordInput}
                returnKeyType="done"
                onSubmitEditing={() => void handleLogin()}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              onPress={() => void handleLogin()}
              style={({ pressed }) => [styles.button, pressed && styles.pressed, isLoading && styles.disabled]}
            >
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Masuk ke toko</Text>}
            </Pressable>
          </View>
          <Text style={styles.hint}>Akun demo: seller@petanitech.id · kata sandi: 123456</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: 'center' },
  safeArea: { flex: 1, backgroundColor: '#F6F8F4' },
  container: { padding: 24, alignItems: 'center', gap: 8 },
  brandIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#34764A', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  brand: { color: '#34764A', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  title: { color: '#213329', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#68746B', fontSize: 13, textAlign: 'center', marginBottom: 20 },
  form: { alignSelf: 'stretch', padding: 18, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECE7', gap: 10 },
  label: { color: '#35453A', fontSize: 12, fontWeight: '700', marginTop: 4 },
  input: { height: 48, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E0E6DF', borderRadius: 12, color: '#213329' },
  passwordRow: { minHeight: 48, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E0E6DF', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  passwordInput: { flex: 1, color: '#213329', paddingVertical: 10 },
  button: { height: 48, borderRadius: 12, backgroundColor: '#34764A', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.65 },
  hint: { marginTop: 12, color: '#68746B', fontSize: 11, textAlign: 'center' },
});