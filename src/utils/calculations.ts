import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
import { CalculationInput, CalculationResult } from '../types'

// 配置Decimal.js精度
Decimal.set({ precision: 28, rounding: 4 })

/**
 * Calculate annualized return for spot-futures arbitrage
 */
export function calculateArbitrageReturn(input: CalculationInput): CalculationResult {
  const { 
    futurePrice, 
    spotPrice, 
    currentDate, 
    maturityDate, 
    annualInterestRate, 
    transactionFeeRate,
    investmentAmount,
    depositLossRate,
    withdrawalLossRate,
    leverageRatio
  } = input

  // Calculate holding period in days
  const current = dayjs(currentDate)
  const maturity = dayjs(maturityDate)
  const holdingDays = maturity.diff(current, 'day')

  if (holdingDays <= 0) {
    throw new Error('交割日期必须晚于当前日期')
  }

  if (holdingDays > 365) {
    throw new Error('持有期不能超过365天')
  }

  // For spot-futures arbitrage:
  // 1. Buy spot with full investment amount
  // 2. Sell futures with equivalent value
  
  // Calculate how much spot we can buy with investment amount
  const spotQuantity = investmentAmount.dividedBy(spotPrice)
  
  // Calculate price difference per unit
  const priceDifferencePerUnit = futurePrice.minus(spotPrice)
  
  // Calculate total arbitrage profit
  const totalPriceDifference = priceDifferencePerUnit.times(spotQuantity)

  // Calculate costs based on investment amount
  const holdingCostRate = annualInterestRate.dividedBy(100).times(holdingDays).dividedBy(365)
  const holdingCost = investmentAmount.times(holdingCostRate)

  // Calculate transaction cost based on investment amount
  const totalTransactionFeeRate = transactionFeeRate.dividedBy(100).times(2)
  const transactionCost = investmentAmount.times(totalTransactionFeeRate)

  // Calculate deposit and withdrawal losses based on investment amount
  const depositLoss = depositLossRate ? investmentAmount.times(depositLossRate.dividedBy(100)) : new Decimal(0)
  const withdrawalLoss = withdrawalLossRate ? investmentAmount.times(withdrawalLossRate.dividedBy(100)) : new Decimal(0)

  // Calculate net profit including all costs
  let netProfit = totalPriceDifference.minus(holdingCost).minus(transactionCost).minus(depositLoss).minus(withdrawalLoss)
  
  // Basic calculation without leverage
  let netProfitRate = netProfit.dividedBy(investmentAmount)
  let annualizedReturn = netProfitRate.times(365).dividedBy(holdingDays).times(100)
  let totalReturn = netProfitRate.times(100)
  let actualProfit = netProfit
  let annualizedProfit = investmentAmount.times(annualizedReturn.dividedBy(100))

  // Leverage calculation
  let leverage = undefined
  if (leverageRatio && leverageRatio.gt(0)) {
    // With leverage, we can control more value with same investment as margin
    const leveragedValue = investmentAmount.times(leverageRatio)
    const leveragedSpotQuantity = leveragedValue.dividedBy(spotPrice)
    const marginRequired = investmentAmount // The actual investment is the margin
    
    // Calculate leveraged profit (price difference on leveraged position)
    const leveragedPriceDifference = priceDifferencePerUnit.times(leveragedSpotQuantity)
    
    // Costs remain based on investment amount (not leveraged)
    const leveragedNetProfit = leveragedPriceDifference.minus(holdingCost).minus(transactionCost).minus(depositLoss).minus(withdrawalLoss)
    
    // Calculate liquidation price (when loss equals margin)
    const liquidationPrice = spotPrice.minus(investmentAmount.dividedBy(leveragedSpotQuantity))
    
    leverage = {
      leverageRatio,
      marginRequired,
      contractValue: leveragedValue,
      liquidationPrice,
      leveragedProfit: leveragedNetProfit
    }
    
    // Update profit and returns for leveraged position
    actualProfit = leveragedNetProfit
    netProfitRate = leveragedNetProfit.dividedBy(investmentAmount)
    annualizedReturn = netProfitRate.times(365).dividedBy(holdingDays).times(100)
    totalReturn = netProfitRate.times(100)
    annualizedProfit = investmentAmount.times(annualizedReturn.dividedBy(100))
  }

  // Determine risk level based on return and holding period
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  const returnNumber = annualizedReturn.toNumber()
  const absReturn = Math.abs(returnNumber)
  
  if (leverageRatio && leverageRatio.gt(1)) {
    riskLevel = 'HIGH' // Leverage always increases risk
  } else if (absReturn < 5 || holdingDays > 180) {
    riskLevel = 'LOW'
  } else if (absReturn < 15 || holdingDays > 90) {
    riskLevel = 'MEDIUM'
  } else {
    riskLevel = 'HIGH'
  }

  const result: CalculationResult = {
    annualizedReturn,
    holdingDays,
    totalReturn,
    actualProfit,
    annualizedProfit,
    riskLevel,
    breakdown: {
      priceDifference: totalPriceDifference,
      holdingCost,
      transactionCost,
      ...(depositLoss.gt(0) && { depositLoss }),
      ...(withdrawalLoss.gt(0) && { withdrawalLoss })
    }
  }

  if (leverage) {
    result.leverage = leverage
  }

  return result
}

/**
 * Calculate break-even points
 */
export function calculateBreakEven(input: CalculationInput): {
  breakEvenFuturePrice: Decimal
  breakEvenSpotPrice: Decimal
} {
  const { spotPrice, currentDate, maturityDate, annualInterestRate, transactionFeeRate } = input

  const current = dayjs(currentDate)
  const maturity = dayjs(maturityDate)
  const holdingDays = maturity.diff(current, 'day')

  // Calculate holding cost rate
  const holdingCostRate = annualInterestRate.dividedBy(100).times(holdingDays).dividedBy(365)
  
  // Calculate total transaction fee rate (both directions)
  const totalTransactionFeeRate = transactionFeeRate.dividedBy(100).times(2)
  
  // Break-even future price (given current spot price)
  const breakEvenFuturePrice = spotPrice.times(
    new Decimal(1).plus(holdingCostRate).plus(totalTransactionFeeRate)
  )

  // Break-even spot price (given current future price)
  const breakEvenSpotPrice = spotPrice.dividedBy(
    new Decimal(1).plus(holdingCostRate).plus(totalTransactionFeeRate)
  )

  return {
    breakEvenFuturePrice,
    breakEvenSpotPrice
  }
}

/**
 * Sensitivity analysis for key parameters
 */
export function calculateSensitivity(input: CalculationInput): {
  interestRateSensitivity: Decimal  // 利率敏感性
  timeSensitivity: Decimal          // 时间敏感性
  priceSensitivity: Decimal         // 价格敏感性
} {
  const baseResult = calculateArbitrageReturn(input)
  const baseReturn = baseResult.annualizedReturn

  // Interest rate sensitivity (+1% change)
  const newInterestRate = input.annualInterestRate.plus(1)
  const interestResult = calculateArbitrageReturn({
    ...input,
    annualInterestRate: newInterestRate
  })
  const interestRateSensitivity = interestResult.annualizedReturn.minus(baseReturn)

  // Time sensitivity (-1 day)
  const newMaturityDate = dayjs(input.maturityDate).subtract(1, 'day').format('YYYY-MM-DD')
  const timeResult = calculateArbitrageReturn({
    ...input,
    maturityDate: newMaturityDate
  })
  const timeSensitivity = timeResult.annualizedReturn.minus(baseReturn)

  // Price sensitivity (+1% spot price change)
  const newSpotPrice = input.spotPrice.times(1.01)
  const priceResult = calculateArbitrageReturn({
    ...input,
    spotPrice: newSpotPrice
  })
  const priceSensitivity = priceResult.annualizedReturn.minus(baseReturn)

  return {
    interestRateSensitivity,
    timeSensitivity,
    priceSensitivity
  }
}

/**
 * Validate calculation input
 */
export function validateInput(input: Partial<CalculationInput>): string[] {
  const errors: string[] = []

  if (!input.futurePrice || input.futurePrice.isNaN() || input.futurePrice.lte(0)) {
    errors.push('期货价格必须为正数')
  }

  if (!input.spotPrice || input.spotPrice.isNaN() || input.spotPrice.lte(0)) {
    errors.push('现货价格必须为正数')
  }

  if (!input.currentDate) {
    errors.push('请选择当前日期')
  }

  if (!input.maturityDate) {
    errors.push('请选择交割日期')
  }

  if (input.currentDate && input.maturityDate) {
    const current = dayjs(input.currentDate)
    const maturity = dayjs(input.maturityDate)
    const diffDays = maturity.diff(current, 'day')
    
    if (diffDays <= 0) {
      errors.push('交割日期必须晚于当前日期')
    }
    if (diffDays > 365) {
      errors.push('持有期不能超过365天')
    }
    if (diffDays < 1) {
      errors.push('持有期至少为1天')
    }
  }

  if (!input.annualInterestRate || input.annualInterestRate.isNaN() || input.annualInterestRate.lt(0)) {
    errors.push('年化利率不能为负数')
  }

  if (input.annualInterestRate && input.annualInterestRate.gt(50)) {
    errors.push('年化利率不能超过50%')
  }

  if (!input.transactionFeeRate || input.transactionFeeRate.isNaN() || input.transactionFeeRate.lt(0)) {
    errors.push('交易手续费率不能为负数')
  }

  if (input.transactionFeeRate && input.transactionFeeRate.gt(10)) {
    errors.push('交易手续费率不能超过10%')
  }

  // 逻辑检查
  if (input.futurePrice && input.spotPrice) {
    const priceDiffPercent = input.futurePrice.minus(input.spotPrice)
      .dividedBy(input.spotPrice).times(100).abs()
    
    if (priceDiffPercent.gt(50)) {
      errors.push('期货与现货价格差异过大（超过50%），请检查输入')
    }
  }

  return errors
}

/**
 * Get market condition assessment
 */
export function getMarketCondition(futurePrice: Decimal, spotPrice: Decimal): {
  condition: 'CONTANGO' | 'BACKWARDATION' | 'NEUTRAL'
  premium: Decimal
  premiumPercent: Decimal
} {
  const premium = futurePrice.minus(spotPrice)
  const premiumPercent = premium.dividedBy(spotPrice).times(100)
  
  let condition: 'CONTANGO' | 'BACKWARDATION' | 'NEUTRAL'
  
  if (premiumPercent.gt(0.5)) {
    condition = 'CONTANGO'  // 期货升水
  } else if (premiumPercent.lt(-0.5)) {
    condition = 'BACKWARDATION'  // 期货贴水
  } else {
    condition = 'NEUTRAL'  // 中性
  }

  return {
    condition,
    premium,
    premiumPercent
  }
}