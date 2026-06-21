package com.example.personalfinance.utils

import com.example.personalfinance.data.Transaction

object FinancialAdvisor {
    
    data class AdviceItem(
        val type: String,
        val title: String,
        val content: String
    )
    
    data class AdviceSummary(
        val income: Double,
        val expense: Double,
        val balance: Double,
        val savingsRate: Double,
        val financialScore: Int
    )
    
    data class AdviceResult(
        val summary: AdviceSummary,
        val advice: List<AdviceItem>
    )
    
    fun generateWeeklyAdvice(transactions: List<Transaction>): AdviceResult {
        val weekTransactions = filterByWeek(transactions)
        return generateAdvice(weekTransactions, "本周")
    }
    
    fun generateMonthlyAdvice(transactions: List<Transaction>): AdviceResult {
        val monthTransactions = filterByMonth(transactions)
        return generateAdvice(monthTransactions, "本月")
    }
    
    private fun generateAdvice(transactions: List<Transaction>, periodLabel: String): AdviceResult {
        val income = transactions.filter { it.type == "income" }.sumOf { it.amount }
        val expense = transactions.filter { it.type == "expense" }.sumOf { it.amount }
        val balance = income - expense
        val savingsRate = if (income > 0) (balance / income) * 100 else 0.0
        
        val adviceList = mutableListOf<AdviceItem>()
        
        // 储蓄率评估
        when {
            savingsRate >= 30 -> adviceList.add(
                AdviceItem("success", "储蓄率优秀", "${periodLabel}储蓄率 ${String.format("%.1f", savingsRate)}%，达到财务健康标准（建议 ≥30%）。")
            )
            savingsRate >= 10 -> adviceList.add(
                AdviceItem("info", "储蓄率良好", "${periodLabel}储蓄率 ${String.format("%.1f", savingsRate)}%，建议提升至 30% 以加速财富积累。")
            )
            savingsRate > 0 -> adviceList.add(
                AdviceItem("warning", "储蓄率偏低", "${periodLabel}储蓄率仅 ${String.format("%.1f", savingsRate)}%，建议审视支出结构，减少非必要开支。")
            )
            balance < 0 -> adviceList.add(
                AdviceItem("error", "入不敷出", "${periodLabel}支出超出收入 ¥${String.format("%.2f", Math.abs(balance))}，需立即调整消费习惯。")
            )
        }
        
        // 支出集中度分析
        val expenseByCategory = transactions
            .filter { it.type == "expense" }
            .groupBy { it.category }
            .mapValues { it.value.sumOf { t -> t.amount } }
            .toList()
            .sortedByDescending { it.second }
        
        if (expenseByCategory.isNotEmpty()) {
            val top3Total = expenseByCategory.take(3).sumOf { it.second }
            val top3Ratio = if (expense > 0) (top3Total / expense) * 100 else 0.0
            
            if (top3Ratio > 70) {
                adviceList.add(
                    AdviceItem("warning", "支出过于集中", "前三大支出类别占比 ${String.format("%.1f", top3Ratio)}%，建议优化支出结构，避免风险集中。")
                )
            }
            
            expenseByCategory.take(3).forEach { (category, amount) ->
                val ratio = if (expense > 0) (amount / expense) * 100 else 0.0
                if (ratio > 30) {
                    adviceList.add(
                        AdviceItem("info", "${category}支出占比高", ""${category}" 占总支出 ${String.format("%.1f", ratio)}%，可考虑寻找替代方案或优化消费习惯。")
                    )
                }
            }
        }
        
        // 记账习惯评估
        val uniqueDays = transactions.map { it.date }.distinct().size
        val daysInPeriod = if (periodLabel == "本周") 7 else 30
        val recordingRate = (uniqueDays.toDouble() / daysInPeriod) * 100
        
        when {
            recordingRate < 50 -> adviceList.add(
                AdviceItem("warning", "记账频率偏低", "${periodLabel}仅 ${uniqueDays} 天有记账记录（${String.format("%.0f", recordingRate)}%），建议养成每日记账习惯。")
            )
            recordingRate >= 80 -> adviceList.add(
                AdviceItem("success", "记账习惯优秀", "${periodLabel}${uniqueDays} 天有记账记录，覆盖率 ${String.format("%.0f", recordingRate)}%，继续保持！")
            )
        }
        
        // 财务健康评分
        var score = 100
        if (savingsRate < 10) score -= 30
        else if (savingsRate < 20) score -= 15
        
        if (recordingRate < 50) score -= 20
        
        score = maxOf(0, score)
        
        val summary = AdviceSummary(income, expense, balance, savingsRate, score)
        
        return AdviceResult(summary, adviceList)
    }
    
    private fun filterByWeek(transactions: List<Transaction>): List<Transaction> {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.DAY_OF_WEEK, calendar.firstDayOfWeek)
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
        calendar.set(java.util.Calendar.MINUTE, 0)
        calendar.set(java.util.Calendar.SECOND, 0)
        calendar.set(java.util.Calendar.MILLISECOND, 0)
        val weekStart = calendar.timeInMillis
        
        calendar.add(java.util.Calendar.WEEK_OF_YEAR, 1)
        val weekEnd = calendar.timeInMillis
        
        return transactions.filter { it.date in weekStart until weekEnd }
    }
    
    private fun filterByMonth(transactions: List<Transaction>): List<Transaction> {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.DAY_OF_MONTH, 1)
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
        calendar.set(java.util.Calendar.MINUTE, 0)
        calendar.set(java.util.Calendar.SECOND, 0)
        calendar.set(java.util.Calendar.MILLISECOND, 0)
        val monthStart = calendar.timeInMillis
        
        calendar.add(java.util.Calendar.MONTH, 1)
        val monthEnd = calendar.timeInMillis
        
        return transactions.filter { it.date in monthStart until monthEnd }
    }
}
