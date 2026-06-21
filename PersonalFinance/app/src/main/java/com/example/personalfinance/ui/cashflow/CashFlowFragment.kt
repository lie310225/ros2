package com.example.personalfinance.ui.cashflow

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.personalfinance.FinanceApplication
import com.example.personalfinance.databinding.FragmentCashFlowBinding
import com.example.personalfinance.utils.FinancialCalculator

class CashFlowFragment : Fragment() {
    
    private var _binding: FragmentCashFlowBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var viewModel: CashFlowViewModel
    private var period = "month"
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCashFlowBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val repository = (requireActivity().application as FinanceApplication).repository
        val viewModelFactory = CashFlowViewModelFactory(repository)
        viewModel = ViewModelProvider(this, viewModelFactory)[CashFlowViewModel::class.java]
        
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
        viewModel.cashFlowData.observe(viewLifecycleOwner) { data ->
            binding.tvCashIn.text = "¥${String.format("%.2f", data.operatingCashIn)}"
            binding.tvCashOut.text = "¥${String.format("%.2f", data.operatingCashOut)}"
            binding.tvNetCashFlow.text = "¥${String.format("%.2f", data.netCashFlow)}"
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
