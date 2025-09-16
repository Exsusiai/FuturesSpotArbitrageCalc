import { Card, Row, Col, Statistic, Alert, Space, Tooltip, Divider } from 'antd'
import { WarningOutlined, InfoCircleOutlined, DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { memo } from 'react'
import { CalculationResult } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface LeverageInfoProps {
  result: CalculationResult
  spotPrice: string
}

export const LeverageInfo = memo(function LeverageInfo({ result, spotPrice }: LeverageInfoProps) {
  if (!result.leverage) {
    return null
  }

  const { leverageRatio, marginRequired, contractValue, liquidationPrice, leveragedProfit } = result.leverage
  
  // 计算爆仓风险等级
  const spotPriceNumber = parseFloat(spotPrice)
  const liquidationPriceNumber = liquidationPrice.toNumber()
  const priceBuffer = Math.abs((spotPriceNumber - liquidationPriceNumber) / spotPriceNumber * 100)
  
  let riskColor: string
  let riskText: string
  
  if (priceBuffer > 20) {
    riskColor = '#52c41a'
    riskText = '风险较低'
  } else if (priceBuffer > 10) {
    riskColor = '#faad14'
    riskText = '风险中等'
  } else {
    riskColor = '#ff4d4f'
    riskText = '风险较高'
  }

  return (
    <Card 
      title={
        <Space>
          <DollarOutlined />
          杠杆交易信息
        </Space>
      }
      className="calculation-card"
    >
      {/* 风险警告 */}
      <Alert
        message="杠杆交易风险提醒"
        description="杠杆交易能够放大收益，同时也会放大亏损。请严格控制风险，合理设置止损。"
        type="warning"
        icon={<ExclamationCircleOutlined />}
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Row gutter={[16, 16]}>
        {/* 杠杆倍数 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  杠杆倍数
                  <Tooltip title="当前使用的杠杆倍数">
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={leverageRatio.toNumber()}
              precision={1}
              suffix="倍"
              valueStyle={{ 
                color: '#1890ff',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>

        {/* 所需保证金 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  所需保证金
                  <Tooltip title="开仓所需的保证金金额">
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={marginRequired.toNumber()}
              precision={2}
              suffix="元"
              valueStyle={{ 
                color: '#722ed1',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>

        {/* 爆仓价格 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  爆仓价格
                  <Tooltip title="触发强制平仓的价格水平">
                    <WarningOutlined style={{ color: '#ff4d4f' }} />
                  </Tooltip>
                </Space>
              }
              value={liquidationPriceNumber}
              precision={2}
              suffix="元"
              valueStyle={{ 
                color: riskColor,
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>

        {/* 合约价值 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  控制合约价值
                  <Tooltip title="杠杆后能够控制的合约总价值">
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={contractValue.toNumber()}
              precision={2}
              suffix="元"
              valueStyle={{ 
                color: '#1890ff',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>

        {/* 杠杆盈利 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  杠杆盈利
                  <Tooltip title="使用杠杆后的实际盈利金额">
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={Math.abs(leveragedProfit.toNumber())}
              precision={2}
              suffix="元"
              valueStyle={{ 
                color: leveragedProfit.gte(0) ? '#3f8600' : '#cf1322',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 风险分析 */}
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="small">
              <div>
                <span style={{ color: '#8c8c8c' }}>爆仓风险评估：</span>
                <span style={{ color: riskColor, fontWeight: 'bold', marginLeft: 8 }}>
                  {riskText}
                </span>
              </div>
              <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                当前价格距离爆仓价格 {priceBuffer.toFixed(1)}%
              </div>
              <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                建议设置止损价格：{formatCurrency(liquidationPrice.times(1.1))} - {formatCurrency(liquidationPrice.times(1.2))}
              </div>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  )
})