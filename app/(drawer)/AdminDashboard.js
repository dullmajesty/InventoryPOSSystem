import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDashboardStats } from '../../utils/api';

const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    total_items: null,
    total_sales: null,
    total_categories: null,
    total_users: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e73df" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Dashboard Body */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Overview</Text>

        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={[styles.statCard, styles.gradientPurple]}
            onPress={() => navigation.navigate('TotalItems')}
          >
            <FontAwesome5 name="box" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Total Items</Text>
            <Text style={styles.cardValue}>{stats.total_items}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, styles.gradientGreen]}
            onPress={() => navigation.navigate('TotalSales')}
          >
            <FontAwesome5 name="dollar-sign" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Total Sales</Text>
            <Text style={styles.cardValue}>${stats.total_sales}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, styles.gradientOrange]}
            onPress={() => navigation.navigate('TotalCategories')}
          >
            <FontAwesome5 name="tags" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Total Categories</Text>
            <Text style={styles.cardValue}>{stats.total_categories}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, styles.gradientLime]}
            onPress={() => navigation.navigate('TotalUsers')}
          >
            <FontAwesome5 name="users" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.cardTitle}>Total Users</Text>
            <Text style={styles.cardValue}>{stats.total_users}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e73df',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4e73df',
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  icon: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  gradientPurple: {
    backgroundColor: '#7e57c2',
  },
  gradientGreen: {
    backgroundColor: '#00c853',
  },
  gradientOrange: {
    backgroundColor: '#ff6f00',
  },
  gradientLime: {
    backgroundColor: '#76ff03',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#4e73df',
  },
});

export default AdminDashboardScreen;
