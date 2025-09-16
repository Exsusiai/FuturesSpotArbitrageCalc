import { Form, Input, DatePicker, Button, Card, Row, Col, Space, Tooltip, Alert, Switch, Collapse } from 'antd'
import { InfoCircleOutlined, CalculatorOutlined, ReloadOutlined, BulbOutlined, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { FormData } from '../../types'
import { formatPriceInput, formatPercentageInput } from '../../utils/formatters'
import { validateFieldRealTime } from '../../utils/validation'

interface InputFormProps {
  formData: FormData
  updateField: (field: keyof FormData, value: string | boolean) => void
  onCalculate: () => void
  onReset: () => void
  onLoadExample: () => void
  loading: boolean
  errors: string[]
  warnings: string[]
  isValidForCalculation: boolean
}

export function InputForm({
  formData,
  updateField,
  onCalculate,
  onReset,
  onLoadExample,
  loading,
  errors,
  warnings,
  isValidForCalculation
}: InputFormProps) {

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    if (typeof value === 'boolean') {
      updateField(field, value)
      return
    }

    let formattedValue = value as string

    // Format input based on field type
    if (field === 'investmentAmount' || field === 'futurePrice' || field === 'spotPrice') {
      formattedValue = formatPriceInput(value as string)
    } else if (field === 'annualInterestRate' || field === 'transactionFeeRate' || 
               field === 'depositLossRate' || field === 'withdrawalLossRate') {
      formattedValue = formatPercentageInput(value as string)
    } else if (field === 'leverageRatio') {
      // 杠杆倍数只保留数字和小数点
      formattedValue = (value as string).replace(/[^\d.]/g, '')
    }

    updateField(field, formattedValue)
  }

  const getFieldValidationStatus = (field: keyof FormData) => {
    const validation = validateFieldRealTime(field, formData[field])
    return {
      validateStatus: (validation.isValid ? undefined : 'error') as 'error' | undefined,
      help: validation.errors.length > 0 ? validation.errors[0] : undefined
    }
  }

  return (
    <Card 
      title={
        <Space>
          <CalculatorOutlined />
          参数输入
        </Space>
      }
      className="calculation-card"
      extra={
        <Space>
          <Tooltip title="载入示例数据">
            <Button 
              icon={<BulbOutlined />} 
              onClick={onLoadExample}
              size="small"
            >
              示例
            </Button>
          </Tooltip>
          <Tooltip title="清空所有输入">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={onReset}
              size="small"
            >
              重置
            </Button>
          </Tooltip>
        </Space>
      }
    >
      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert
          message="输入错误"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Warning Messages */}
      {warnings.length > 0 && (
        <Alert
          message="注意事项"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical" size="large">
        {/* Investment Amount Section */}
        <div className="form-section">
          <div className="form-section-title">投入资金</div>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={
                  <Space>
                    投入资金
                    <Tooltip title="单次套利交易的投入资金总额">
                      <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Space>
                }
                {...getFieldValidationStatus('investmentAmount')}
              >
                <Input
                  value={formData.investmentAmount}
                  onChange={(e) => handleFieldChange('investmentAmount', e.target.value)}
                  placeholder="请输入投入资金"
                  suffix="元"
                  autoComplete="off"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Price Section */}
        <div className="form-section">
          <div className="form-section-title">价格参数</div>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Space>
                    期货价格
                    <Tooltip title="当前期货合约的市场价格">
                      <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Space>
                }
                {...getFieldValidationStatus('futurePrice')}
              >
                <Input
                  value={formData.futurePrice}
                  onChange={(e) => handleFieldChange('futurePrice', e.target.value)}
                  placeholder="请输入期货价格"
                  suffix="元"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Space>
                    现货价格
                    <Tooltip title="预期交割时的现货市场价格">
                      <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Space>
                }
                {...getFieldValidationStatus('spotPrice')}
              >
                <Input
                  value={formData.spotPrice}
                  onChange={(e) => handleFieldChange('spotPrice', e.target.value)}
                  placeholder="请输入现货价格"
                  suffix="元"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Date Section */}
        <div className="form-section">
          <div className="form-section-title">时间参数</div>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Space>
                    当前日期
                    <Tooltip title="建立套利头寸的日期">
                      <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Space>
                }
                {...getFieldValidationStatus('currentDate')}
              >
                <DatePicker
                  value={formData.currentDate ? dayjs(formData.currentDate) : null}
                  onChange={(date) => handleFieldChange('currentDate', date ? date.format('YYYY-MM-DD') : '')}
                  placeholder="选择当前日期"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Space>
                    交割日期
                    <Tooltip title="期货合约的交割日期">
                      <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Space>
                }
                {...getFieldValidationStatus('maturityDate')}
              >
                <DatePicker
                  value={formData.maturityDate ? dayjs(formData.maturityDate) : null}
                  onChange={(date) => handleFieldChange('maturityDate', date ? date.format('YYYY-MM-DD') : '')}
                  placeholder="选择交割日期"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current.isBefore(dayjs(formData.currentDate))}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Cost Section */}
        <div className="form-section">
          <div className="form-section-title">成本参数</div>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Space>
                    年化利率
                    <Tooltip title="资金成本的年化利率（%）">
                      <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Space>
                }
                {...getFieldValidationStatus('annualInterestRate')}
              >
                <Input
                  value={formData.annualInterestRate}
                  onChange={(e) => handleFieldChange('annualInterestRate', e.target.value)}
                  placeholder="请输入年化利率"
                  suffix="%"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Space>
                    交易手续费率
                    <Tooltip title="单边交易手续费率（%），实际成本为双边">
                      <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Space>
                }
                {...getFieldValidationStatus('transactionFeeRate')}
              >
                <Input
                  value={formData.transactionFeeRate}
                  onChange={(e) => handleFieldChange('transactionFeeRate', e.target.value)}
                  placeholder="请输入手续费率"
                  suffix="%"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Advanced Options */}
        <div className="form-section">
          <Collapse
            items={[
              {
                key: 'advanced',
                label: (
                  <Space>
                    <SettingOutlined />
                    高级选项
                    <small style={{ color: '#8c8c8c' }}>（可选）</small>
                  </Space>
                ),
                children: (
                  <div>
                    {/* Deposit/Withdrawal Loss Section */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 16 }}>
                        <Space>
                          <Switch
                            checked={formData.enableDepositWithdrawalLoss}
                            onChange={(checked) => handleFieldChange('enableDepositWithdrawalLoss', checked)}
                          />
                          <span>出入金磨损费用</span>
                          <Tooltip title="考虑交易所出入金过程中可能产生的磨损费用">
                            <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                          </Tooltip>
                        </Space>
                      </div>
                      
                      {formData.enableDepositWithdrawalLoss && (
                        <Row gutter={16}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="入金磨损率"
                              {...getFieldValidationStatus('depositLossRate')}
                            >
                              <Input
                                value={formData.depositLossRate}
                                onChange={(e) => handleFieldChange('depositLossRate', e.target.value)}
                                placeholder="请输入入金磨损率"
                                suffix="%"
                                autoComplete="off"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="出金磨损率"
                              {...getFieldValidationStatus('withdrawalLossRate')}
                            >
                              <Input
                                value={formData.withdrawalLossRate}
                                onChange={(e) => handleFieldChange('withdrawalLossRate', e.target.value)}
                                placeholder="请输入出金磨损率"
                                suffix="%"
                                autoComplete="off"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                    </div>

                    {/* Leverage Section */}
                    <div>
                      <div style={{ marginBottom: 16 }}>
                        <Space>
                          <Switch
                            checked={formData.enableLeverage}
                            onChange={(checked) => handleFieldChange('enableLeverage', checked)}
                          />
                          <span>杠杆交易</span>
                          <Tooltip title="启用杠杆交易计算，系统将计算实际杠杆收益率和爆仓价格">
                            <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                          </Tooltip>
                        </Space>
                        {formData.enableLeverage && (
                          <Alert
                            message="风险提醒"
                            description="杠杆交易风险较高，请谨慎操作。系统将为您计算爆仓价格作为风险参考。"
                            type="warning"
                            icon={<ExclamationCircleOutlined />}
                            showIcon
                            style={{ marginTop: 8 }}
                          />
                        )}
                      </div>
                      
                      {formData.enableLeverage && (
                        <Row gutter={16}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="杠杆倍数"
                              {...getFieldValidationStatus('leverageRatio')}
                            >
                              <Input
                                value={formData.leverageRatio}
                                onChange={(e) => handleFieldChange('leverageRatio', e.target.value)}
                                placeholder="请输入杠杆倍数"
                                suffix="倍"
                                autoComplete="off"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                    </div>
                  </div>
                ),
              },
            ]}
            ghost
          />
        </div>

        {/* Action Buttons */}
        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
            <Button
              type="primary"
              size="large"
              icon={<CalculatorOutlined />}
              loading={loading}
              onClick={onCalculate}
              disabled={!isValidForCalculation}
              style={{ minWidth: 120 }}
            >
              {loading ? '计算中...' : '开始计算'}
            </Button>
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={onReset}
              style={{ minWidth: 120 }}
            >
              重置参数
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}