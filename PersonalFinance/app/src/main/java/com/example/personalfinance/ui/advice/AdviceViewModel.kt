package com.example.personalfinance.ui.advice

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.liveData
import androidx.lifecycle.switchMap
import com.example.personalfinance.data.Repository
import com.example.personalfinance.utils.FinancialAdvisor

class AdviceViewModel(private val repository: Repository) : ViewModel() {
    
    private val period = MutableLiveData("month")
    
    val adviceData: LiveData<FinancialAdvisor.AdviceResult> = period.switchMap { p ->
        repository.allTransactions.switchMap { transactions ->
            liveData {
                val data = if (p == "week") {
                    FinancialAdvisor.generateWeeklyAdvice(transactions)
                } else {
                    FinancialAdvisor.generateMonthlyAdvice(transactions)
                }
                emit(data)
            }
        }
    }
    
    fun setPeriod(newPeriod: String) {
        period.value = newPeriod
    }
}

class AdviceViewModelFactory(private val repository: Repository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AdviceViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AdviceViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
