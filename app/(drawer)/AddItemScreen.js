import { View, Text } from 'react-native';

export default function AddItemScreen() {
  return (
    <View>
      <Text>Add Item Screen</Text>
    </View>
  );
}

// Optional: Customize drawer label
export const options = {
  drawerLabel: 'Add New Item',
};
