import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  UserRound,
  Wallet,
} from 'lucide-react-native';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { ProductsScreen } from '@/screens/ProductsScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { InventoryScreen } from '@/screens/InventoryScreen';
import { FinanceScreen } from '@/screens/FinanceScreen';
import { PromotionsScreen } from '@/screens/PromotionsScreen';
import { AnalyticsScreen } from '@/screens/AnalyticsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { MainTabParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const hiddenTab = { tabBarButton: () => null };

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#34764A',
        tabBarInactiveTintColor: '#818981',
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: '#E8ECE7',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Beranda', tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ tabBarLabel: 'Produk', tabBarIcon: ({ color, size }) => <Package color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ tabBarLabel: 'Pesanan', tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{ tabBarLabel: 'Keuangan', tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil', tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} /> }}
      />
      <Tab.Screen name="Inventory" component={InventoryScreen} options={hiddenTab} />
      <Tab.Screen name="Promotions" component={PromotionsScreen} options={hiddenTab} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={hiddenTab} />
    </Tab.Navigator>
  );
}