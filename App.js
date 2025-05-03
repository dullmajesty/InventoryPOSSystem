import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './component/Drawer'; // Pointing to your drawer setup

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
