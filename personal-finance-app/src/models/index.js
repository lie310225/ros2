// 数据模型定义

// 交易类型
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

// 交易分类
export const CATEGORIES = {
  INCOME: [
    { id: 'salary', name: '工资', icon: '💼' },
    { id: 'bonus', name: '奖金', icon: '🎁' },
    { id: 'investment', name: '投资收益', icon: '📈' },
    { id: 'parttime', name: '兼职', icon: '💪' },
    { id: 'other_income', name: '其他收入', icon: '💰' },
  ],
  EXPENSE: [
    { id: 'food', name: '餐饮', icon: '🍜' },
    { id: 'transport', name: '交通', icon: '🚗' },
    { id: 'shopping', name: '购物', icon: '🛍️' },
    { id: 'housing', name: '住房', icon: '🏠' },
    { id: 'entertainment', name: '娱乐', icon: '🎮' },
    { id: 'medical', name: '医疗', icon: '🏥' },
    { id: 'education', name: '教育', icon: '📚' },
    { id: 'utilities', name: '水电费', icon: '💡' },
    { id: 'other_expense', name: '其他支出', icon: '💸' },
  ],
};

// 账户类型
export const ACCOUNT_TYPES = {
  CASH: 'cash',
  BANK: 'bank',
  CREDIT: 'credit',
  INVESTMENT: 'investment',
};

// 交易记录
export const createTransaction = (type, amount, category, description, date, accountId) => ({
  id: Date.now().toString(),
  type, // 'income' or 'expense'
  amount: parseFloat(amount),
  category,
  description,
  date: date || new Date().toISOString(),
  accountId: accountId || 'default',
  createdAt: new Date().toISOString(),
});

// 账户
export const createAccount = (name, type, initialBalance = 0) => ({
  id: Date.now().toString(),
  name,
  type,
  balance: parseFloat(initialBalance),
  createdAt: new Date().toISOString(),
});

// 默认账户
export const DEFAULT_ACCOUNTS = [
  { id: 'cash', name: '现金', type: ACCOUNT_TYPES.CASH, balance: 0 },
  { id: 'bank', name: '银行卡', type: ACCOUNT_TYPES.BANK, balance: 0 },
  { id: 'credit', name: '信用卡', type: ACCOUNT_TYPES.CREDIT, balance: 0 },
];
