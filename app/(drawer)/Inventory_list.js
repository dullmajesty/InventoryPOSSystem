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

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchInventoryData(), fetchCategoriesData()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const response = await fetch('http://192.168.43.118:8000/api/inventory/');
      const data = await response.json();
      setInventory(data);
      setFilteredInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const response = await fetch('http://192.168.43.118:8000/api/categories/');
      const data = await response.json();
      const formatted = data.map((cat) => ({ id: cat.id, name: cat.name }));
      setCategories(formatted);
      if (formatted.length > 0) {
        const first = formatted[0];
        setSelectedCategory(first);
        setFilteredInventory((prev) =>
          prev.filter((item) => item.category === first.id)
        );
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const filtered = inventory.filter((item) => item.category === category.id);
    setFilteredInventory(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.details}>Qty: {item.quantity} {item.unit}</Text>
        <Text style={styles.details}>Price: ₱{item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00796b" />
        </View>
      ) : (
        <>
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        </>
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
    marginBottom: 8,
  },
  desc: {
    color: '#555',
    fontSize: 14,
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
});

export default InventoryScreen;
