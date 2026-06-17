package com.example.personalfinance.ui.income

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.personalfinance.FinanceApplication
import com.example.personalfinance.databinding.FragmentIncomeStatementBinding
import com.example.personalfinance.utils.FinancialCalculator

class IncomeStatementFragment : Fragment() {
    
    private var _binding: FragmentIncomeStatementBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var viewModel: IncomeStatementViewModel
    private var period = "month"
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentIncomeStatementBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val repository = (requireActivity().application as FinanceApplication).repository
        val viewModelFactory = IncomeStatementViewModelFactory(repository)
        viewModel = ViewModelProvider(this, viewModelFactory)[IncomeStatementViewModel::class.java]
        
        setupListeners()
        observeData()
    }
    
    private fun setupListeners() {
        binding.toggleGroupPeriod.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                period = when (checkedId) {
                    com.example.personalfinance.R.id.btn_week -> "week"
                    com.example.personalfinance.R.id.btn_month -> "month"
                    else -> "month"
                }
                viewModel.setPeriod(period)
            }
        }
    }
    
    private fun observeData() {
        viewModel.incomeStatementData.observe(viewLifecycleOwner) { data ->
            binding.tvIncome.text = "¥${String.format("%.2f", data.income)}"
            binding.tvExpense.text = "¥${String.format("%.2f", data.expense)}"
            binding.tvNetProfit.text = "¥${String.format("%.2f", data.netProfit)}"
            
            val savingsRate = if (data.income > 0) {
                (data.netProfit / data.income * 100)
            } else 0.0
            binding.tvSavingsRate.text = "${String.format("%.1f", savingsRate)}%"
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
