package com.example.personalfinance.ui.income

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.liveData
import androidx.lifecycle.switchMap
import com.example.personalfinance.data.Repository
import com.example.personalfinance.utils.FinancialCalculator

class IncomeStatementViewModel(private val repository: Repository) : ViewModel() {
    
    private val period = MutableLiveData("month")
    
    val incomeStatementData: LiveData<FinancialCalculator.IncomeStatementData> = period.switchMap { p ->
        repository.allTransactions.switchMap { transactions ->
            liveData {
                val data = FinancialCalculator.calculateIncomeStatement(transactions, p)
                emit(data)
            }
        }
    }
    
    fun setPeriod(newPeriod: String) {
        period.value = newPeriod
    }
}

class IncomeStatementViewModelFactory(private val repository: Repository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(IncomeStatementViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return IncomeStatementViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
