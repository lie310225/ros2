// 本地存储管理
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_ACCOUNTS } from '../models';

const KEYS = {
  TRANSACTIONS: '@finance_transactions',
  ACCOUNTS: '@finance_accounts',
  BUDGETS: '@finance_budgets',
};

// 初始化存储
export const initializeStorage = async () => {
  try {
    const accounts = await AsyncStorage.getItem(KEYS.ACCOUNTS);
    if (!accounts) {
      await AsyncStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
    }
    
    const transactions = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
    if (!transactions) {
      await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
    }
  } catch (error) {
    console.error('初始化存储失败:', error);
  }
};

// 交易记录操作
export const getTransactions = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取交易记录失败:', error);
    return [];
  }
};

export const addTransaction = async (transaction) => {
  try {
    const transactions = await getTransactions();
    transactions.unshift(transaction); // 新记录添加到开头
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('添加交易记录失败:', error);
    return false;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const transactions = await getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('删除交易记录失败:', error);
    return false;
  }
};

// 账户操作
export const getAccounts = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : DEFAULT_ACCOUNTS;
  } catch (error) {
    console.error('获取账户失败:', error);
    return DEFAULT_ACCOUNTS;
  }
};

export const updateAccountBalance = async (accountId, newBalance) => {
  try {
    const accounts = await getAccounts();
    const updated = accounts.map(acc => 
      acc.id === accountId ? { ...acc, balance: newBalance } : acc
    );
    await AsyncStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('更新账户余额失败:', error);
    return false;
  }
};

// 预算操作
export const getBudgets = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BUDGETS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('获取预算失败:', error);
    return {};
  }
};

export const setBudget = async (category, amount) => {
  try {
    const budgets = await getBudgets();
    budgets[category] = amount;
    await AsyncStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
    return true;
  } catch (error) {
    console.error('设置预算失败:', error);
    return false;
  }
};
