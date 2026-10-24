import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useAuthStore } from '@/store/useAuthStore';
import { ToastContainer } from '@/components/common/ToastContainer';

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
          <ActivityIndicator size="large" color="#34764A" />
          <Text style={styles.loadingText}>Memuat Petani Tech Seller...</Text>
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
    backgroundColor: '#F6F8F4',
    padding: 24,
  },
  loadingText: { color: '#647067', textAlign: 'center' },
  errorTitle: { color: '#24342A', fontSize: 18, fontWeight: '700' },
  retry: { color: '#34764A', fontWeight: '700', padding: 12 },
});
