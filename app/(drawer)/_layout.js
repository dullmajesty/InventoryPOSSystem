import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, StyleSheet } from 'react-native';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => (
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.drawerContent}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/samsantek-image.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )}
      screenOptions={({ route }) => ({
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#4e73df', 
        },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#e0e0e0',
        drawerIcon: ({ color, size }) => {
          const icons = {
            AdminDashboard: 'grid-outline',
            Inventory_list: 'cube-outline',
            Supplier_list: 'people-outline',
            Sales: 'cash-outline',
            Stock_log: 'document-text-outline',
            logout: 'log-out-outline',
          };

          return (
            <Ionicons
              name={icons[route.name] || 'ellipse-outline'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Drawer.Screen name="AdminDashboard" options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Inventory_list" options={{ title: 'Inventory' }} />
      <Drawer.Screen name="Sales" options={{ title: 'Sales' }} />
      <Drawer.Screen name="Supplier_list" options={{ title: 'Suppliers' }} />
      <Drawer.Screen name="Stock_log" options={{ title: 'Stock Logs' }} />
      <Drawer.Screen name="logout" options={{ title: 'Log Out' }} />
    </Drawer>

  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#4e73df',
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
});

