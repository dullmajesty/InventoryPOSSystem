import RefreshWrapper from '../../component/Drawer/RefreshWrapper';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const SalesReportScreen = () => {
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSalesData = async (period = selectedPeriod) => {
    try {
      if (!refreshing) setLoading(true);
      const params = { period };
      const response = await axios.get('http://192.168.1.9:8000/api/sales-report/', { params });

      setSalesData(response.data.sales_data);
      setTotalSales(response.data.total_sales);
      setSelectedPeriod(response.data.selected_period || period);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSalesData('today');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSalesData();
  };

  const getChartData = () => {
    const labels = salesData.map((s, index) => {
      const date = new Date(s.timestamp);
      return index % 3 === 0 ? `${date.getMonth() + 1}/${date.getDate()}` : '';
    });
    const data = salesData.map((s) => s.total_price);
    return { labels, datasets: [{ data }] };
  };
  

  if (loading && !refreshing) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <RefreshWrapper refreshing={refreshing} onRefresh={handleRefresh}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.title}>Sales Report ({selectedPeriod})</Text>
            <Text style={styles.totalSales}>Total Sales: ₱{totalSales}</Text>

            <View style={styles.periodButtons}>
              {['today', 'week', 'month', 'year'].map((period) => (
                <View
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                >
                  <Text
                    onPress={() => fetchSalesData(period)}
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period && styles.periodButtonActiveText,
                    ]}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </View>
              ))}
            </View>

            {salesData.length > 0 && (
              <LineChart
                data={getChartData()}
                width={Dimensions.get('window').width - 40}
                height={250}
                yAxisLabel="₱"
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 2,
                  color: () => `#2E5EAA`,
                  labelColor: () => `#333`,
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#2E5EAA',
                  },
                }}
                style={{ marginVertical: 20, borderRadius: 16 }}
              />
            )}

            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Date</Text>
                <Text style={styles.headerCell}>Time</Text>
                <Text style={styles.headerCell}>Subtotal</Text>
              </View>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        data={salesData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const date = new Date(item.timestamp);
          return (
            <View style={styles.tableRow}>
              <Text style={styles.cell}>{date.toLocaleDateString()}</Text>
              <Text style={styles.cell}>{date.toLocaleTimeString()}</Text>
              <Text style={styles.cell}>₱{item.total_price}</Text>
            </View>
          );
        }}
      />
    </RefreshWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  periodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#aad5f5',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#008585',
  },
  periodButtonText: {
    color: '#008585',
    fontWeight: '600',
  },
  periodButtonActiveText: {
    color: '#fff',
  },
  totalSales: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'right',
    color: '#008585',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#008585',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontSize: 13,
  },
});

export default SalesReportScreen;
