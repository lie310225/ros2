package com.example.personalfinance

import android.app.Application
import com.example.personalfinance.data.AppDatabase
import com.example.personalfinance.data.Repository
import com.jakewharton.threetenabp.AndroidThreeTen

class FinanceApplication : Application() {
    
    val database: AppDatabase by lazy { AppDatabase.getInstance(this) }
    val repository: Repository by lazy { Repository(database.transactionDao(), database.accountDao()) }
    
    override fun onCreate() {
        super.onCreate()
        AndroidThreeTen.init(this)
    }
}
