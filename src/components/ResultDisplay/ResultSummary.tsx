import { Card, Row, Col, Statistic, Tag, Space, Tooltip } from 'antd'
import { TrophyOutlined, InfoCircleOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons'
import { memo, useMemo } from 'react'
import { CalculationResult } from '../../types'
import { 
  formatRiskLevel, 
  getRiskLevelColor,
  getResultTooltip 
} from '../../utils/formatters'

interface ResultSummaryProps {
  result: CalculationResult
}

export const ResultSummary = memo(function ResultSummary({ result }: ResultSummaryProps) {
  const annualizedReturnNumber = useMemo(() => result.annualizedReturn.toNumber(), [result.annualizedReturn])
  const totalReturnNumber = useMemo(() => result.totalReturn.toNumber(), [result.totalReturn])
  const actualProfitNumber = useMemo(() => result.actualProfit.toNumber(), [result.actualProfit])
  const annualizedProfitNumber = useMemo(() => result.annualizedProfit.toNumber(), [result.annualizedProfit])

  return (
    <Card 
      title={
        <Space>
          <TrophyOutlined />
          计算结果
        </Space>
      }
      className="calculation-card"
    >
      <Row gutter={[16, 16]}>
        {/* 年化收益率 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  年化收益率
                  <Tooltip title={getResultTooltip('annualizedReturn')}>
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={Math.abs(annualizedReturnNumber)}
              precision={2}
              suffix="%"
              prefix={annualizedReturnNumber >= 0 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{ 
                color: annualizedReturnNumber >= 0 ? '#3f8600' : '#cf1322',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>

        {/* 年化盈利 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  年化盈利
                  <Tooltip title="按年化收益率计算，如果持有一整年的盈利金额">
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={Math.abs(annualizedProfitNumber)}
              precision={2}
              suffix="元"
              prefix={annualizedProfitNumber >= 0 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{ 
                color: annualizedProfitNumber >= 0 ? '#3f8600' : '#cf1322',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            />
          </Card>
        </Col>

        {/* 实际盈利 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  实际盈利
                  <Tooltip title={`持有${result.holdingDays}天的实际盈利金额`}>
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={Math.abs(actualProfitNumber)}
              precision={2}
              suffix="元"
              prefix={actualProfitNumber >= 0 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{ 
                color: actualProfitNumber >= 0 ? '#3f8600' : '#cf1322',
                fontSize: '18px'
              }}
            />
          </Card>
        </Col>

        {/* 总收益率 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  总收益率
                  <Tooltip title={getResultTooltip('totalReturn')}>
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={Math.abs(totalReturnNumber)}
              precision={2}
              suffix="%"
              prefix={totalReturnNumber >= 0 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{ 
                color: totalReturnNumber >= 0 ? '#3f8600' : '#cf1322',
                fontSize: '20px'
              }}
            />
          </Card>
        </Col>

        {/* 持有天数 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <Statistic
              title={
                <Space>
                  持有天数
                  <Tooltip title={getResultTooltip('holdingDays')}>
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
              value={result.holdingDays}
              suffix="天"
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>

        {/* 风险等级 */}
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="result-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#8c8c8c', fontSize: '14px', marginBottom: '8px' }}>
                <Space>
                  风险等级
                  <Tooltip title={getResultTooltip('riskLevel')}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              </div>
              <Tag 
                color={getRiskLevelColor(result.riskLevel)}
                style={{ 
                  fontSize: '16px', 
                  padding: '4px 12px',
                  fontWeight: 'bold'
                }}
              >
                {formatRiskLevel(result.riskLevel)}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 收益评估 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card size="small" title="收益评估">
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              {annualizedReturnNumber > 0 ? (
                <div>
                  <span style={{ color: '#3f8600', fontSize: '16px' }}>
                    ✓ 预期盈利套利机会
                  </span>
                  <div style={{ color: '#8c8c8c', marginTop: 4 }}>
                    在当前参数下，该套利策略预期能够获得正收益
                  </div>
                </div>
              ) : (
                <div>
                  <span style={{ color: '#cf1322', fontSize: '16px' }}>
                    ✗ 预期亏损，不建议执行
                  </span>
                  <div style={{ color: '#8c8c8c', marginTop: 4 }}>
                    在当前参数下，该套利策略预期将产生亏损
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  )
})