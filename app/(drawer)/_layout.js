import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown: true,
        drawerIcon: ({ color, size }) => {
          const icons = {
            Inventory_list: 'cube-outline',
            Supplier_list: 'people-outline',
            Sales: 'cash-outline',
            logout: 'log-out-outline', 
          };
          
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="AdminDashboard" options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Inventory_list" options={{ title: 'Inventory' }} />
      <Drawer.Screen name="Sales" options={{ title: 'Sales' }} />
      <Drawer.Screen name="Supplier_list" options={{ title: 'Suppliers' }} />
      <Drawer.Screen name="logout" options={{ title: 'Log Out' }} />
      

    </Drawer>
  );
}
