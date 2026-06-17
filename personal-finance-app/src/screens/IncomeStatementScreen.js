import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getTransactions } from '../storage';
import { generateIncomeStatement } from '../utils/financialCalculations';

const screenWidth = Dimensions.get('window').width;

export default function IncomeStatementScreen() {
  const [period, setPeriod] = useState('month');
  const [statement, setStatement] = useState(null);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    const transactions = await getTransactions();
    const stmt = generateIncomeStatement(transactions, period);
    setStatement(stmt);
  };

  if (!statement) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const periodLabel = period === 'week' ? '本周' : '本月';

  return (
    <ScrollView style={styles.container}>
      {/* 周期切换 */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
          onPress={() => setPeriod('week')}
        >
          <Text style={[styles.periodButtonText, period === 'week' && styles.periodButtonTextActive]}>
            本周
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
          onPress={() => setPeriod('month')}
        >
          <Text style={[styles.periodButtonText, period === 'month' && styles.periodButtonTextActive]}>
            本月
          </Text>
        </TouchableOpacity>
      </View>

      {/* 收入支出概览 */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{periodLabel}收支概览</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>收入</Text>
            <Text style={[styles.summaryValue, { color: '#51cf66' }]}>
              ¥{statement.income.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>支出</Text>
            <Text style={[styles.summaryValue, { color: '#ff6b6b' }]}>
              ¥{statement.expense.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>净利润</Text>
            <Text style={[
              styles.summaryValue,
              { color: statement.netProfit >= 0 ? '#51cf66' : '#ff6b6b' }
            ]}>
              ¥{statement.netProfit.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>交易笔数</Text>
            <Text style={styles.summaryValue}>{statement.transactions.length}</Text>
          </View>
        </View>
      </View>

      {/* 支出分类明细 */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>支出分类明细</Text>
        {statement.expenseByCategory.length === 0 ? (
          <Text style={styles.emptyText}>暂无支出记录</Text>
        ) : (
          statement.expenseByCategory.map((item, index) => {
            const percentage = statement.expense > 0 
              ? (item.amount / statement.expense) * 100 
              : 0;
            
            return (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${percentage}%` }
                      ]} 
                    />
                  </View>
                </View>
                <View style={styles.categoryAmount}>
                  <Text style={styles.amountText}>¥{item.amount.toFixed(2)}</Text>
                  <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* 财务指标 */}
      <View style={styles.metricsSection}>
        <Text style={styles.sectionTitle}>财务指标</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>储蓄率</Text>
          <Text style={styles.metricValue}>
            {statement.income > 0 
              ? ((statement.netProfit / statement.income) * 100).toFixed(1)
              : 0}%
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>支出收入比</Text>
          <Text style={styles.metricValue}>
            {statement.income > 0 
              ? ((statement.expense / statement.income) * 100).toFixed(1)
              : 0}%
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>平均每笔支出</Text>
          <Text style={styles.metricValue}>
            ¥{statement.expenseByCategory.length > 0 
              ? (statement.expense / statement.expenseByCategory.length).toFixed(2)
              : '0.00'}
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#4dabf7',
  },
  periodButtonText: {
    fontSize: 16,
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  categorySection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4dabf7',
    borderRadius: 3,
  },
  categoryAmount: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  percentageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
    marginBottom: 20,
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
