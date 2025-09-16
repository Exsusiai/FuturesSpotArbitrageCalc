import { Component, ReactNode } from 'react'
import { Result, Button, Space, Typography, Collapse } from 'antd'
import { ReloadOutlined, BugOutlined } from '@ant-design/icons'

const { Text } = Typography
const { Panel } = Collapse

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: any
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // 在生产环境中，可以将错误发送到日志服务
    if (process.env.NODE_ENV === 'production') {
      // 这里可以集成错误监控服务，如 Sentry
      console.error('Production error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Result
          status="error"
          icon={<BugOutlined />}
          title="应用发生错误"
          subTitle="很抱歉，应用遇到了一个意外错误。请尝试以下解决方案："
          extra={
            <Space direction="vertical" size="large" style={{ textAlign: 'center' }}>
              <Space>
                <Button type="primary" icon={<ReloadOutlined />} onClick={this.handleReset}>
                  重试
                </Button>
                <Button onClick={() => window.location.reload()}>
                  刷新页面
                </Button>
              </Space>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div style={{ textAlign: 'left', maxWidth: 600 }}>
                  <Collapse ghost>
                    <Panel header="错误详情（开发模式）" key="1">
                      <Text code style={{ fontSize: '12px' }}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                          {this.state.error.message}
                          {this.state.error.stack && (
                            <>
                              <br /><br />
                              <strong>Stack Trace:</strong><br />
                              {this.state.error.stack}
                            </>
                          )}
                        </div>
                      </Text>
                    </Panel>
                  </Collapse>
                </div>
              )}
            </Space>
          }
        />
      )
    }

    return this.props.children
  }
}