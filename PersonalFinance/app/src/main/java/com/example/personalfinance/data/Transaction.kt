package com.example.personalfinance.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val type: String, // "income" or "expense"
    val amount: Double,
    val category: String,
    val description: String,
    val date: Long, // timestamp
    val accountId: String,
    val createdAt: Long = System.currentTimeMillis()
)
