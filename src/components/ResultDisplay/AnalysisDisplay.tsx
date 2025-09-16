import { Card, Row, Col, Descriptions, Tag, Space, Tooltip, Alert } from 'antd'
import { BarChartOutlined, InfoCircleOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons'
import { AnalysisResult } from '../../types'
import { 
  formatCurrency, 
  formatSensitivity,
  formatMarketCondition,
  getMarketConditionColor,
  getResultTooltip
} from '../../utils/formatters'

interface AnalysisDisplayProps {
  analysisResult: AnalysisResult
}

export function AnalysisDisplay({ analysisResult }: AnalysisDisplayProps) {
  const { breakEven, sensitivity, marketCondition } = analysisResult

  const getSensitivityIcon = (value: number) => {
    return value >= 0 ? <RiseOutlined /> : <FallOutlined />
  }

  const getSensitivityColor = (value: number) => {
    return value >= 0 ? '#3f8600' : '#cf1322'
  }

  return (
    <Row gutter={[16, 16]}>
      {/* 市场状况分析 */}
      <Col xs={24} lg={8}>
        <Card 
          title={
            <Space>
              <BarChartOutlined />
              市场状况
            </Space>
          }
          className="calculation-card"
          size="small"
        >
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Tag 
              color={getMarketConditionColor(marketCondition.condition)}
              style={{ 
                fontSize: '16px', 
                padding: '6px 16px',
                fontWeight: 'bold'
              }}
            >
              {formatMarketCondition(marketCondition.condition)}
            </Tag>
          </div>
          
          <Descriptions column={1} size="small">
            <Descriptions.Item label="价差">
              {formatCurrency(marketCondition.premium)}
            </Descriptions.Item>
            <Descriptions.Item label="价差率">
              {formatSensitivity(marketCondition.premiumPercent)}
            </Descriptions.Item>
          </Descriptions>

          {marketCondition.condition === 'CONTANGO' && (
            <Alert
              message="期货升水"
              description="期货价格高于现货价格，适合做空套利"
              type="info"
              showIcon
              style={{ marginTop: 12 }}
            />
          )}
          
          {marketCondition.condition === 'BACKWARDATION' && (
            <Alert
              message="期货贴水"
              description="期货价格低于现货价格，适合做多套利"
              type="success"
              showIcon
              style={{ marginTop: 12 }}
            />
          )}
        </Card>
      </Col>

      {/* 盈亏平衡分析 */}
      <Col xs={24} lg={8}>
        <Card 
          title={
            <Space>
              平衡点分析
              <Tooltip title={getResultTooltip('breakEvenFuturePrice')}>
                <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
              </Tooltip>
            </Space>
          }
          className="calculation-card"
          size="small"
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item label="盈亏平衡期货价">
              {formatCurrency(breakEven.breakEvenFuturePrice)}
            </Descriptions.Item>
            <Descriptions.Item label="盈亏平衡现货价">
              {formatCurrency(breakEven.breakEvenSpotPrice)}
            </Descriptions.Item>
          </Descriptions>
          
          <Alert
            message="盈亏平衡说明"
            description="当期货价格达到盈亏平衡点时，套利收益为零"
            type="info"
            showIcon
            style={{ marginTop: 12 }}
          />
        </Card>
      </Col>

      {/* 敏感性分析 */}
      <Col xs={24} lg={8}>
        <Card 
          title="敏感性分析"
          className="calculation-card"
          size="small"
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item 
              label={
                <Space>
                  利率敏感性
                  <Tooltip title="利率上升1%对年化收益率的影响">
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
            >
              <Space>
                {getSensitivityIcon(sensitivity.interestRateSensitivity.toNumber())}
                <span style={{ color: getSensitivityColor(sensitivity.interestRateSensitivity.toNumber()) }}>
                  {formatSensitivity(sensitivity.interestRateSensitivity)}
                </span>
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  时间敏感性
                  <Tooltip title="持有期减少1天对年化收益率的影响">
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
            >
              <Space>
                {getSensitivityIcon(sensitivity.timeSensitivity.toNumber())}
                <span style={{ color: getSensitivityColor(sensitivity.timeSensitivity.toNumber()) }}>
                  {formatSensitivity(sensitivity.timeSensitivity)}
                </span>
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={
                <Space>
                  价格敏感性
                  <Tooltip title="现货价格上升1%对年化收益率的影响">
                    <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                </Space>
              }
            >
              <Space>
                {getSensitivityIcon(sensitivity.priceSensitivity.toNumber())}
                <span style={{ color: getSensitivityColor(sensitivity.priceSensitivity.toNumber()) }}>
                  {formatSensitivity(sensitivity.priceSensitivity)}
                </span>
              </Space>
            </Descriptions.Item>
          </Descriptions>
          
          <Alert
            message="敏感性提示"
            description="数值表示参数变化1单位时对年化收益率的影响"
            type="info"
            showIcon
            style={{ marginTop: 12 }}
          />
        </Card>
      </Col>
    </Row>
  )
}