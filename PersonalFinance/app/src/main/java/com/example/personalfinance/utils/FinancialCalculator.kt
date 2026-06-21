package com.example.personalfinance.utils

import com.example.personalfinance.data.Account
import com.example.personalfinance.data.Transaction
import java.util.Calendar
import java.util.Date

object FinancialCalculator {
    
    data class BalanceSheetData(
        val assets: Double,
        val liabilities: Double,
        val netWorth: Double
    )
    
    data class IncomeStatementData(
        val income: Double,
        val expense: Double,
        val netProfit: Double,
        val transactionCount: Int
    )
    
    data class CashFlowData(
        val operatingCashIn: Double,
        val operatingCashOut: Double,
        val netCashFlow: Double
    )
    
    fun calculateBalanceSheet(accounts: List<Account>): BalanceSheetData {
        val assets = accounts.filter { it.balance > 0 }.sumOf { it.balance }
        val liabilities = accounts.filter { it.balance < 0 }.sumOf { Math.abs(it.balance) }
        val netWorth = assets - liabilities
        
        return BalanceSheetData(assets, liabilities, netWorth)
    }
    
    fun calculateIncomeStatement(transactions: List<Transaction>, period: String): IncomeStatementData {
        val filteredTransactions = filterByPeriod(transactions, period)
        
        val income = filteredTransactions
            .filter { it.type == "income" }
            .sumOf { it.amount }
        
        val expense = filteredTransactions
            .filter { it.type == "expense" }
            .sumOf { it.amount }
        
        val netProfit = income - expense
        
        return IncomeStatementData(income, expense, netProfit, filteredTransactions.size)
    }
    
    fun calculateCashFlow(transactions: List<Transaction>, period: String): CashFlowData {
        val filteredTransactions = filterByPeriod(transactions, period)
        
        val operatingCashIn = filteredTransactions
            .filter { it.type == "income" }
            .sumOf { it.amount }
        
        val operatingCashOut = filteredTransactions
            .filter { it.type == "expense" }
            .sumOf { it.amount }
        
        val netCashFlow = operatingCashIn - operatingCashOut
        
        return CashFlowData(operatingCashIn, operatingCashOut, netCashFlow)
    }
    
    private fun filterByPeriod(transactions: List<Transaction>, period: String): List<Transaction> {
        val calendar = Calendar.getInstance()
        
        if (period == "week") {
            calendar.set(Calendar.DAY_OF_WEEK, calendar.firstDayOfWeek)
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)
            val weekStart = calendar.timeInMillis
            
            calendar.add(Calendar.WEEK_OF_YEAR, 1)
            val weekEnd = calendar.timeInMillis
            
            return transactions.filter { it.date in weekStart until weekEnd }
        } else {
            calendar.set(Calendar.DAY_OF_MONTH, 1)
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)
            val monthStart = calendar.timeInMillis
            
            calendar.add(Calendar.MONTH, 1)
            val monthEnd = calendar.timeInMillis
            
            return transactions.filter { it.date in monthStart until monthEnd }
        }
    }
}
