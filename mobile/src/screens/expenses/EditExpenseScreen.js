import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { updateExpense } from '../../services/expenseService';

export default function EditExpenseScreen({ navigation, route }) {
  const { expense } = route.params;

  const [amount, setAmount] = useState(String(expense.amount));
  const [description, setDescription] = useState(expense.description || '');
  const [categoryId, setCategoryId] = useState(String(expense.categoryId || ''));
  const [date, setDate] = useState(expense.date ? expense.date.replace('Z', '') : '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!amount || !categoryId) {
      Alert.alert('Validation', 'Amount and Category ID are required.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      await updateExpense(expense.id, {
        amount: parsedAmount,
        description: description.trim() || null,
        date: date.trim() || null,
        categoryId: parseInt(categoryId, 10),
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Edit Expense</Text>
          <Text style={styles.expenseId}>ID: #{expense.id}</Text>

          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 150.00"
            placeholderTextColor="#8892b0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Weekly Groceries"
            placeholderTextColor="#8892b0"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Category ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1"
            placeholderTextColor="#8892b0"
            value={categoryId}
            onChangeText={setCategoryId}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DDTHH:mm:ss"
            placeholderTextColor="#8892b0"
            value={date}
            onChangeText={setDate}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e17' },
  inner: { flexGrow: 1, padding: 20 },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#ccd6f6', marginBottom: 4 },
  expenseId: { color: '#8892b0', fontSize: 12, marginBottom: 20 },
  label: { color: '#8892b0', fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: '#ccd6f6',
    fontSize: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#233554',
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', marginTop: 16 },
  cancelText: { color: '#8892b0', fontSize: 14 },
});
