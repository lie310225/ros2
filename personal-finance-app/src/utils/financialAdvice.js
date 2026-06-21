// 财务建议生成器
import { calculateIncomeExpense, calculateExpenseByCategory, getThisWeekTransactions, getThisMonthTransactions } from './financialCalculations';

// 生成周度财务建议
export const generateWeeklyAdvice = (transactions, budgets = {}) => {
  const weekTransactions = getThisWeekTransactions(transactions);
  const { income, expense, balance } = calculateIncomeExpense(weekTransactions);
  const expenseByCategory = calculateExpenseByCategory(weekTransactions);
  
  const advice = [];
  
  // 1. 收支平衡建议
  if (expense > income * 0.9) {
    advice.push({
      type: 'warning',
      title: '支出接近收入',
      content: `本周支出 ¥${expense.toFixed(2)} 已接近收入 ¥${income.toFixed(2)}，建议控制非必要开支。`,
      priority: 'high',
    });
  } else if (balance > income * 0.3) {
    advice.push({
      type: 'success',
      title: '储蓄率优秀',
      content: `本周储蓄率达到 ${((balance / income) * 100).toFixed(1)}%，继续保持！`,
      priority: 'low',
    });
  }
  
  // 2. 分类支出建议
  const topExpense = expenseByCategory[0];
  if (topExpense && topExpense.amount > expense * 0.4) {
    advice.push({
      type: 'info',
      title: '支出集中度过高',
      content: `"${topExpense.category}" 支出占比 ${(topExpense.amount / expense * 100).toFixed(1)}%，建议分散支出或寻找优化空间。`,
      priority: 'medium',
    });
  }
  
  // 3. 预算超支检查
  Object.entries(budgets).forEach(([category, budget]) => {
    const spent = expenseByCategory.find(e => e.category === category)?.amount || 0;
    if (spent > budget) {
      advice.push({
        type: 'error',
        title: '预算超支',
        content: `"${category}" 本周支出 ¥${spent.toFixed(2)}，超出预算 ¥${budget.toFixed(2)}。`,
        priority: 'high',
      });
    } else if (spent > budget * 0.8) {
      advice.push({
        type: 'warning',
        title: '预算即将用尽',
        content: `"${category}" 已使用预算的 ${(spent / budget * 100).toFixed(1)}%，剩余 ¥${(budget - spent).toFixed(2)}。`,
        priority: 'medium',
      });
    }
  });
  
  // 4. 无交易记录提醒
  if (weekTransactions.length === 0) {
    advice.push({
      type: 'info',
      title: '本周无记录',
      content: '本周还没有记账记录，建议及时记录每笔收支，便于财务管理。',
      priority: 'low',
    });
  }
  
  return {
    period: 'week',
    summary: {
      income,
      expense,
      balance,
      transactionCount: weekTransactions.length,
    },
    advice: advice.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
  };
};

// 生成月度财务建议
export const generateMonthlyAdvice = (transactions, budgets = {}) => {
  const monthTransactions = getThisMonthTransactions(transactions);
  const { income, expense, balance } = calculateIncomeExpense(monthTransactions);
  const expenseByCategory = calculateExpenseByCategory(monthTransactions);
  
  const advice = [];
  
  // 1. 储蓄率评估
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;
  if (savingsRate >= 30) {
    advice.push({
      type: 'success',
      title: '储蓄率优秀',
      content: `本月储蓄率 ${savingsRate.toFixed(1)}%，达到财务健康标准（建议 ≥30%）。`,
      priority: 'low',
    });
  } else if (savingsRate >= 10) {
    advice.push({
      type: 'info',
      title: '储蓄率良好',
      content: `本月储蓄率 ${savingsRate.toFixed(1)}%，建议提升至 30% 以加速财富积累。`,
      priority: 'medium',
    });
  } else if (savingsRate > 0) {
    advice.push({
      type: 'warning',
      title: '储蓄率偏低',
      content: `本月储蓄率仅 ${savingsRate.toFixed(1)}%，建议审视支出结构，减少非必要开支。`,
      priority: 'high',
    });
  } else if (balance < 0) {
    advice.push({
      type: 'error',
      title: '入不敷出',
      content: `本月支出超出收入 ¥${Math.abs(balance).toFixed(2)}，需立即调整消费习惯。`,
      priority: 'high',
    });
  }
  
  // 2. 支出结构分析
  if (expenseByCategory.length > 0) {
    const top3 = expenseByCategory.slice(0, 3);
    const top3Total = top3.reduce((sum, e) => sum + e.amount, 0);
    const top3Ratio = (top3Total / expense) * 100;
    
    if (top3Ratio > 70) {
      advice.push({
        type: 'warning',
        title: '支出过于集中',
        content: `前三大支出类别占比 ${top3Ratio.toFixed(1)}%，建议优化支出结构，避免风险集中。`,
        priority: 'medium',
      });
    }
    
    // 各类别建议
    top3.forEach((item, index) => {
      const ratio = (item.amount / expense) * 100;
      if (ratio > 30) {
        advice.push({
          type: 'info',
          title: `${item.category}支出占比高`,
          content: `"${item.category}" 占总支出 ${ratio.toFixed(1)}%，可考虑寻找替代方案或优化消费习惯。`,
          priority: 'medium',
        });
      }
    });
  }
  
  // 3. 预算执行情况
  const budgetViolations = [];
  Object.entries(budgets).forEach(([category, budget]) => {
    const spent = expenseByCategory.find(e => e.category === category)?.amount || 0;
    if (spent > budget) {
      budgetViolations.push({
        category,
        budget,
        spent,
        over: spent - budget,
      });
    }
  });
  
  if (budgetViolations.length > 0) {
    advice.push({
      type: 'error',
      title: '多项预算超支',
      content: `${budgetViolations.length} 个类别超出预算，总计超支 ¥${budgetViolations.reduce((sum, v) => sum + v.over, 0).toFixed(2)}。`,
      priority: 'high',
    });
  }
  
  // 4. 记账习惯评估
  const uniqueDays = new Set(monthTransactions.map(t => t.date.split('T')[0])).size;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const recordingRate = (uniqueDays / currentDay) * 100;
  
  if (recordingRate < 50) {
    advice.push({
      type: 'warning',
      title: '记账频率偏低',
      content: `本月仅 ${uniqueDays} 天有记账记录（${recordingRate.toFixed(0)}%），建议养成每日记账习惯。`,
      priority: 'medium',
    });
  } else if (recordingRate >= 80) {
    advice.push({
      type: 'success',
      title: '记账习惯优秀',
      content: `本月 ${uniqueDays} 天有记账记录，覆盖率 ${recordingRate.toFixed(0)}%，继续保持！`,
      priority: 'low',
    });
  }
  
  // 5. 财务健康综合评分
  let score = 100;
  if (savingsRate < 10) score -= 30;
  else if (savingsRate < 20) score -= 15;
  
  if (budgetViolations.length > 0) score -= budgetViolations.length * 10;
  if (recordingRate < 50) score -= 20;
  
  score = Math.max(0, score);
  
  return {
    period: 'month',
    summary: {
      income,
      expense,
      balance,
      savingsRate,
      transactionCount: monthTransactions.length,
      recordingDays: uniqueDays,
      financialScore: score,
    },
    advice: advice.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
  };
};
