import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getTransactions } from '../storage';
import { generateCashFlowStatement } from '../utils/financialCalculations';

export default function CashFlowStatementScreen() {
  const [period, setPeriod] = useState('month');
  const [statement, setStatement] = useState(null);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    const transactions = await getTransactions();
    const stmt = generateCashFlowStatement(transactions, period);
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

      {/* 净现金流卡片 */}
      <View style={styles.netCashFlowCard}>
        <Text style={styles.netCashFlowLabel}>净现金流</Text>
        <Text style={[
          styles.netCashFlowValue,
          { color: statement.netCashFlow >= 0 ? '#51cf66' : '#ff6b6b' }
        ]}>
          ¥{statement.netCashFlow.toFixed(2)}
        </Text>
        <Text style={styles.netCashFlowDesc}>
          {statement.netCashFlow >= 0 ? '现金净流入' : '现金净流出'}
        </Text>
      </View>

      {/* 经营活动现金流 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>经营活动现金流</Text>
        
        <View style={styles.cashFlowItem}>
          <Text style={styles.cashFlowLabel}>现金流入</Text>
          <Text style={[styles.cashFlowValue, { color: '#51cf66' }]}>
            +¥{statement.operatingCashIn.toFixed(2)}
          </Text>
        </View>

        <View style={styles.cashFlowItem}>
          <Text style={styles.cashFlowLabel}>现金流出</Text>
          <Text style={[styles.cashFlowValue, { color: '#ff6b6b' }]}>
            -¥{statement.operatingCashOut.toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cashFlowItem}>
          <Text style={styles.cashFlowLabelTotal}>经营活动净现金流</Text>
          <Text style={[
            styles.cashFlowValueTotal,
            { color: statement.netCashFlow >= 0 ? '#51cf66' : '#ff6b6b' }
          ]}>
            ¥{statement.netCashFlow.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 现金流分析 */}
      <View style={styles.analysisSection}>
        <Text style={styles.sectionTitle}>现金流分析</Text>
        
        <View style={styles.analysisItem}>
          <Text style={styles.analysisLabel}>现金流入率</Text>
          <Text style={styles.analysisValue}>
            {statement.operatingCashOut > 0 
              ? ((statement.operatingCashIn / statement.operatingCashOut) * 100).toFixed(1)
              : 0}%
          </Text>
        </View>

        <View style={styles.analysisItem}>
          <Text style={styles.analysisLabel}>现金再投资率</Text>
          <Text style={styles.analysisValue}>
            {statement.operatingCashIn > 0 
              ? (((statement.operatingCashIn - statement.operatingCashOut) / statement.operatingCashIn) * 100).toFixed(1)
              : 0}%
          </Text>
        </View>

        <View style={styles.analysisItem}>
          <Text style={styles.analysisLabel}>交易笔数</Text>
          <Text style={styles.analysisValue}>{statement.transactions.length}</Text>
        </View>
      </View>

      {/* 现金流健康提示 */}
      <View style={styles.healthSection}>
        <Text style={styles.sectionTitle}>现金流健康提示</Text>
        {statement.netCashFlow > 0 ? (
          <View style={styles.healthTip}>
            <Text style={styles.healthTipIcon}>✓</Text>
            <Text style={styles.healthTipText}>
              {periodLabel}现金净流入，财务状况良好。建议将盈余资金用于储蓄或投资。
            </Text>
          </View>
        ) : (
          <View style={styles.healthTip}>
            <Text style={[styles.healthTipIcon, { color: '#ff6b6b' }]}>!</Text>
            <Text style={styles.healthTipText}>
              {periodLabel}现金净流出，需关注支出控制。建议审视非必要开支，增加收入来源。
            </Text>
          </View>
        )}
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
  netCashFlowCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  netCashFlowLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  netCashFlowValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  netCashFlowDesc: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  section: {
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
  cashFlowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cashFlowLabel: {
    fontSize: 16,
    color: '#666',
  },
  cashFlowValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  cashFlowLabelTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cashFlowValueTotal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  analysisSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  analysisLabel: {
    fontSize: 16,
    color: '#666',
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4dabf7',
  },
  healthSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  healthTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  healthTipIcon: {
    fontSize: 20,
    color: '#51cf66',
    marginRight: 10,
    fontWeight: 'bold',
  },
  healthTipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
