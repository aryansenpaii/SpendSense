import React, { useState, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateExpense } from '../../services/expenseService';
import { getAllCategories, addCategory } from '../../services/categoryService';

export default function EditExpenseScreen({ navigation, route }) {
  const { expense } = route.params;

  const [amount, setAmount] = useState(String(expense.amount));
  const [description, setDescription] = useState(expense.description || '');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(String(expense.categoryId || ''));
  const [date, setDate] = useState(new Date(expense.date || new Date()));
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // For adding new category
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Validation', 'Please enter a category name');
      return;
    }
    setAddingCategory(true);
    try {
      const newCat = await addCategory(newCategoryName.trim());
      setCategories([...categories, newCat]);
      setSelectedCategoryId(newCat.id.toString());
      setIsAddModalVisible(false);
      setNewCategoryName('');
      Alert.alert('Success', 'Category added!');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleUpdate = async () => {
    if (!amount || !selectedCategoryId) {
      Alert.alert('Validation', 'Amount and Category are required.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split('.')[0];
      await updateExpense(expense.id, {
        amount: parsedAmount,
        description: description.trim() || null,
        date: formattedDate,
        categoryId: parseInt(selectedCategoryId, 10),
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShowDatePicker(true);
    setPickerMode(currentMode);
  };

  if (fetchingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
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

          <View style={styles.labelRow}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
              <Text style={styles.addCategoryText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategoryId}
              onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
              dropdownIconColor="#e94560"
              style={styles.picker}
            >
              {categories.map((cat) => (
                <Picker.Item 
                  key={cat.id} 
                  label={cat.name} 
                  value={cat.id.toString()} 
                  color={Platform.OS === 'ios' ? '#ccd6f6' : '#ccd6f6'}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => showMode('date')}>
              <Text style={styles.dateTimeText}>📅 {date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => showMode('time')}>
              <Text style={styles.dateTimeText}>🕒 {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode={pickerMode}
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}

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

        {/* Add Category Modal */}
        <Modal
          visible={isAddModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Category</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Category name (e.g. Health)"
                placeholderTextColor="#8892b0"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalBtn, styles.modalCancelBtn]} 
                  onPress={() => setIsAddModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalBtn, styles.modalAddBtn]} 
                  onPress={handleAddNewCategory}
                  disabled={addingCategory}
                >
                  {addingCategory ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalBtnText}>Add</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e17' },
  inner: { flexGrow: 1, padding: 20 },
  loadingContainer: { flex: 1, backgroundColor: '#0f0e17', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#8892b0', marginTop: 12, fontSize: 16 },
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
  label: { color: '#8892b0', fontSize: 13, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  addCategoryText: { color: '#e94560', fontSize: 13, fontWeight: '700' },
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
  pickerContainer: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#233554',
    marginBottom: 18,
    overflow: 'hidden',
  },
  picker: { color: '#ccd6f6', height: Platform.OS === 'android' ? 55 : undefined },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#233554',
  },
  dateTimeText: { color: '#ccd6f6', fontSize: 15, fontWeight: '600' },
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

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 24, width: '100%', borderWidth: 1, borderColor: '#233554' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#ccd6f6', marginBottom: 20 },
  modalInput: { 
    backgroundColor: '#16213e', 
    borderRadius: 12, 
    padding: 14, 
    color: '#ccd6f6', 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#233554', 
    marginBottom: 20 
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalCancelBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#8892b0' },
  modalAddBtn: { backgroundColor: '#e94560' },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalCancelText: { color: '#8892b0', fontSize: 16, fontWeight: '600' },
});
