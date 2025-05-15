import RefreshWrapper from '../../component/Drawer/RefreshWrapper';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const InventoryScreen = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchInventoryData(), fetchCategoriesData()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const response = await fetch('http://192.168.1.9:8000/api/inventory/');
      const data = await response.json();
      setInventory(data);
      setFilteredInventory(data); // Show all items initially
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const response = await fetch('http://192.168.1.9:8000/api/categories/');
      const data = await response.json();
      const formatted = data.map((cat) => ({ id: cat.id, name: cat.name }));
      setCategories(formatted);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategorySelect = (category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      setFilteredInventory(inventory); // Show all if unselected
    } else {
      setSelectedCategory(category);
      const filtered = inventory.filter((item) => item.category === category.id);
      setFilteredInventory(filtered);
    }
  };

  const handleAllItems = () => {
    setSelectedCategory(null);
    setFilteredInventory(inventory);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchInventoryData(), fetchCategoriesData()]);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const lowStock = item.quantity <= 5;

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <View style={styles.metaRow}>
            <Text
              style={[
                styles.stock,
                { color: lowStock ? '#d32f2f' : '#388e3c', fontWeight: '600' },
              ]}
            >
              Qty: {item.quantity} {item.unit}
            </Text>
            <Text style={styles.price}>₱{item.price}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00796b" />
        </View>
      ) : (
        <RefreshWrapper refreshing={refreshing} onRefresh={handleRefresh}>
          <Text style={styles.header}>Inventory List</Text>

          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  !selectedCategory && styles.categoryButtonSelected,
                ]}
                onPress={handleAllItems}
              >
                <Text
                  style={[
                    styles.categoryText,
                    !selectedCategory && styles.categoryTextSelected,
                  ]}
                >
                  All Items
                </Text>
              </TouchableOpacity>

              {categories.map((category) => {
                const isSelected = selectedCategory?.id === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      isSelected && styles.categoryButtonSelected,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <FlatList
            data={filteredInventory}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </RefreshWrapper>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d0d5dd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryButtonSelected: {
    backgroundColor: '#1e88e5',
    borderColor: '#1e88e5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
  categoryTextSelected: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  desc: {
    color: '#555',
    fontSize: 14,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  stock: {
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e88e5',
  },
});

export default InventoryScreen;
