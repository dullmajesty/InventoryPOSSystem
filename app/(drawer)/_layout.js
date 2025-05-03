import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown: true,
        drawerIcon: ({ color, size }) => {
          const icons = {
            Sales: 'cash-outline',
            AddItemScreen: 'add-circle-outline',
            Supplier_list: 'people-outline',
            Inventory_list: 'cube-outline',
            Categories_list: 'list-outline',
            User_management: 'person-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="AdminDashboard" options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Sales" options={{ title: 'Sales' }} />
      <Drawer.Screen name="AddItemScreen" options={{ title: 'Add Item' }} />
      <Drawer.Screen name="Supplier_list" options={{ title: 'Suppliers' }} />
      <Drawer.Screen name="Inventory_list" options={{ title: 'Inventory' }} />
      <Drawer.Screen name="Categories_list" options={{ title: 'Categories' }} />
      <Drawer.Screen name="User_management" options={{ title: 'User Management' }} />
    </Drawer>
  );
}
