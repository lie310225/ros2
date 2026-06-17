// 财务报表计算工具
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

// 获取指定时间范围内的交易
export const getTransactionsByPeriod = (transactions, startDate, endDate) => {
  return transactions.filter(t => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start: startDate, end: endDate });
  });
};

// 计算本周交易
export const getThisWeekTransactions = (transactions) => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  return getTransactionsByPeriod(transactions, start, end);
};

// 计算本月交易
export const getThisMonthTransactions = (transactions) => {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  return getTransactionsByPeriod(transactions, start, end);
};

// 计算总收入和总支出
export const calculateIncomeExpense = (transactions) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return { income, expense, balance: income - expense };
};

// 按分类统计支出
export const calculateExpenseByCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const byCategory = {};
  
  expenses.forEach(t => {
    if (!byCategory[t.category]) {
      byCategory[t.category] = 0;
    }
    byCategory[t.category] += t.amount;
  });
  
  return Object.entries(byCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

// 生成资产负债表数据
export const generateBalanceSheet = (accounts, transactions) => {
  // 资产 = 所有账户的正余额
  const assets = accounts
    .filter(acc => acc.balance >= 0)
    .reduce((sum, acc) => sum + acc.balance, 0);
  
  // 负债 = 信用卡等负余额账户的绝对值
  const liabilities = accounts
    .filter(acc => acc.balance < 0)
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);
  
  // 净资产 = 资产 - 负债
  const netWorth = assets - liabilities;
  
  return {
    assets,
    liabilities,
    netWorth,
    accounts: accounts.map(acc => ({
      ...acc,
      isAsset: acc.balance >= 0,
    })),
  };
};

// 生成利润表数据
export const generateIncomeStatement = (transactions, period = 'month') => {
  const periodTransactions = period === 'week' 
    ? getThisWeekTransactions(transactions)
    : getThisMonthTransactions(transactions);
  
  const { income, expense, balance } = calculateIncomeExpense(periodTransactions);
  const expenseByCategory = calculateExpenseByCategory(periodTransactions);
  
  return {
    period,
    income,
    expense,
    netProfit: balance,
    expenseByCategory,
    transactions: periodTransactions,
  };
};

// 生成现金流量表数据
export const generateCashFlowStatement = (transactions, period = 'month') => {
  const periodTransactions = period === 'week'
    ? getThisWeekTransactions(transactions)
    : getThisMonthTransactions(transactions);
  
  const operatingCashIn = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const operatingCashOut = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netCashFlow = operatingCashIn - operatingCashOut;
  
  return {
    period,
    operatingCashIn,
    operatingCashOut,
    netCashFlow,
    transactions: periodTransactions,
  };
};
