import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch supplier data from the API
    axios
      .get('http://192.168.43.118:8000/api/suppliers/') // Replace with your actual API URL
      .then((response) => {
        setSuppliers(response.data);  // Set the suppliers data from API
        setLoading(false);  // Set loading to false after data is fetched
      })
      .catch((err) => {
        setError('Error fetching data');
        setLoading(false);  // Stop loading on error
      });
  }, []); // This will run once when the component is mounted

  // If loading, show a spinner
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If there's an error, display an error message
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Render the supplier list using FlatList
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Suppliers</Text>
      <FlatList
        data={suppliers}  // Data for the list
        keyExtractor={(item) => item.id.toString()}  // Ensure unique key for each item
        renderItem={({ item }) => (
          <View style={styles.supplierCard}>
            <Text style={styles.supplierName}>{item.name}</Text>
            <Text>Contact Person: {item.contact_person}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Company: {item.company}</Text>
            <Text>Address: {item.address}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  supplierCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3, // For shadow effect
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SupplierList;
