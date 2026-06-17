import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getTransactions, getBudgets } from '../storage';
import { generateWeeklyAdvice, generateMonthlyAdvice } from '../utils/financialAdvice';

export default function FinancialAdviceScreen() {
  const [period, setPeriod] = useState('month');
  const [advice, setAdvice] = useState(null);

  useEffect(() => {
    loadAdvice();
  }, [period]);

  const loadAdvice = async () => {
    const transactions = await getTransactions();
    const budgets = await getBudgets();
    
    const adviceData = period === 'week'
      ? generateWeeklyAdvice(transactions, budgets)
      : generateMonthlyAdvice(transactions, budgets);
    
    setAdvice(adviceData);
  };

  if (!advice) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const getAdviceIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return 'ℹ';
    }
  };

  const getAdviceColor = (type) => {
    switch (type) {
      case 'success': return '#51cf66';
      case 'warning': return '#ffd43b';
      case 'error': return '#ff6b6b';
      default: return '#4dabf7';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 周期切换 */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
          onPress={() => setPeriod('week')}
        >
          <Text style={[styles.periodButtonText, period === 'week' && styles.periodButtonTextActive]}>
            周度建议
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
          onPress={() => setPeriod('month')}
        >
          <Text style={[styles.periodButtonText, period === 'month' && styles.periodButtonTextActive]}>
            月度建议
          </Text>
        </TouchableOpacity>
      </View>

      {/* 财务摘要 */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          {period === 'week' ? '本周' : '本月'}财务摘要
        </Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>收入</Text>
            <Text style={[styles.summaryValue, { color: '#51cf66' }]}>
              ¥{advice.summary.income.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>支出</Text>
            <Text style={[styles.summaryValue, { color: '#ff6b6b' }]}>
              ¥{advice.summary.expense.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>结余</Text>
            <Text style={[
              styles.summaryValue,
              { color: advice.summary.balance >= 0 ? '#51cf66' : '#ff6b6b' }
            ]}>
              ¥{advice.summary.balance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>交易笔数</Text>
            <Text style={styles.summaryValue}>
              {advice.summary.transactionCount}
            </Text>
          </View>
        </View>
        
        {advice.summary.savingsRate !== undefined && (
          <View style={styles.savingsRateRow}>
            <Text style={styles.savingsRateLabel}>储蓄率</Text>
            <Text style={[
              styles.savingsRateValue,
              { color: advice.summary.savingsRate >= 30 ? '#51cf66' : advice.summary.savingsRate >= 10 ? '#ffd43b' : '#ff6b6b' }
            ]}>
              {advice.summary.savingsRate.toFixed(1)}%
            </Text>
          </View>
        )}

        {advice.summary.financialScore !== undefined && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>财务健康评分</Text>
            <View style={styles.scoreContainer}>
              <Text style={[
                styles.scoreValue,
                { color: advice.summary.financialScore >= 80 ? '#51cf66' : advice.summary.financialScore >= 60 ? '#ffd43b' : '#ff6b6b' }
              ]}>
                {advice.summary.financialScore}
              </Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
          </View>
        )}
      </View>

      {/* 财务建议列表 */}
      <View style={styles.adviceSection}>
        <Text style={styles.sectionTitle}>财务改进建议</Text>
        
        {advice.advice.length === 0 ? (
          <View style={styles.emptyAdvice}>
            <Text style={styles.emptyAdviceIcon}>🎉</Text>
            <Text style={styles.emptyAdviceText}>
              财务状况良好，继续保持！
            </Text>
          </View>
        ) : (
          advice.advice.map((item, index) => (
            <View key={index} style={[
              styles.adviceCard,
              { borderLeftColor: getAdviceColor(item.type) }
            ]}>
              <View style={styles.adviceHeader}>
                <View style={[
                  styles.adviceIcon,
                  { backgroundColor: getAdviceColor(item.type) }
                ]}>
                  <Text style={styles.adviceIconText}>
                    {getAdviceIcon(item.type)}
                  </Text>
                </View>
                <Text style={styles.adviceTitle}>{item.title}</Text>
              </View>
              <Text style={styles.adviceContent}>{item.content}</Text>
            </View>
          ))
        )}
      </View>

      {/* 财务小贴士 */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>理财小贴士</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 建议建立3-6个月的生活费作为紧急备用金
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 每月至少储蓄收入的20%，用于长期投资
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 定期审视支出，区分"需要"和"想要"
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '50%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingsRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  savingsRateLabel: {
    fontSize: 16,
    color: '#666',
  },
  savingsRateValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
  },
  adviceSection: {
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
  emptyAdvice: {
    alignItems: 'center',
    padding: 30,
  },
  emptyAdviceIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyAdviceText: {
    fontSize: 16,
    color: '#666',
  },
  adviceCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  adviceIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  adviceIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  adviceContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 38,
  },
  tipsSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: '#e7f5ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#1971c2',
    lineHeight: 20,
  },
});
