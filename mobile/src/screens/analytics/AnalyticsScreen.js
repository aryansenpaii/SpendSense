import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMonthlySummary, getCategorySummary } from '../../services/analyticsService';

export default function AnalyticsScreen() {
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [monthlyData, categoryData] = await Promise.all([
        getMonthlySummary(),
        getCategorySummary(),
      ]);
      setMonthly(monthlyData);
      setCategories(categoryData);
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
      fetchData();
    }, [])
  );

  const totalSpend = categories.reduce((sum, c) => sum + (c.total || c.totalAmount || 0), 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.inner}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchData(); }}
          tintColor="#e94560"
        />
      }
    >
      {/* Category Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 By Category</Text>
        {categories.length === 0 ? (
          <Text style={styles.empty}>No data yet.</Text>
        ) : (
          categories.map((item, index) => {
            const amount = item.total || item.totalAmount || 0;
            const pct = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
            return (
              <View key={index} style={styles.rowCard}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowLabel}>{item.categoryName || item.category || 'Other'}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${pct.toFixed(0)}%` }]} />
                  </View>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowAmount}>₹{Number(amount).toFixed(2)}</Text>
                  <Text style={styles.rowPct}>{pct.toFixed(1)}%</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Monthly Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Monthly Breakdown</Text>
        {!monthly || monthly.length === 0 ? (
          <Text style={styles.empty}>No data yet.</Text>
        ) : (
          monthly.map((item, index) => {
            const dateLabel = item.year && item.month 
              ? `${item.year}-${String(item.month).padStart(2, '0')}`
              : item.month || item.yearMonth || `Entry ${index + 1}`;
            const amount = item.total || item.totalAmount || 0;
            
            return (
              <View key={index} style={styles.rowCard}>
                <Text style={styles.rowLabel}>{dateLabel}</Text>
                <Text style={styles.rowAmount}>₹{Number(amount).toFixed(2)}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e17' },
  inner: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, backgroundColor: '#0f0e17', justifyContent: 'center', alignItems: 'center' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#ccd6f6', marginBottom: 18 },
  rowCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#16213e',
  },
  rowLeft: { flex: 1, marginRight: 12 },
  rowLabel: { color: '#ccd6f6', fontSize: 15, fontWeight: '600' },
  progressBar: {
    height: 4,
    backgroundColor: '#16213e',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: 2,
  },
  rowRight: { alignItems: 'flex-end' },
  rowAmount: { color: '#64ffda', fontSize: 16, fontWeight: '700' },
  rowPct: { color: '#8892b0', fontSize: 12, marginTop: 2 },
  empty: { color: '#8892b0', fontSize: 14, textAlign: 'center', marginTop: 16 },
});
