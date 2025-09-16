import { Decimal } from 'decimal.js'
import dayjs from 'dayjs'

/**
 * Format number to percentage with specified decimal places
 */
export function formatPercentage(value: Decimal | number, decimalPlaces: number = 2): string {
  const decimal = value instanceof Decimal ? value : new Decimal(value)
  return `${decimal.toFixed(decimalPlaces)}%`
}

/**
 * Format number to currency with specified decimal places
 */
export function formatCurrency(value: Decimal | number, decimalPlaces: number = 2, currency: string = '¥'): string {
  const decimal = value instanceof Decimal ? value : new Decimal(value)
  const formatted = formatNumber(decimal, decimalPlaces)
  return `${currency}${formatted}`
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value: Decimal | number, decimalPlaces: number = 2): string {
  const decimal = value instanceof Decimal ? value : new Decimal(value)
  const number = decimal.toFixed(decimalPlaces)
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format large numbers with units (K, M, B)
 */
export function formatLargeNumber(value: Decimal | number, decimalPlaces: number = 1): string {
  const decimal = value instanceof Decimal ? value : new Decimal(value)
  const num = decimal.toNumber()
  
  if (Math.abs(num) >= 1000000000) {
    return `${(num / 1000000000).toFixed(decimalPlaces)}B`
  } else if (Math.abs(num) >= 1000000) {
    return `${(num / 1000000).toFixed(decimalPlaces)}M`
  } else if (Math.abs(num) >= 1000) {
    return `${(num / 1000).toFixed(decimalPlaces)}K`
  } else {
    return num.toFixed(decimalPlaces)
  }
}

/**
 * Format risk level to Chinese text
 */
export function formatRiskLevel(level: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  const levelMap = {
    LOW: '低风险',
    MEDIUM: '中等风险',
    HIGH: '高风险'
  }
  return levelMap[level]
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(level: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  const colorMap = {
    LOW: '#52c41a',
    MEDIUM: '#faad14',
    HIGH: '#f5222d'
  }
  return colorMap[level]
}

/**
 * Format market condition to Chinese text
 */
export function formatMarketCondition(condition: 'CONTANGO' | 'BACKWARDATION' | 'NEUTRAL'): string {
  const conditionMap = {
    CONTANGO: '期货升水',
    BACKWARDATION: '期货贴水',
    NEUTRAL: '价格中性'
  }
  return conditionMap[condition]
}

/**
 * Get market condition color
 */
export function getMarketConditionColor(condition: 'CONTANGO' | 'BACKWARDATION' | 'NEUTRAL'): string {
  const colorMap = {
    CONTANGO: '#f5222d',    // 红色 - 升水
    BACKWARDATION: '#52c41a', // 绿色 - 贴水 
    NEUTRAL: '#1890ff'      // 蓝色 - 中性
  }
  return colorMap[condition]
}

/**
 * Parse string to Decimal with validation
 */
export function parseDecimal(value: string): Decimal | null {
  if (!value || value.trim() === '') {
    return null
  }
  
  try {
    const decimal = new Decimal(value)
    return decimal.isFinite() ? decimal : null
  } catch {
    return null
  }
}

/**
 * Format date to display format
 */
export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

/**
 * Format date range
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const days = end.diff(start, 'day')
  
  return `${formatDate(startDate)} 至 ${formatDate(endDate)} (${days}天)`
}

/**
 * Format sensitivity value with direction indicator
 */
export function formatSensitivity(value: Decimal | number, decimalPlaces: number = 2): string {
  const decimal = value instanceof Decimal ? value : new Decimal(value)
  const formatted = decimal.toFixed(decimalPlaces)
  const sign = decimal.gt(0) ? '+' : ''
  
  return `${sign}${formatted}%`
}

/**
 * Format calculation breakdown for display
 */
export function formatCalculationBreakdown(breakdown: {
  priceDifference: Decimal
  holdingCost: Decimal
  transactionCost: Decimal
}, spotPrice: Decimal) {
  const priceSpread = formatCurrency(breakdown.priceDifference)
  const priceSpreadPercent = formatPercentage(breakdown.priceDifference.dividedBy(spotPrice).times(100))
  
  const holdingCostAmount = formatCurrency(breakdown.holdingCost)
  const holdingCostPercent = formatPercentage(breakdown.holdingCost.dividedBy(spotPrice).times(100))
  
  const transactionCostAmount = formatCurrency(breakdown.transactionCost)
  const transactionCostPercent = formatPercentage(breakdown.transactionCost.dividedBy(spotPrice).times(100))
  
  return {
    priceSpread: {
      amount: priceSpread,
      percent: priceSpreadPercent,
      label: '价差收益'
    },
    holdingCost: {
      amount: holdingCostAmount,
      percent: holdingCostPercent,
      label: '持有成本'
    },
    transactionCost: {
      amount: transactionCostAmount,
      percent: transactionCostPercent,
      label: '交易成本'
    }
  }
}

/**
 * Format calculation summary for quick view
 */
export function formatCalculationSummary(result: any) {
  return {
    annualizedReturn: formatPercentage(result.annualizedReturn),
    totalReturn: formatPercentage(result.totalReturn),
    holdingDays: `${result.holdingDays}天`,
    riskLevel: formatRiskLevel(result.riskLevel),
    riskColor: getRiskLevelColor(result.riskLevel)
  }
}

/**
 * Format number input value (remove invalid characters)
 */
export function formatNumberInput(value: string): string {
  // Remove any non-numeric characters except decimal point
  return value.replace(/[^\d.-]/g, '')
}

/**
 * Format percentage input value
 */
export function formatPercentageInput(value: string): string {
  // Remove any non-numeric characters except decimal point
  let formatted = value.replace(/[^\d.]/g, '')
  
  // Ensure only one decimal point
  const parts = formatted.split('.')
  if (parts.length > 2) {
    formatted = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit to reasonable range
  const num = parseFloat(formatted)
  if (!isNaN(num) && num > 100) {
    formatted = '100'
  }
  
  return formatted
}

/**
 * Format price input value
 */
export function formatPriceInput(value: string): string {
  // Remove any non-numeric characters except decimal point
  let formatted = value.replace(/[^\d.]/g, '')
  
  // Ensure only one decimal point
  const parts = formatted.split('.')
  if (parts.length > 2) {
    formatted = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit decimal places to 4
  if (parts.length === 2 && parts[1].length > 4) {
    formatted = parts[0] + '.' + parts[1].substring(0, 4)
  }
  
  return formatted
}

/**
 * Get formatted tooltip text for result explanation
 */
export function getResultTooltip(field: string): string {
  const tooltips: Record<string, string> = {
    annualizedReturn: '年化收益率 = (净收益率 × 365 ÷ 持有天数) × 100%',
    totalReturn: '总收益率 = 净收益率 × 100%',
    holdingDays: '持有天数 = 交割日期 - 当前日期',
    riskLevel: '风险等级基于收益率大小和持有期长短综合评估',
    priceDifference: '价差 = 期货价格 - 现货价格',
    holdingCost: '持有成本 = 现货价格 × 年化利率 × 持有天数 ÷ 365',
    transactionCost: '交易成本 = 现货价格 × 手续费率 × 2（买入+卖出）',
    breakEvenFuturePrice: '盈亏平衡期货价格 = 现货价格 × (1 + 持有成本率 + 交易费率)',
    marketCondition: '升水/贴水根据期货与现货的价格关系判断'
  }
  
  return tooltips[field] || ''
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: string | Error): string {
  if (typeof error === 'string') {
    return error
  }
  
  // Handle specific error types
  if (error.message.includes('Invalid decimal')) {
    return '输入的数值格式不正确，请检查输入'
  }
  
  if (error.message.includes('date')) {
    return '日期格式不正确，请重新选择日期'
  }
  
  return error.message || '计算过程中发生未知错误'
}

/**
 * Generate export data format
 */
export function generateExportData(formData: any, result: any) {
  return {
    计算时间: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    期货价格: formData.futurePrice,
    现货价格: formData.spotPrice,
    当前日期: formData.currentDate,
    交割日期: formData.maturityDate,
    持有天数: result.holdingDays,
    年化利率: `${formData.annualInterestRate}%`,
    交易手续费率: `${formData.transactionFeeRate}%`,
    年化收益率: formatPercentage(result.annualizedReturn),
    总收益率: formatPercentage(result.totalReturn),
    风险等级: formatRiskLevel(result.riskLevel),
    价差收益: formatCurrency(result.breakdown.priceDifference),
    持有成本: formatCurrency(result.breakdown.holdingCost),
    交易成本: formatCurrency(result.breakdown.transactionCost)
  }
}