package com.example.personalfinance.data

import androidx.lifecycle.LiveData

class Repository(private val transactionDao: TransactionDao, private val accountDao: AccountDao) {
    
    val allTransactions: LiveData<List<Transaction>> = transactionDao.getAllTransactions()
    val allAccounts: LiveData<List<Account>> = accountDao.getAllAccounts()
    
    fun getTransactionsByDateRange(startDate: Long, endDate: Long): LiveData<List<Transaction>> {
        return transactionDao.getTransactionsByDateRange(startDate, endDate)
    }
    
    fun getTransactionsByType(type: String): LiveData<List<Transaction>> {
        return transactionDao.getTransactionsByType(type)
    }
    
    suspend fun insertTransaction(transaction: Transaction) {
        transactionDao.insert(transaction)
    }
    
    suspend fun deleteTransaction(id: Long) {
        transactionDao.deleteById(id)
    }
    
    suspend fun getAccountById(id: String): Account? {
        return accountDao.getAccountById(id)
    }
    
    suspend fun updateAccountBalance(accountId: String, balance: Double) {
        accountDao.updateBalance(accountId, balance)
    }
    
    suspend fun insertAccount(account: Account) {
        accountDao.insert(account)
    }
}
