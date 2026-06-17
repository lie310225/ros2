package com.example.personalfinance.ui.add

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.personalfinance.data.Account
import com.example.personalfinance.data.Repository
import com.example.personalfinance.data.Transaction
import kotlinx.coroutines.launch

class AddTransactionViewModel(private val repository: Repository) : ViewModel() {
    
    val accounts: LiveData<List<Account>> = repository.allAccounts
    
    fun insertTransaction(transaction: Transaction) = viewModelScope.launch {
        repository.insertTransaction(transaction)
        
        // Update account balance
        val account = repository.getAccountById(transaction.accountId)
        if (account != null) {
            val newBalance = if (transaction.type == "income") {
                account.balance + transaction.amount
            } else {
                account.balance - transaction.amount
            }
            repository.updateAccountBalance(transaction.accountId, newBalance)
        }
    }
}

class AddTransactionViewModelFactory(private val repository: Repository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AddTransactionViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AddTransactionViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
