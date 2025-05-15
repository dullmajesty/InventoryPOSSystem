import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import RefreshWrapper from '../../component/Drawer/RefreshWrapper';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://192.168.1.9:8000/api/suppliers/');
      setSuppliers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>  Supplier Directory</Text>

      <RefreshWrapper onRefresh={fetchSuppliers}>
        {suppliers.length === 0 ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.emptyText}>No suppliers available.</Text>
          </View>
        ) : (
          <FlatList
            data={suppliers}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.infoRow}>
                  <MaterialIcons name="person" size={16} color="#555" />
                  <Text style={styles.infoText}> {item.contact_person}</Text>
                </View>
                <View style={styles.infoRow}>
                  <FontAwesome name="phone" size={16} color="#555" />
                  <Text style={styles.infoText}> {item.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="email" size={16} color="#555" />
                  <Text style={styles.infoText}> {item.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="business" size={16} color="#555" />
                  <Text style={styles.infoText}> {item.company}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="location-on" size={16} color="#555" />
                  <Text style={styles.infoText}> {item.address}</Text>
                </View>
              </View>
            )}
          />
        )}
      </RefreshWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SupplierList;
