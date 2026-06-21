import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getAccounts, getTransactions } from '../storage';
import { generateBalanceSheet } from '../utils/financialCalculations';

export default function BalanceSheetScreen() {
  const [balanceSheet, setBalanceSheet] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const accounts = await getAccounts();
    const transactions = await getTransactions();
    const sheet = generateBalanceSheet(accounts, transactions);
    setBalanceSheet(sheet);
  };

  if (!balanceSheet) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>资产负债表</Text>
        <Text style={styles.subtitle}>个人财务状况概览</Text>
      </View>

      {/* 净资产卡片 */}
      <View style={styles.netWorthCard}>
        <Text style={styles.netWorthLabel}>净资产</Text>
        <Text style={[
          styles.netWorthValue,
          { color: balanceSheet.netWorth >= 0 ? '#51cf66' : '#ff6b6b' }
        ]}>
          ¥{balanceSheet.netWorth.toFixed(2)}
        </Text>
      </View>

      {/* 资产部分 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>资产</Text>
          <Text style={styles.sectionAmount}>¥{balanceSheet.assets.toFixed(2)}</Text>
        </View>
        {balanceSheet.accounts.filter(acc => acc.isAsset).map((account) => (
          <View key={account.id} style={styles.accountRow}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountBalance}>¥{account.balance.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* 负债部分 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>负债</Text>
          <Text style={styles.sectionAmount}>¥{balanceSheet.liabilities.toFixed(2)}</Text>
        </View>
        {balanceSheet.accounts.filter(acc => !acc.isAsset).map((account) => (
          <View key={account.id} style={styles.accountRow}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={[styles.accountBalance, { color: '#ff6b6b' }]}>
              ¥{Math.abs(account.balance).toFixed(2)}
            </Text>
          </View>
        ))}
        {balanceSheet.liabilities === 0 && (
          <Text style={styles.emptyText}>暂无负债</Text>
        )}
      </View>

      {/* 财务健康指标 */}
      <View style={styles.metricsSection}>
        <Text style={styles.metricsTitle}>财务健康指标</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>资产负债率</Text>
          <Text style={styles.metricValue}>
            {balanceSheet.assets > 0 
              ? ((balanceSheet.liabilities / balanceSheet.assets) * 100).toFixed(1)
              : 0}%
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>流动比率</Text>
          <Text style={styles.metricValue}>
            {balanceSheet.liabilities > 0
              ? (balanceSheet.assets / balanceSheet.liabilities).toFixed(2)
              : '∞'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  netWorthCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  netWorthLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  netWorthValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4dabf7',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accountName: {
    fontSize: 16,
    color: '#666',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  metricsSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4dabf7',
  },
});
