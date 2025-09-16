import { Card, Row, Col, Progress, Space, Tooltip, Descriptions } from 'antd'
import { PieChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { memo, useMemo } from 'react'
import { CalculationResult } from '../../types'
import { 
  formatCurrency, 
  formatCalculationBreakdown,
  getResultTooltip
} from '../../utils/formatters'
import { parseDecimal } from '../../utils/formatters'

interface ResultBreakdownProps {
  result: CalculationResult
  spotPrice: string
}

export const ResultBreakdown = memo(function ResultBreakdown({ result, spotPrice }: ResultBreakdownProps) {
  const spotPriceDecimal = useMemo(() => parseDecimal(spotPrice), [spotPrice])
  
  const breakdown = useMemo(() => {
    if (!spotPriceDecimal) return null
    return formatCalculationBreakdown(result.breakdown, spotPriceDecimal)
  }, [result.breakdown, spotPriceDecimal])
  
  // Calculate percentages for progress bars
  const percentages = useMemo(() => {
    const totalAbsoluteImpact = Math.abs(result.breakdown.priceDifference.toNumber()) + 
                                Math.abs(result.breakdown.holdingCost.toNumber()) + 
                                Math.abs(result.breakdown.transactionCost.toNumber())

    return {
      priceSpread: Math.abs(result.breakdown.priceDifference.toNumber()) / totalAbsoluteImpact * 100,
      holdingCost: Math.abs(result.breakdown.holdingCost.toNumber()) / totalAbsoluteImpact * 100,
      transactionCost: Math.abs(result.breakdown.transactionCost.toNumber()) / totalAbsoluteImpact * 100
    }
  }, [result.breakdown])

  if (!spotPriceDecimal || !breakdown) return null

  return (
    <Card 
      title={
        <Space>
          <PieChartOutlined />
          收益构成分析
        </Space>
      }
      className="calculation-card"
    >
      <Row gutter={[16, 16]}>
        {/* 价差收益 */}
        <Col xs={24} md={8}>
          <Card size="small" title={
            <Space>
              {breakdown.priceSpread.label}
              <Tooltip title={getResultTooltip('priceDifference')}>
                <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
              </Tooltip>
            </Space>
          }>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div className="result-value" style={{ color: '#1890ff' }}>
                {breakdown.priceSpread.amount}
              </div>
              <div className="result-label">
                {breakdown.priceSpread.percent}
              </div>
            </div>
            <Progress 
              percent={percentages.priceSpread}
              strokeColor="#1890ff"
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 持有成本 */}
        <Col xs={24} md={8}>
          <Card size="small" title={
            <Space>
              {breakdown.holdingCost.label}
              <Tooltip title={getResultTooltip('holdingCost')}>
                <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
              </Tooltip>
            </Space>
          }>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div className="result-value" style={{ color: '#faad14' }}>
                -{breakdown.holdingCost.amount}
              </div>
              <div className="result-label">
                -{breakdown.holdingCost.percent}
              </div>
            </div>
            <Progress 
              percent={percentages.holdingCost}
              strokeColor="#faad14"
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 交易成本 */}
        <Col xs={24} md={8}>
          <Card size="small" title={
            <Space>
              {breakdown.transactionCost.label}
              <Tooltip title={getResultTooltip('transactionCost')}>
                <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
              </Tooltip>
            </Space>
          }>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div className="result-value" style={{ color: '#f5222d' }}>
                -{breakdown.transactionCost.amount}
              </div>
              <div className="result-label">
                -{breakdown.transactionCost.percent}
              </div>
            </div>
            <Progress 
              percent={percentages.transactionCost}
              strokeColor="#f5222d"
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 详细计算过程 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card size="small" title="计算详情">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="价差收益">
                期货价格 - 现货价格 = {breakdown.priceSpread.amount}
              </Descriptions.Item>
              <Descriptions.Item label="持有成本">
                现货价格 × 年化利率 × 持有天数 ÷ 365 = {breakdown.holdingCost.amount}
              </Descriptions.Item>
              <Descriptions.Item label="交易成本">
                现货价格 × 手续费率 × 2（双边） = {breakdown.transactionCost.amount}
              </Descriptions.Item>
              <Descriptions.Item label="净收益">
                {breakdown.priceSpread.amount} - {breakdown.holdingCost.amount} - {breakdown.transactionCost.amount} = {formatCurrency(
                  result.breakdown.priceDifference
                    .minus(result.breakdown.holdingCost)
                    .minus(result.breakdown.transactionCost)
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Card>
  )
})