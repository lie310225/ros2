package com.example.personalfinance.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "accounts")
data class Account(
    @PrimaryKey
    val id: String,
    val name: String,
    val type: String,
    val balance: Double = 0.0,
    val createdAt: Long = System.currentTimeMillis()
)
