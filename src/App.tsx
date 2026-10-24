import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useAuthStore } from '@/store/useAuthStore';
import { ToastContainer } from '@/components/common/ToastContainer';
import { colors } from '@/theme/colors';

export default function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Memuat Petani Tech Seller Center...</Text>
        </View>
      ) : error && !user ? (
        <View style={styles.loading}>
          <Text style={styles.errorTitle}>Tidak dapat memuat sesi</Text>
          <Text style={styles.loadingText}>{error}</Text>
          <Text style={styles.retry} onPress={() => void initAuth()}>
            Coba lagi
          </Text>
        </View>
      ) : (
        <>
          <AppNavigator />
          <ToastContainer />
        </>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  loadingText: { color: '#64748B', textAlign: 'center', fontSize: 13, fontWeight: '500' },
  errorTitle: { color: '#0F172A', fontSize: 18, fontWeight: '800' },
  retry: { color: '#32CD32', fontWeight: '800', padding: 12, fontSize: 14 },
});

