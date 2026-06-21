package com.example.personalfinance.ui.advice

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.personalfinance.FinanceApplication
import com.example.personalfinance.databinding.FragmentAdviceBinding
import com.example.personalfinance.utils.FinancialAdvisor

class AdviceFragment : Fragment() {
    
    private var _binding: FragmentAdviceBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var viewModel: AdviceViewModel
    private var period = "month"
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAdviceBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val repository = (requireActivity().application as FinanceApplication).repository
        val viewModelFactory = AdviceViewModelFactory(repository)
        viewModel = ViewModelProvider(this, viewModelFactory)[AdviceViewModel::class.java]
        
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
        viewModel.adviceData.observe(viewLifecycleOwner) { data ->
            val adviceText = data.advice.joinToString("\n\n") { advice ->
                "${getAdviceIcon(advice.type)} ${advice.title}\n${advice.content}"
            }
            binding.tvAdvice.text = adviceText
            
            binding.tvScore.text = "${data.summary.financialScore}/100"
            binding.tvSavingsRate.text = "${String.format("%.1f", data.summary.savingsRate)}%"
        }
    }
    
    private fun getAdviceIcon(type: String): String {
        return when (type) {
            "success" -> "✓"
            "warning" -> "⚠"
            "error" -> "✗"
            else -> "ℹ"
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
