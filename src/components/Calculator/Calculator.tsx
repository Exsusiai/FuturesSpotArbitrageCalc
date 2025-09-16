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
    <div className="calculator-container">
      <Row gutter={[32, 24]} style={{ minHeight: 'calc(100vh - 180px)' }}>
        {/* 输入表单 */}
        <Col 
          xs={24} 
          sm={24} 
          md={24} 
          lg={11} 
          xl={9}
          xxl={8}
        >
          <div 
            className="mobile-sticky-disable" 
            style={{ 
              position: 'sticky', 
              top: 88,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto'
            }}
          >
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
        <Col 
          xs={24} 
          sm={24} 
          md={24} 
          lg={13} 
          xl={15}
          xxl={16}
        >
          <div style={{ minHeight: '400px' }}>
            {loading ? (
              <div style={{ 
                minHeight: '400px',
                height: 'calc(100vh - 200px)',
                maxHeight: '600px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <LoadingSpinner size="large" tip="正在计算套利收益率..." />
                </div>
              </div>
            ) : result ? (
              <ResultDisplay 
                result={result} 
                analysisResult={analysisResult}
                spotPrice={formData.spotPrice}
              />
            ) : hasAnyData ? (
              <div style={{ 
                minHeight: '400px',
                height: 'calc(100vh - 200px)',
                maxHeight: '600px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '40px',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '400px'
                }}>
                  <Alert
                    message="等待计算"
                    description="请完善输入参数后点击计算按钮"
                    type="info"
                    showIcon
                    style={{ 
                      textAlign: 'center',
                      border: '1px solid #d9f7be',
                      background: '#f6ffed',
                      borderRadius: '8px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ 
                minHeight: '400px',
                height: 'calc(100vh - 200px)',
                maxHeight: '600px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '40px',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '500px'
                }}>
                  <Empty
                    image={<CalculatorOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
                    description={
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, marginBottom: 12, fontWeight: 500 }}>
                          开始计算期现套利收益率
                        </div>
                        <div style={{ color: '#8c8c8c', fontSize: 14, lineHeight: 1.5 }}>
                          请在左侧输入相关参数，或点击"示例"按钮载入示例数据
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}