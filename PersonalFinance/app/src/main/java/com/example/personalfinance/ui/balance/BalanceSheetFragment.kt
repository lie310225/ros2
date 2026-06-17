package com.example.personalfinance.ui.balance

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.personalfinance.FinanceApplication
import com.example.personalfinance.databinding.FragmentBalanceSheetBinding
import com.example.personalfinance.utils.FinancialCalculator

class BalanceSheetFragment : Fragment() {
    
    private var _binding: FragmentBalanceSheetBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var viewModel: BalanceSheetViewModel
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentBalanceSheetBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val repository = (requireActivity().application as FinanceApplication).repository
        val viewModelFactory = BalanceSheetViewModelFactory(repository)
        viewModel = ViewModelProvider(this, viewModelFactory)[BalanceSheetViewModel::class.java]
        
        observeData()
    }
    
    private fun observeData() {
        viewModel.balanceSheetData.observe(viewLifecycleOwner) { data ->
            binding.tvAssets.text = "¥${String.format("%.2f", data.assets)}"
            binding.tvLiabilities.text = "¥${String.format("%.2f", data.liabilities)}"
            binding.tvNetWorth.text = "¥${String.format("%.2f", data.netWorth)}"
            
            val debtRatio = if (data.assets > 0) {
                (data.liabilities / data.assets * 100)
            } else 0.0
            binding.tvDebtRatio.text = "${String.format("%.1f", debtRatio)}%"
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
