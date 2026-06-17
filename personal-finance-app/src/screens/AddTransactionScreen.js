import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { CATEGORIES, TRANSACTION_TYPES, createTransaction } from '../models';
import { addTransaction, getAccounts, updateAccountBalance } from '../storage';

export default function AddTransactionScreen({ navigation }) {
  const [transactionType, setTransactionType] = useState(TRANSACTION_TYPES.EXPENSE);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const accs = await getAccounts();
    setAccounts(accs);
    if (accs.length > 0) {
      setSelectedAccount(accs[0].id);
    }
  };

  const categories = transactionType === TRANSACTION_TYPES.INCOME 
    ? CATEGORIES.INCOME 
    : CATEGORIES.EXPENSE;

  const handleTypeChange = (type) => {
    setTransactionType(type);
    setSelectedCategory(null);
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('错误', '请输入有效金额');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('错误', '请选择分类');
      return;
    }
    if (!selectedAccount) {
      Alert.alert('错误', '请选择账户');
      return;
    }

    const transaction = createTransaction(
      transactionType,
      amount,
      selectedCategory.name,
      description,
      new Date().toISOString(),
      selectedAccount
    );

    const success = await addTransaction(transaction);
    if (success) {
      // 更新账户余额
      const account = accounts.find(acc => acc.id === selectedAccount);
      const newBalance = transactionType === TRANSACTION_TYPES.INCOME
        ? account.balance + parseFloat(amount)
        : account.balance - parseFloat(amount);
      
      await updateAccountBalance(selectedAccount, newBalance);
      
      Alert.alert('成功', '交易记录已添加', [
        { text: '确定', onPress: () => {
          setAmount('');
          setDescription('');
          setSelectedCategory(null);
          navigation.goBack();
        }}
      ]);
    } else {
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 交易类型切换 */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            transactionType === TRANSACTION_TYPES.EXPENSE && styles.typeButtonActive,
          ]}
          onPress={() => handleTypeChange(TRANSACTION_TYPES.EXPENSE)}
        >
          <Text style={[
            styles.typeButtonText,
            transactionType === TRANSACTION_TYPES.EXPENSE && styles.typeButtonTextActive,
          ]}>
            支出
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            transactionType === TRANSACTION_TYPES.INCOME && styles.typeButtonActiveIncome,
          ]}
          onPress={() => handleTypeChange(TRANSACTION_TYPES.INCOME)}
        >
          <Text style={[
            styles.typeButtonText,
            transactionType === TRANSACTION_TYPES.INCOME && styles.typeButtonTextActive,
          ]}>
            收入
          </Text>
        </TouchableOpacity>
      </View>

      {/* 金额输入 */}
      <View style={styles.section}>
        <Text style={styles.label}>金额</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* 分类选择 */}
      <View style={styles.section}>
        <Text style={styles.label}>分类</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory?.id === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 账户选择 */}
      <View style={styles.section}>
        <Text style={styles.label}>账户</Text>
        <View style={styles.accountSelector}>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.accountButton,
                selectedAccount === account.id && styles.accountButtonActive,
              ]}
              onPress={() => setSelectedAccount(account.id)}
            >
              <Text style={[
                styles.accountButtonText,
                selectedAccount === account.id && styles.accountButtonTextActive,
              ]}>
                {account.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 备注 */}
      <View style={styles.section}>
        <Text style={styles.label}>备注（可选）</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="添加备注..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* 提交按钮 */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: '#ff6b6b',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#51cf66',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#4dabf7',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
  },
  accountSelector: {
    flexDirection: 'row',
  },
  accountButton: {
    flex: 1,
    padding: 12,
    margin: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  accountButtonActive: {
    backgroundColor: '#4dabf7',
  },
  accountButtonText: {
    color: '#666',
  },
  accountButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4dabf7',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
