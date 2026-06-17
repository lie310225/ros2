package com.example.personalfinance.ui.add

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.personalfinance.FinanceApplication
import com.example.personalfinance.R
import com.example.personalfinance.data.Account
import com.example.personalfinance.data.Transaction
import com.example.personalfinance.databinding.FragmentAddTransactionBinding
import com.google.android.material.chip.Chip
import java.util.*

class AddTransactionFragment : Fragment() {
    
    private var _binding: FragmentAddTransactionBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var viewModel: AddTransactionViewModel
    private var selectedType = "expense"
    private var selectedCategory = ""
    private var selectedAccountId = "cash"
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAddTransactionBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val repository = (requireActivity().application as FinanceApplication).repository
        val viewModelFactory = AddTransactionViewModelFactory(repository)
        viewModel = ViewModelProvider(this, viewModelFactory)[AddTransactionViewModel::class.java]
        
        setupListeners()
        observeAccounts()
    }
    
    private fun setupListeners() {
        binding.toggleGroup.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                selectedType = when (checkedId) {
                    R.id.btn_expense -> "expense"
                    R.id.btn_income -> "income"
                    else -> "expense"
                }
                updateCategoryChips()
            }
        }
        
        binding.btnSave.setOnClickListener {
            saveTransaction()
        }
    }
    
    private fun observeAccounts() {
        viewModel.accounts.observe(viewLifecycleOwner) { accounts ->
            if (accounts.isNotEmpty()) {
                setupAccountChips(accounts)
            }
        }
    }
    
    private fun setupAccountChips(accounts: List<Account>) {
        binding.chipGroupAccounts.removeAllViews()
        accounts.forEach { account ->
            val chip = Chip(requireContext()).apply {
                text = account.name
                isCheckable = true
                isChecked = account.id == selectedAccountId
                setOnCheckedChangeListener { _, isChecked ->
                    if (isChecked) {
                        selectedAccountId = account.id
                    }
                }
            }
            binding.chipGroupAccounts.addView(chip)
        }
    }
    
    private fun updateCategoryChips() {
        binding.chipGroupCategories.removeAllViews()
        val categories = if (selectedType == "expense") {
            listOf("餐饮", "交通", "购物", "住房", "娱乐", "医疗", "教育", "水电费", "其他")
        } else {
            listOf("工资", "奖金", "投资收益", "兼职", "其他")
        }
        
        categories.forEach { category ->
            val chip = Chip(requireContext()).apply {
                text = category
                isCheckable = true
                setOnCheckedChangeListener { _, isChecked ->
                    if (isChecked) {
                        selectedCategory = category
                    }
                }
            }
            binding.chipGroupCategories.addView(chip)
        }
    }
    
    private fun saveTransaction() {
        val amountText = binding.etAmount.text.toString()
        val amount = amountText.toDoubleOrNull()
        
        if (amount == null || amount <= 0) {
            Toast.makeText(requireContext(), "请输入有效金额", Toast.LENGTH_SHORT).show()
            return
        }
        
        if (selectedCategory.isEmpty()) {
            Toast.makeText(requireContext(), "请选择分类", Toast.LENGTH_SHORT).show()
            return
        }
        
        val description = binding.etDescription.text.toString()
        
        val transaction = Transaction(
            type = selectedType,
            amount = amount,
            category = selectedCategory,
            description = description,
            date = System.currentTimeMillis(),
            accountId = selectedAccountId
        )
        
        viewModel.insertTransaction(transaction)
        
        Toast.makeText(requireContext(), "保存成功", Toast.LENGTH_SHORT).show()
        
        // Clear form
        binding.etAmount.text?.clear()
        binding.etDescription.text?.clear()
        selectedCategory = ""
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
