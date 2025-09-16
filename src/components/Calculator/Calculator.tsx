import { Row, Col, Empty, Alert } from 'antd'
import { CalculatorOutlined } from '@ant-design/icons'
import { useCalculation } from '../../hooks/useCalculation'
import { InputForm } from '../InputForm'
import { ResultDisplay } from '../ResultDisplay'
import { LoadingSpinner } from '../Common/LoadingSpinner'

export function Calculator() {
  const {
    formData,
    updateField,
    result,
    analysisResult,
    errors,
    warnings,
    loading,
    isValidForCalculation,
    hasAnyData,
    calculate,
    reset,
    loadExample
  } = useCalculation()

  return (
    <div className="calculator-container" style={{ padding: '0 16px' }}>
      <Row gutter={[24, 24]}>
        {/* 输入表单 */}
        <Col xs={24} lg={10} xl={8}>
          <div className="mobile-sticky-disable" style={{ position: 'sticky', top: 24 }}>
            <InputForm
              formData={formData}
              updateField={updateField}
              onCalculate={calculate}
              onReset={reset}
              onLoadExample={loadExample}
              loading={loading}
              errors={errors}
              warnings={warnings}
              isValidForCalculation={isValidForCalculation}
            />
          </div>
        </Col>

        {/* 结果展示 */}
        <Col xs={24} lg={14} xl={16}>
          {loading ? (
            <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingSpinner size="large" tip="正在计算套利收益率..." />
            </div>
          ) : result ? (
            <ResultDisplay 
              result={result} 
              analysisResult={analysisResult}
              spotPrice={formData.spotPrice}
            />
          ) : hasAnyData ? (
            <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Alert
                message="等待计算"
                description="请完善输入参数后进行计算"
                type="info"
                showIcon
                style={{ minWidth: 300 }}
              />
            </div>
          ) : (
            <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty
                image={<CalculatorOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
                description={
                  <div>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>开始计算期现套利收益率</div>
                    <div style={{ color: '#8c8c8c' }}>
                      请在左侧输入相关参数，或点击"示例"按钮载入示例数据
                    </div>
                  </div>
                }
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  )
}