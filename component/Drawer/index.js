import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AddItemScreen from '../../app/(drawer)/AddItemScreen';
import CategoriesList from '../../app/(drawer)/Categories_list';
import InventoryList from '../../app/(drawer)/Inventory_list';
import Sales from '../../app/(drawer)/Sales';
import SupplierList from '../../app/(drawer)/Supplier_list';
import UserManagement from '../../app/(drawer)/User_management';
import AdminDashboard from '../../app/(drawer)/AdminDashboard';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={AdminDashboard} />
      <Drawer.Screen name="Add Item" component={AddItemScreen} />
      <Drawer.Screen name="Categories" component={CategoriesList} />
      <Drawer.Screen name="Inventory" component={InventoryList} />
      <Drawer.Screen name="Sales" component={Sales} />
      <Drawer.Screen name="Suppliers" component={SupplierList} />
      <Drawer.Screen name="Users" component={UserManagement} />
    </Drawer.Navigator>
  );
}
