package com.example.personalfinance.ui.cashflow

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.liveData
import androidx.lifecycle.switchMap
import com.example.personalfinance.data.Repository
import com.example.personalfinance.utils.FinancialCalculator

class CashFlowViewModel(private val repository: Repository) : ViewModel() {
    
    private val period = MutableLiveData("month")
    
    val cashFlowData: LiveData<FinancialCalculator.CashFlowData> = period.switchMap { p ->
        repository.allTransactions.switchMap { transactions ->
            liveData {
                val data = FinancialCalculator.calculateCashFlow(transactions, p)
                emit(data)
            }
        }
    }
    
    fun setPeriod(newPeriod: String) {
        period.value = newPeriod
    }
}

class CashFlowViewModelFactory(private val repository: Repository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CashFlowViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return CashFlowViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
