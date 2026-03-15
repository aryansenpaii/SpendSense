import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllExpenses, deleteExpense } from '../../services/expenseService';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { logout, user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExpenses = async () => {
    try {
      const data = await getAllExpenses();
      setExpenses(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchExpenses();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExpense(id);
            setExpenses((prev) => prev.filter((e) => e.id !== id));
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardCategory}>{item.categoryName || 'Uncategorized'}</Text>
        <Text style={styles.cardDesc} numberOfLines={1}>{item.description || '—'}</Text>
        <Text style={styles.cardDate}>
          {item.date ? new Date(item.date).toLocaleDateString() : ''}
        </Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardAmount}>₹{Number(item.amount).toFixed(2)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditExpense', { expense: item })}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteBtnText}>Del</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryGreet}>Hello, {user?.name || 'User'} 👋</Text>
        <Text style={styles.summaryLabel}>Total Expenses</Text>
        <Text style={styles.summaryAmount}>₹{totalAmount.toFixed(2)}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddExpense')}>
            <Text style={styles.addBtnText}>+ Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#e94560" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchExpenses(); }}
              tintColor="#e94560"
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No expenses yet. Tap + to add one!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e17' },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryGreet: { color: '#8892b0', fontSize: 14 },
  summaryLabel: { color: '#8892b0', fontSize: 13, marginTop: 12 },
  summaryAmount: { color: '#e94560', fontSize: 38, fontWeight: '800', marginTop: 4 },
  headerActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  addBtn: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  logoutBtn: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#233554',
  },
  logoutBtnText: { color: '#8892b0', fontWeight: '600', fontSize: 14 },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#16213e',
  },
  cardLeft: { flex: 1, marginRight: 12 },
  cardCategory: { color: '#e94560', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  cardDesc: { color: '#ccd6f6', fontSize: 15, fontWeight: '600', marginTop: 4 },
  cardDate: { color: '#8892b0', fontSize: 12, marginTop: 4 },
  cardRight: { alignItems: 'flex-end' },
  cardAmount: { color: '#64ffda', fontSize: 18, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  editBtn: { backgroundColor: '#16213e', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  editBtnText: { color: '#8892b0', fontSize: 12, fontWeight: '600' },
  deleteBtn: { backgroundColor: '#1a0010', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  deleteBtnText: { color: '#e94560', fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 52 },
  emptyText: { color: '#8892b0', fontSize: 15, marginTop: 12, textAlign: 'center' },
});
