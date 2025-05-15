import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import RefreshWrapper from '../../component/Drawer/RefreshWrapper';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDashboardStats } from '../../utils/api';
import { useNavigation } from '@react-navigation/native';


const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    total_items: null,
    total_sales: null,
    total_categories: null,
    total_users: null,
  });
  const [loading, setLoading] = useState(true);

  const [activeModal, setActiveModal] = useState(null); // Track which modal is open

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const data = await getDashboardStats();
    setStats(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e73df" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <RefreshWrapper onRefresh={fetchStats}>
        <View style={styles.container}>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={[styles.statCard, styles.gradientPurple]}
              onPress={() => navigation.navigate('Inventory_list')}
            >
              <FontAwesome5 name="box" size={30} color="#fff" style={styles.icon} />
              <Text style={styles.cardTitle}>Total Items</Text>
              <Text style={styles.cardValue}>{stats.total_items}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statCard, styles.gradientGreen]}
              onPress={() => navigation.navigate('Sales')}
            >
              <FontAwesome5 name="dollar-sign" size={30} color="#fff" style={styles.icon} />
              <Text style={styles.cardTitle}>Total Sales</Text>
              <Text style={styles.cardValue}>${stats.total_sales}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statCard, styles.gradientOrange]}
              onPress={() => setActiveModal('categories')}
            >
              <FontAwesome5 name="tags" size={30} color="#fff" style={styles.icon} />
              <Text style={styles.cardTitle}>Total Categories</Text>
              <Text style={styles.cardValue}>{stats.total_categories}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statCard, styles.gradientLime]}
              onPress={() => setActiveModal('users')}
            >
              <FontAwesome5 name="users" size={30} color="#fff" style={styles.icon} />
              <Text style={styles.cardTitle}>Total Users</Text>
              <Text style={styles.cardValue}>{stats.total_users}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RefreshWrapper>

      {/* MODALS */}
      <Modal visible={activeModal === 'items'} transparent animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>📦 Total Items</Text>
            <Text style={styles.modalContent}>You have {stats.total_items} items in inventory.</Text>
            <Text style={styles.modalContent}>Consider restocking low inventory items or archiving inactive ones.</Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'sales'} transparent animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>💰 Total Sales</Text>
            <Text style={styles.modalContent}>Your total sales amount is ${stats.total_sales}.</Text>
            <Text style={styles.modalContent}>Track your top-selling products and analyze trends here.</Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'categories'} transparent animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🏷️ Total Categories</Text>
            <Text style={styles.modalContent}>You have {stats.total_categories} product categories.</Text>
            <Text style={styles.modalContent}>Review or organize them for better inventory grouping.</Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'users'} transparent animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>👥 Total Users</Text>
            <Text style={styles.modalContent}>There are {stats.total_users} registered users.</Text>
            <Text style={styles.modalContent}>Manage roles and monitor access for your system users.</Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
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
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#4e73df',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalCloseText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;
