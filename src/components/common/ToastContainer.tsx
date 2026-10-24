import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useToastStore } from '@/store/useToastStore';
import { Toast, ToastVariant } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react-native';

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: (color: string) => React.ReactNode;
    color: string;
    bgColor: string;
  }
> = {
  success: {
    icon: (color) => <CheckCircle2 size={18} color={color} />,
    color: '#4C9B52',
    bgColor: '#EAF6EB',
  },
  error: {
    icon: (color) => <XCircle size={18} color={color} />,
    color: '#D95757',
    bgColor: '#FDF0F0',
  },
  warning: {
    icon: (color) => <AlertTriangle size={18} color={color} />,
    color: '#E9A23B',
    bgColor: '#FFF8E7',
  },
  info: {
    icon: (color) => <Info size={18} color={color} />,
    color: '#4C89C6',
    bgColor: '#EDF5FD',
  },
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const config = VARIANT_CONFIG[toast.variant];

  return (
    <View style={[styles.toastItem, { borderLeftColor: config.color }]}>
      <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
        {config.icon(config.color)}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.toastTitle}>{toast.title}</Text>
        {toast.message ? <Text style={styles.toastMessage}>{toast.message}</Text> : null}
      </View>

      <TouchableOpacity
        onPress={() => removeToast(toast.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.closeBtn}
      >
        <X size={16} color="#8E8E8E" />
      </TouchableOpacity>
    </View>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderLeftWidth: 4,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#213329',
  },
  toastMessage: {
    fontSize: 11,
    color: '#68746B',
  },
  closeBtn: {
    padding: 4,
  },
});
