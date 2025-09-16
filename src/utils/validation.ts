import { Decimal } from 'decimal.js'
import dayjs from 'dayjs'

/**
 * Validation rules for form inputs
 */
export const validationRules = {
  required: (value: any) => value !== undefined && value !== null && value !== '',
  
  positive: (value: string | Decimal) => {
    if (typeof value === 'string') {
      const num = parseFloat(value)
      return !isNaN(num) && num > 0
    }
    return value.gt(0)
  },
  
  nonNegative: (value: string | Decimal) => {
    if (typeof value === 'string') {
      const num = parseFloat(value)
      return !isNaN(num) && num >= 0
    }
    return value.gte(0)
  },
  
  percentage: (value: string) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= 0 && num <= 100
  },
  
  dateAfter: (date1: string, date2: string) => {
    return dayjs(date1).isAfter(dayjs(date2))
  },
  
  maxHoldingPeriod: (startDate: string, endDate: string, maxDays: number = 365) => {
    const days = dayjs(endDate).diff(dayjs(startDate), 'day')
    return days <= maxDays
  }
}

/**
 * Enhanced field validation with specific rules for arbitrage calculation
 */
export interface FieldValidationRule {
  field: string
  value: any
  rules: ValidationRuleName[]
  customMessage?: string
}

export type ValidationRuleName = 'required' | 'positive' | 'nonNegative' | 'percentage' | 'validPrice' | 'validDate' | 'validRate'

/**
 * Validate a single field with enhanced rules
 */
export function validateField(field: string, value: any, rules: ValidationRuleName[]): string[] {
  const errors: string[] = []
  
  for (const rule of rules) {
    const error = validateSingleRule(field, value, rule)
    if (error) {
      errors.push(error)
    }
  }
  
  return errors
}

/**
 * Validate individual rule
 */
function validateSingleRule(field: string, value: any, rule: ValidationRuleName): string | null {
  switch (rule) {
    case 'required':
      if (!value || value === '') {
        return getFieldErrorMessage(field, 'required')
      }
      break
      
    case 'positive':
      if (value !== '' && (!isValidNumber(value) || parseFloat(value) <= 0)) {
        return getFieldErrorMessage(field, 'positive')
      }
      break
      
    case 'nonNegative':
      if (value !== '' && (!isValidNumber(value) || parseFloat(value) < 0)) {
        return getFieldErrorMessage(field, 'nonNegative')
      }
      break
      
    case 'percentage':
      if (value !== '' && (!isValidNumber(value) || parseFloat(value) < 0 || parseFloat(value) > 100)) {
        return getFieldErrorMessage(field, 'percentage')
      }
      break
      
    case 'validPrice':
      if (value !== '' && (!isValidNumber(value) || parseFloat(value) <= 0 || parseFloat(value) > 1000000)) {
        return getFieldErrorMessage(field, 'validPrice')
      }
      break
      
    case 'validDate':
      if (value !== '' && !dayjs(value).isValid()) {
        return getFieldErrorMessage(field, 'validDate')
      }
      break
      
    case 'validRate':
      if (value !== '' && (!isValidNumber(value) || parseFloat(value) < 0 || parseFloat(value) > 50)) {
        return getFieldErrorMessage(field, 'validRate')
      }
      break
  }
  
  return null
}

/**
 * Check if value is a valid number
 */
function isValidNumber(value: any): boolean {
  if (typeof value === 'string') {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value))
  }
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Get field-specific error messages
 */
function getFieldErrorMessage(field: string, rule: ValidationRuleName): string {
  const fieldNames: Record<string, string> = {
    investmentAmount: '投入资金',
    futurePrice: '期货价格',
    spotPrice: '现货价格',
    currentDate: '当前日期',
    maturityDate: '交割日期',
    annualInterestRate: '年化利率',
    transactionFeeRate: '交易手续费率',
    depositLossRate: '入金磨损率',
    withdrawalLossRate: '出金磨损率',
    leverageRatio: '杠杆倍数'
  }
  
  const fieldName = fieldNames[field] || field
  
  const messages: Record<ValidationRuleName, string> = {
    required: `请输入${fieldName}`,
    positive: `${fieldName}必须大于0`,
    nonNegative: `${fieldName}不能为负数`,
    percentage: `${fieldName}必须在0-100之间`,
    validPrice: `${fieldName}必须为有效价格（0-1,000,000）`,
    validDate: `请选择有效的${fieldName}`,
    validRate: `${fieldName}必须在0-50%之间`
  }
  
  return messages[rule]
}

/**
 * Validate form data relationships
 */
export function validateFormRelationships(formData: any): string[] {
  const errors: string[] = []
  
  // Date validation
  if (formData.currentDate && formData.maturityDate) {
    const current = dayjs(formData.currentDate)
    const maturity = dayjs(formData.maturityDate)
    
    if (!maturity.isAfter(current)) {
      errors.push('交割日期必须晚于当前日期')
    }
    
    const diffDays = maturity.diff(current, 'day')
    if (diffDays > 365) {
      errors.push('持有期不能超过365天')
    }
    
    if (diffDays < 1) {
      errors.push('持有期至少为1天')
    }
  }
  
  // Price validation
  if (formData.futurePrice && formData.spotPrice) {
    const futurePrice = parseFloat(formData.futurePrice)
    const spotPrice = parseFloat(formData.spotPrice)
    
    if (!isNaN(futurePrice) && !isNaN(spotPrice)) {
      const priceDiffPercent = Math.abs((futurePrice - spotPrice) / spotPrice * 100)
      
      if (priceDiffPercent > 50) {
        errors.push('期货与现货价格差异过大（超过50%），请检查输入')
      }
    }
  }
  
  // Rate validation
  if (formData.annualInterestRate && formData.transactionFeeRate) {
    const interestRate = parseFloat(formData.annualInterestRate)
    const feeRate = parseFloat(formData.transactionFeeRate)
    
    if (!isNaN(interestRate) && !isNaN(feeRate)) {
      if (interestRate + feeRate * 2 > 30) {
        errors.push('总成本率（利率 + 双边手续费）过高，请检查输入')
      }
    }
  }
  
  return errors
}

/**
 * Real-time validation for individual field
 */
export function validateFieldRealTime(field: string, value: any): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Field-specific validation
  switch (field) {
    case 'investmentAmount':
      errors.push(...validateField(field, value, ['positive', 'validPrice']))
      
      if (value && parseFloat(value) < 1000) {
        warnings.push('投入资金较少，可能影响收益计算精度')
      } else if (value && parseFloat(value) > 10000000) {
        warnings.push('投入资金较大，请确认输入正确')
      }
      break
      
    case 'futurePrice':
    case 'spotPrice':
      const fieldErrors = validateField(field, value, ['positive', 'validPrice'])
      errors.push(...fieldErrors)
      
      if (value && parseFloat(value) > 100000) {
        warnings.push(`${field === 'futurePrice' ? '期货' : '现货'}价格较高，请确认输入正确`)
      }
      break
      
    case 'annualInterestRate':
      errors.push(...validateField(field, value, ['nonNegative', 'validRate']))
      
      if (value && parseFloat(value) > 10) {
        warnings.push('年化利率较高，请确认输入正确')
      }
      break
      
    case 'transactionFeeRate':
      errors.push(...validateField(field, value, ['nonNegative', 'percentage']))
      
      if (value && parseFloat(value) > 1) {
        warnings.push('交易手续费率较高，请确认输入正确')
      }
      break
      
    case 'currentDate':
    case 'maturityDate':
      errors.push(...validateField(field, value, ['validDate']))
      
      if (field === 'maturityDate' && value) {
        const today = dayjs()
        const selectedDate = dayjs(value)
        
        if (selectedDate.diff(today, 'day') > 180) {
          warnings.push('交割期较长，请注意市场风险')
        }
      }
      break
      
    case 'depositLossRate':
    case 'withdrawalLossRate':
      if (value && value !== '') {
        errors.push(...validateField(field, value, ['nonNegative', 'percentage']))
        
        if (value && parseFloat(value) > 5) {
          warnings.push(`${field === 'depositLossRate' ? '入金' : '出金'}磨损率较高，请确认输入正确`)
        }
      }
      break
      
    case 'leverageRatio':
      if (value && value !== '') {
        if (!isValidNumber(value) || parseFloat(value) <= 0) {
          errors.push('杠杆倍数必须大于0')
        } else if (parseFloat(value) > 100) {
          errors.push('杠杆倍数不能超过100倍')
        } else if (parseFloat(value) > 10) {
          warnings.push('高杠杆风险极大，请谨慎操作')
        } else if (parseFloat(value) > 5) {
          warnings.push('杠杆倍数较高，请注意风险控制')
        }
      }
      break
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Debounce function for form validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Validate complete form before calculation
 */
export function validateCompleteForm(formData: any): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required field validation
  const requiredFields = ['investmentAmount', 'futurePrice', 'spotPrice', 'currentDate', 'maturityDate', 'annualInterestRate', 'transactionFeeRate']
  
  for (const field of requiredFields) {
    if (!formData[field] || formData[field] === '') {
      errors.push(getFieldErrorMessage(field, 'required'))
    }
  }
  
  // Individual field validation
  for (const field of requiredFields) {
    if (formData[field]) {
      const { errors: fieldErrors, warnings: fieldWarnings } = validateFieldRealTime(field, formData[field])
      errors.push(...fieldErrors)
      warnings.push(...fieldWarnings)
    }
  }
  
  // Relationship validation
  const relationshipErrors = validateFormRelationships(formData)
  errors.push(...relationshipErrors)
  
  return {
    isValid: errors.length === 0,
    errors: [...new Set(errors)], // Remove duplicates
    warnings: [...new Set(warnings)] // Remove duplicates
  }
}