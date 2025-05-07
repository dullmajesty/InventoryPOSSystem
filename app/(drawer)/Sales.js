import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function SalesReport() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSalesData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchSalesData = (period) => {
    setLoading(true);
    fetch(`http://192.168.43.118:8000/api/sales-report/?period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.sales) {
          setSalesData(data.sales);
          setTotalSales(data.total_sales || 0);

          const labels = data.sales.map((sale) => sale.date);
          const amounts = data.sales.map((sale) => parseFloat(sale.subtotal));
          setChartData({
            labels,
            datasets: [{ data: amounts }],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.cell, styles.headerCell]}>Date</Text>
      <Text style={[styles.cell, styles.headerCell]}>Item</Text>
      <Text style={[styles.cell, styles.headerCell]}>Price</Text>
      <Text style={[styles.cell, styles.headerCell]}>Qty</Text>
      <Text style={[styles.cell, styles.headerCell]}>Subtotal</Text>
    </View>
  );

  const renderRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.item_name}</Text>
      <Text style={styles.cell}>₱{item.price}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
      <Text style={styles.cell}>₱{item.subtotal}</Text>
    </View>
  );

  const handleYearChange = (direction) => {
    const newYear = direction === 'prev' ? selectedYear - 1 : selectedYear + 1;
    setSelectedYear(newYear);
    // Optional: fetch year-specific data based on newYear
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sales Report - {selectedPeriod.toUpperCase()}</Text>

      {/* Period Tab Buttons */}
      <View style={styles.periodButtons}>
        {['today', 'week', 'month', 'year'].map((period, index, array) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
              index === array.length - 1 && { borderRightWidth: 0 },
            ]}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonActiveText,
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#008585" />
      ) : (
        <>
          {/* Chart */}
          {chartData.labels?.length > 0 && (
            <View style={styles.chartWrapper}>
              <Text style={styles.chartTitle}>{salesData.length} Transactions</Text>
              <LineChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: '#3faaa6',
                  backgroundGradientTo: '#7cd5d3',
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: () => '#fff',
                  style: { borderRadius: 12 },
                }}
                bezier
                style={{ borderRadius: 12 }}
              />
            </View>
          )}

          {/* Total Sales */}
          <Text style={styles.totalSales}>Total Sales: ₱{totalSales.toFixed(2)}</Text>

          {/* Table */}
          <View style={styles.table}>
            {renderHeader()}
            <FlatList
              data={salesData}
              keyExtractor={(_, i) => i.toString()}
              renderItem={renderRow}
              scrollEnabled={false}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

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
  yearNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  yearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
  },
  arrow: {
    fontSize: 24,
    color: '#333',
  },
  
  chartTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: 6,
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
