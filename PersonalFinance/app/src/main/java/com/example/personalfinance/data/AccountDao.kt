package com.example.personalfinance.data

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update

@Dao
interface AccountDao {
    @Query("SELECT * FROM accounts")
    fun getAllAccounts(): LiveData<List<Account>>
    
    @Query("SELECT * FROM accounts WHERE id = :id")
    suspend fun getAccountById(id: String): Account?
    
    @Insert
    suspend fun insert(account: Account)
    
    @Update
    suspend fun update(account: Account)
    
    @Query("UPDATE accounts SET balance = :balance WHERE id = :accountId")
    suspend fun updateBalance(accountId: String, balance: Double)
}
