import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface PageMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface PageRecord {
  title: string;
  detail: string;
  value?: string;
  status?: string;
}

interface NativePageProps {
  title: string;
  subtitle: string;
  metrics?: PageMetric[];
  records?: PageRecord[];
  children?: ReactNode;
}

export function NativePage({ title, subtitle, metrics = [], records = [], children }: NativePageProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>PETANI TECH SELLER</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {metrics.length > 0 && (
          <View style={styles.metrics}>
            {metrics.map((metric) => (
              <View key={metric.label} style={styles.metric}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                {metric.detail ? <Text style={styles.metricDetail}>{metric.detail}</Text> : null}
              </View>
            ))}
          </View>
        )}
        {children}
        {records.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ringkasan</Text>
            {records.map((record, index) => (
              <View key={`${record.title}-${index}`} style={styles.record}>
                <View style={styles.recordText}>
                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <Text style={styles.recordDetail}>{record.detail}</Text>
                  {record.status ? <Text style={styles.status}>{record.status}</Text> : null}
                </View>
                {record.value ? <Text style={styles.recordValue}>{record.value}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Surface({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export const pageColors = {
  green: '#34764A',
  dark: '#213329',
  muted: '#68746B',
  background: '#F6F8F4',
  border: '#E8ECE7',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: pageColors.background },
  content: { padding: 20, paddingBottom: 32, gap: 18 },
  heading: { gap: 5, marginBottom: 2 },
  eyebrow: { color: pageColors.green, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: pageColors.dark, fontSize: 26, fontWeight: '800' },
  subtitle: { color: pageColors.muted, fontSize: 13, lineHeight: 19 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metric: {
    flexGrow: 1,
    flexBasis: '45%',
    minHeight: 94,
    padding: 14,
    borderRadius: 16,
    backgroundColor: pageColors.white,
    borderWidth: 1,
    borderColor: pageColors.border,
    justifyContent: 'center',
    gap: 4,
  },
  metricLabel: { color: pageColors.muted, fontSize: 11, fontWeight: '600' },
  metricValue: { color: pageColors.dark, fontSize: 19, fontWeight: '800' },
  metricDetail: { color: pageColors.green, fontSize: 10, fontWeight: '600' },
  section: { gap: 10 },
  sectionTitle: { color: pageColors.dark, fontSize: 16, fontWeight: '800', marginBottom: 2 },
  surface: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: pageColors.white,
    borderWidth: 1,
    borderColor: pageColors.border,
    gap: 10,
  },
  record: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: pageColors.white,
    borderWidth: 1,
    borderColor: pageColors.border,
  },
  recordText: { flex: 1, gap: 4 },
  recordTitle: { color: pageColors.dark, fontSize: 13, fontWeight: '700' },
  recordDetail: { color: pageColors.muted, fontSize: 11, lineHeight: 16 },
  recordValue: { color: pageColors.green, fontSize: 13, fontWeight: '800' },
  status: { color: pageColors.green, fontSize: 10, fontWeight: '700' },
});
