import { Decimal } from 'decimal.js'

export interface CalculationInput {
  futurePrice: Decimal
  spotPrice: Decimal
  currentDate: string
  maturityDate: string
  annualInterestRate: Decimal
  transactionFeeRate: Decimal
  investmentAmount: Decimal  // 投入资金
  depositLossRate?: Decimal  // 入金磨损率
  withdrawalLossRate?: Decimal  // 出金磨损率
  leverageRatio?: Decimal  // 杠杆倍数
}

export interface CalculationResult {
  annualizedReturn: Decimal
  holdingDays: number
  totalReturn: Decimal
  actualProfit: Decimal  // 持有期实际盈利金额
  annualizedProfit: Decimal  // 年化盈利金额（假设持有一年）
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  breakdown: {
    priceDifference: Decimal
    holdingCost: Decimal
    transactionCost: Decimal
    depositLoss?: Decimal  // 入金磨损
    withdrawalLoss?: Decimal  // 出金磨损
  }
  leverage?: {
    leverageRatio: Decimal
    marginRequired: Decimal  // 所需保证金
    contractValue: Decimal   // 合约价值
    liquidationPrice: Decimal  // 爆仓价格
    leveragedProfit: Decimal  // 杠杆后实际盈利
  }
}

export interface FormData {
  investmentAmount: string  // 投入资金
  futurePrice: string
  spotPrice: string
  currentDate: string
  maturityDate: string
  annualInterestRate: string
  transactionFeeRate: string
  // 高级选项开关
  enableDepositWithdrawalLoss: boolean  // 是否启用出入金磨损计算
  enableLeverage: boolean  // 是否启用杠杆计算
  // 高级选项参数
  depositLossRate: string  // 入金磨损率
  withdrawalLossRate: string  // 出金磨损率
  leverageRatio: string  // 杠杆倍数
}

export interface BreakEvenAnalysis {
  breakEvenFuturePrice: Decimal
  breakEvenSpotPrice: Decimal
}

export interface SensitivityAnalysis {
  interestRateSensitivity: Decimal
  timeSensitivity: Decimal
  priceSensitivity: Decimal
}

export interface MarketCondition {
  condition: 'CONTANGO' | 'BACKWARDATION' | 'NEUTRAL'
  premium: Decimal
  premiumPercent: Decimal
}

export interface AnalysisResult extends CalculationResult {
  breakEven: BreakEvenAnalysis
  sensitivity: SensitivityAnalysis
  marketCondition: MarketCondition
}