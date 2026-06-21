package com.example.personalfinance.ui.balance

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.liveData
import androidx.lifecycle.switchMap
import com.example.personalfinance.data.Account
import com.example.personalfinance.data.Repository
import com.example.personalfinance.utils.FinancialCalculator

class BalanceSheetViewModel(private val repository: Repository) : ViewModel() {
    
    val balanceSheetData: LiveData<FinancialCalculator.BalanceSheetData> = repository.allAccounts.switchMap { accounts ->
        liveData {
            val data = FinancialCalculator.calculateBalanceSheet(accounts)
            emit(data)
        }
    }
}

class BalanceSheetViewModelFactory(private val repository: Repository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(BalanceSheetViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return BalanceSheetViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
