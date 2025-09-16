import { Space } from 'antd'
import { CalculationResult, AnalysisResult } from '../../types'
import { ResultSummary } from './ResultSummary'
import { CostBreakdown } from './CostBreakdown'
import { LeverageInfo } from './LeverageInfo'
import { AnalysisDisplay } from './AnalysisDisplay'

interface ResultDisplayProps {
  result: CalculationResult
  analysisResult?: AnalysisResult | null
  spotPrice: string
}

export function ResultDisplay({ result, analysisResult, spotPrice }: ResultDisplayProps) {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 核心结果摘要 */}
      <ResultSummary result={result} />
      
      {/* 成本构成分析（包含出入金磨损） */}
      <CostBreakdown result={result} spotPrice={spotPrice} />
      
      {/* 杠杆交易信息 */}
      {result.leverage && (
        <LeverageInfo result={result} spotPrice={spotPrice} />
      )}
      
      {/* 高级分析 */}
      {analysisResult && (
        <AnalysisDisplay analysisResult={analysisResult} />
      )}
    </Space>
  )
}