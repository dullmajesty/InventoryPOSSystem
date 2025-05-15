import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import RefreshWrapper from '../../component/Drawer/RefreshWrapper'; // Adjust this path as necessary

const StockLogScreen = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStockLogs = async () => {
    try {
      const response = await axios.get('http://192.168.1.9:8000/api/stock-log/');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching stock logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockLogs();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.cell}>{item.item}</Text>
      <Text style={styles.cell}>{item.transaction_type}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
      <Text style={styles.cell}>{item.unit}</Text>
      <Text style={styles.cell}>{item.value}</Text>
      <Text style={styles.cell}>{item.remarks || '—'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* RefreshWrapper is now used to wrap the ScrollView */}
      <RefreshWrapper onRefresh={fetchStockLogs}>
        <ScrollView horizontal>
          <View style={styles.table}>
            {/* Header */}
            <View style={[styles.row, styles.header]}>
              <Text style={[styles.cell, styles.headerText]}>Date</Text>
              <Text style={[styles.cell, styles.headerText]}>Item</Text>
              <Text style={[styles.cell, styles.headerText]}>Type</Text>
              <Text style={[styles.cell, styles.headerText]}>Qty</Text>
              <Text style={[styles.cell, styles.headerText]}>Unit</Text>
              <Text style={[styles.cell, styles.headerText]}>Value</Text>
              <Text style={[styles.cell, styles.headerText]}>Remarks</Text>
            </View>

            {/* Rows */}
            <FlatList
              data={logs}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          </View>
        </ScrollView>
      </RefreshWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  table: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 6,
  },
  header: {
    backgroundColor: '#eee',
  },
  cell: {
    minWidth: 100,
    paddingHorizontal: 8,
    color: '#333',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#000',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StockLogScreen;
