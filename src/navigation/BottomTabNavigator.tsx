import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  UserRound,
  Wallet,
} from 'lucide-react-native';
import { DashboardScreen } from '@/screens/dashboard';
import { ProductsScreen } from '@/screens/products';
import { OrdersScreen } from '@/screens/orders';
import { InventoryScreen, PromotionsScreen } from '@/screens/store';
import { FinanceScreen, AnalyticsScreen } from '@/screens/reports';
import { ProfileScreen } from '@/screens/profile';
import { MainTabParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { useOrderStore } from '@/store/useOrderStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

const hiddenTabOption = {
  tabBarButton: () => null,
  tabBarItemStyle: { display: 'none' as const },
};

export function BottomTabNavigator() {
  const orders = useOrderStore((state) => state.orders);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Diproses').length;

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: '#64748B',
        tabBarBackground: () => (
          <LinearGradient
            colors={['#FFFFFF', '#F8FAF8']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          elevation: 10,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: -2,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <LayoutDashboard
                color={focused ? colors.primary.DEFAULT : color}
                size={focused ? size + 1 : size}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Produk',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Package
                color={focused ? colors.primary.DEFAULT : color}
                size={focused ? size + 1 : size}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Pesanan',
          tabBarBadge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '800',
            lineHeight: 14,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <ShoppingBag
                color={focused ? colors.primary.DEFAULT : color}
                size={focused ? size + 1 : size}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          tabBarLabel: 'Keuangan',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Wallet
                color={focused ? colors.primary.DEFAULT : color}
                size={focused ? size + 1 : size}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil Toko',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <UserRound
                color={focused ? colors.primary.DEFAULT : color}
                size={focused ? size + 1 : size}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* Rute Sekunder Toko & Laporan (Diakses via Quick Menu Dashboard) */}
      <Tab.Screen name="Inventory" component={InventoryScreen} options={hiddenTabOption} />
      <Tab.Screen name="Promotions" component={PromotionsScreen} options={hiddenTabOption} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={hiddenTabOption} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#F0FDF4',
  },
});