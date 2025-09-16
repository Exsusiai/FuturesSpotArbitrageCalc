import { Card, Row, Col, Progress, Space, Tooltip, Descriptions, Alert } from 'antd'
import { PieChartOutlined, InfoCircleOutlined, DollarOutlined } from '@ant-design/icons'
import { memo, useMemo } from 'react'
import { CalculationResult } from '../../types'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import { parseDecimal } from '../../utils/formatters'

interface CostBreakdownProps {
  result: CalculationResult
  spotPrice: string
}

export const CostBreakdown = memo(function CostBreakdown({ result, spotPrice }: CostBreakdownProps) {
  const spotPriceDecimal = useMemo(() => parseDecimal(spotPrice), [spotPrice])
  
  const { breakdown } = result
  const { priceDifference, holdingCost, transactionCost, depositLoss, withdrawalLoss } = breakdown

  // 计算所有成本项目的绝对值总和用于百分比计算
  const totalAbsoluteCosts = useMemo(() => {
    let total = Math.abs(holdingCost.toNumber()) + Math.abs(transactionCost.toNumber())
    if (depositLoss) total += Math.abs(depositLoss.toNumber())
    if (withdrawalLoss) total += Math.abs(withdrawalLoss.toNumber())
    return total
  }, [holdingCost, transactionCost, depositLoss, withdrawalLoss])

  const costItems = useMemo(() => {
    const items = [
      {
        label: '持有成本',
        value: holdingCost,
        color: '#faad14',
        tooltip: '资金持有期间的利息成本'
      },
      {
        label: '交易成本',
        value: transactionCost,
        color: '#f5222d',
        tooltip: '买入和卖出的手续费成本'
      }
    ]

    if (depositLoss && depositLoss.gt(0)) {
      items.push({
        label: '入金磨损',
        value: depositLoss,
        color: '#722ed1',
        tooltip: '入金过程中产生的磨损费用'
      })
    }

    if (withdrawalLoss && withdrawalLoss.gt(0)) {
      items.push({
        label: '出金磨损',
        value: withdrawalLoss,
        color: '#13c2c2',
        tooltip: '出金过程中产生的磨损费用'
      })
    }

    return items
  }, [holdingCost, transactionCost, depositLoss, withdrawalLoss])

  if (!spotPriceDecimal) return null

  return (
    <Card 
      title={
        <Space>
          <PieChartOutlined />
          成本构成分析
        </Space>
      }
      className="calculation-card"
    >
      <Row gutter={[16, 16]}>
        {/* 价差收益 */}
        <Col xs={24} md={depositLoss || withdrawalLoss ? 8 : 12}>
          <Card size="small" title={
            <Space>
              价差收益
              <Tooltip title="期货价格与现货价格的差额">
                <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
              </Tooltip>
            </Space>
          }>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div className="result-value" style={{ color: '#1890ff' }}>
                {formatCurrency(priceDifference)}
              </div>
              <div className="result-label">
                {formatPercentage(priceDifference.dividedBy(spotPriceDecimal).times(100))}
              </div>
            </div>
          </Card>
        </Col>

        {/* 成本项目 */}
        {costItems.map((item, index) => (
          <Col xs={24} md={depositLoss || withdrawalLoss ? 8 : 12} key={index}>
            <Card size="small" title={
              <Space>
                {item.label}
                <Tooltip title={item.tooltip}>
                  <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                </Tooltip>
              </Space>
            }>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div className="result-value" style={{ color: item.color }}>
                  -{formatCurrency(item.value)}
                </div>
                <div className="result-label">
                  -{formatPercentage(item.value.dividedBy(spotPriceDecimal).times(100))}
                </div>
              </div>
              <Progress 
                percent={totalAbsoluteCosts > 0 ? (Math.abs(item.value.toNumber()) / totalAbsoluteCosts * 100) : 0}
                strokeColor={item.color}
                showInfo={false}
                size="small"
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 详细计算过程 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card size="small" title={
            <Space>
              计算详情
              {result.leverage && (
                <Space>
                  <DollarOutlined />
                  <span style={{ fontSize: '12px', color: '#1890ff' }}>含杠杆计算</span>
                </Space>
              )}
            </Space>
          }>
            {result.leverage && (
              <Alert
                message="杠杆模式计算说明"
                description="以下计算基于杠杆交易模式，价差收益已按杠杆倍数放大，但资金成本仍按实际投入资金计算。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            
            <Descriptions column={1} size="small" bordered>
              {result.leverage ? (
                <>
                  <Descriptions.Item label="投入资金">
                    {formatCurrency(result.leverage.marginRequired)}（作为保证金）
                  </Descriptions.Item>
                  <Descriptions.Item label="控制合约价值">
                    投入资金 × 杠杆倍数 = {formatCurrency(result.leverage.marginRequired)} × {result.leverage.leverageRatio.toNumber()} = {formatCurrency(result.leverage.contractValue)}
                  </Descriptions.Item>
                  <Descriptions.Item label="杠杆价差收益">
                    (期货价格 - 现货价格) × 杠杆合约数量 = {formatCurrency(priceDifference)}
                  </Descriptions.Item>
                </>
              ) : (
                <Descriptions.Item label="价差收益">
                  (期货价格 - 现货价格) × 合约数量 = {formatCurrency(priceDifference)}
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label="持有成本">
                投入资金 × 年化利率 × 持有天数 ÷ 365 = {formatCurrency(holdingCost)}
              </Descriptions.Item>
              <Descriptions.Item label="交易成本">
                投入资金 × 手续费率 × 2（双边） = {formatCurrency(transactionCost)}
              </Descriptions.Item>
              {depositLoss && depositLoss.gt(0) && (
                <Descriptions.Item label="入金磨损">
                  投入资金 × 入金磨损率 = {formatCurrency(depositLoss)}
                </Descriptions.Item>
              )}
              {withdrawalLoss && withdrawalLoss.gt(0) && (
                <Descriptions.Item label="出金磨损">
                  投入资金 × 出金磨损率 = {formatCurrency(withdrawalLoss)}
                </Descriptions.Item>
              )}
              <Descriptions.Item label={result.leverage ? "杠杆净收益" : "净收益"}>
                {formatCurrency(priceDifference)} - {formatCurrency(holdingCost)} - {formatCurrency(transactionCost)}
                {depositLoss && depositLoss.gt(0) && ` - ${formatCurrency(depositLoss)}`}
                {withdrawalLoss && withdrawalLoss.gt(0) && ` - ${formatCurrency(withdrawalLoss)}`}
                {' = '}
                {formatCurrency(result.actualProfit)}
              </Descriptions.Item>
              
              {result.leverage && (
                <Descriptions.Item label="爆仓价格">
                  当现货价格跌至 {formatCurrency(result.leverage.liquidationPrice)} 时将被强制平仓
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Card>
  )
})