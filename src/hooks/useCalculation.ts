import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { CalculationInput, CalculationResult, FormData, AnalysisResult } from '../types'
import { 
  calculateArbitrageReturn, 
  validateInput, 
  calculateBreakEven, 
  calculateSensitivity, 
  getMarketCondition 
} from '../utils/calculations'
import { parseDecimal } from '../utils/formatters'
import { validateCompleteForm, debounce } from '../utils/validation'

export function useCalculation() {
  const [formData, setFormData] = useState<FormData>({
    investmentAmount: '',
    futurePrice: '',
    spotPrice: '',
    currentDate: '',
    maturityDate: '',
    annualInterestRate: '',
    transactionFeeRate: '',
    enableDepositWithdrawalLoss: false,
    enableLeverage: false,
    depositLossRate: '',
    withdrawalLossRate: '',
    leverageRatio: ''
  })
  
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [hasCalculatedOnce, setHasCalculatedOnce] = useState(false) // 追踪是否已经手动计算过
  
  // 使用 ref 来跟踪上次计算的输入，避免重复计算
  const lastCalculationInputRef = useRef<string>('')

  // Convert form data to calculation input
  const calculationInput = useMemo((): CalculationInput | null => {
    const investmentAmount = parseDecimal(formData.investmentAmount)
    const futurePrice = parseDecimal(formData.futurePrice)
    const spotPrice = parseDecimal(formData.spotPrice)
    const annualInterestRate = parseDecimal(formData.annualInterestRate)
    const transactionFeeRate = parseDecimal(formData.transactionFeeRate)

    if (!investmentAmount || !futurePrice || !spotPrice || !annualInterestRate || !transactionFeeRate || 
        !formData.currentDate || !formData.maturityDate) {
      return null
    }

    // Optional parameters - only if enabled
    const depositLossRate = formData.enableDepositWithdrawalLoss && formData.depositLossRate ? 
      parseDecimal(formData.depositLossRate) || undefined : undefined
    const withdrawalLossRate = formData.enableDepositWithdrawalLoss && formData.withdrawalLossRate ? 
      parseDecimal(formData.withdrawalLossRate) || undefined : undefined
    const leverageRatio = formData.enableLeverage && formData.leverageRatio ? 
      parseDecimal(formData.leverageRatio) || undefined : undefined

    return {
      investmentAmount,
      futurePrice,
      spotPrice,
      currentDate: formData.currentDate,
      maturityDate: formData.maturityDate,
      annualInterestRate,
      transactionFeeRate,
      depositLossRate,
      withdrawalLossRate,
      leverageRatio
    }
  }, [formData])

  // Real-time form validation
  const formValidation = useMemo(() => {
    return validateCompleteForm(formData)
  }, [formData])

  // Debounced validation function
  const debouncedValidation = useMemo(
    () => debounce((data: FormData) => {
      const validation = validateCompleteForm(data)
      // 只有在已经计算过一次后才显示错误
      if (hasCalculatedOnce) {
        setErrors(validation.errors)
        setWarnings(validation.warnings)
      }
    }, 300),
    [hasCalculatedOnce]
  )

  // Update form field
  const updateField = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Bulk update form data
  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }, [])

  // Calculate result with full analysis
  const calculate = useCallback(async () => {
    if (!calculationInput) {
      setErrors(['请填写所有必填字段'])
      return
    }

    setLoading(true)
    setErrors([])
    setWarnings([])
    setHasCalculatedOnce(true) // 标记为已经手动计算过

    try {
      // Validate input
      const validationErrors = validateInput(calculationInput)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setResult(null)
        setAnalysisResult(null)
        return
      }

      // Simulate async calculation
      await new Promise(resolve => setTimeout(resolve, 150))

      // Calculate basic result
      const calculationResult = calculateArbitrageReturn(calculationInput)
      setResult(calculationResult)

      // Calculate additional analysis
      const breakEven = calculateBreakEven(calculationInput)
      const sensitivity = calculateSensitivity(calculationInput)
      const marketCondition = getMarketCondition(calculationInput.futurePrice, calculationInput.spotPrice)

      const fullAnalysis: AnalysisResult = {
        ...calculationResult,
        breakEven,
        sensitivity,
        marketCondition
      }

      setAnalysisResult(fullAnalysis)

      // Generate warnings based on results
      const resultWarnings: string[] = []
      
      if (Math.abs(calculationResult.annualizedReturn.toNumber()) > 30) {
        resultWarnings.push('收益率异常高，请仔细检查输入参数')
      }
      
      if (calculationResult.holdingDays < 7) {
        resultWarnings.push('持有期较短，交易成本对收益率影响较大')
      }
      
      if (marketCondition.premiumPercent.abs().gt(10)) {
        resultWarnings.push('期货与现货价差较大，请注意市场风险')
      }

      setWarnings(resultWarnings)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '计算发生错误'
      setErrors([errorMessage])
      setResult(null)
      setAnalysisResult(null)
    } finally {
      setLoading(false)
    }
  }, [calculationInput])

  // Reset form and results
  const reset = useCallback(() => {
    setFormData({
      investmentAmount: '',
      futurePrice: '',
      spotPrice: '',
      currentDate: '',
      maturityDate: '',
      annualInterestRate: '',
      transactionFeeRate: '',
      enableDepositWithdrawalLoss: false,
      enableLeverage: false,
      depositLossRate: '',
      withdrawalLossRate: '',
      leverageRatio: ''
    })
    setResult(null)
    setAnalysisResult(null)
    setErrors([])
    setWarnings([])
    setValidationErrors({})
    setHasCalculatedOnce(false) // 重置计算状态
    lastCalculationInputRef.current = ''
  }, [])

  // Load example data
  const loadExample = useCallback(() => {
    const today = new Date()
    const maturity = new Date(today)
    maturity.setMonth(maturity.getMonth() + 3) // 3 months later

    setFormData({
      investmentAmount: '100000',  // 示例：10万投入
      futurePrice: '3050',
      spotPrice: '3000',
      currentDate: today.toISOString().split('T')[0],
      maturityDate: maturity.toISOString().split('T')[0],
      annualInterestRate: '3.5',
      transactionFeeRate: '0.05',
      enableDepositWithdrawalLoss: true,  // 启用出入金磨损
      enableLeverage: true,  // 启用杠杆
      depositLossRate: '0.1',  // 示例：0.1%入金磨损
      withdrawalLossRate: '0.1',  // 示例：0.1%出金磨损
      leverageRatio: '3'  // 示例：3倍杠杆
    })
  }, [])

  // Check if form is valid for calculation
  const isValidForCalculation = useMemo(() => {
    return calculationInput !== null && formValidation.isValid
  }, [calculationInput, formValidation.isValid])

  // Check if form has any data
  const hasAnyData = useMemo(() => {
    return Object.values(formData).some(value => value !== '')
  }, [formData])

  // Real-time validation effect
  useEffect(() => {
    if (hasAnyData) {
      debouncedValidation(formData)
    }
  }, [formData, hasAnyData, debouncedValidation])

  // Auto-calculate effect (when form is complete and valid, and user has calculated once)
  useEffect(() => {
    if (isValidForCalculation && !loading && calculationInput && hasCalculatedOnce) {
      // 创建当前输入的唯一标识符
      const currentInputKey = JSON.stringify(calculationInput)
      
      // 只有当输入确实发生变化时才重新计算
      if (currentInputKey !== lastCalculationInputRef.current) {
        const timer = setTimeout(async () => {
          lastCalculationInputRef.current = currentInputKey
          await calculate()
        }, 500) // Delay to avoid too frequent calculations

        return () => clearTimeout(timer)
      }
    }
  }, [isValidForCalculation, loading, calculationInput, hasCalculatedOnce, calculate])

  return {
    // Form data
    formData,
    updateField,
    updateFormData,
    
    // Results
    result,
    analysisResult,
    
    // Validation
    errors,
    warnings,
    validationErrors,
    isValidForCalculation,
    
    // Status
    loading,
    hasAnyData,
    
    // Actions
    calculate,
    reset,
    loadExample,
    
    // Computed values
    formValidation
  }
}