import { Spin, Progress } from 'antd'
import { ReactNode } from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  tip?: string
  progress?: number
  children?: ReactNode
  spinning?: boolean
}

export function LoadingSpinner({ 
  size = 'default', 
  tip = '计算中...', 
  progress,
  children,
  spinning = true
}: LoadingSpinnerProps) {
  const content = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px' 
    }}>
      <Spin size={size} tip={tip} spinning={spinning} />
      {progress !== undefined && (
        <div style={{ marginTop: 16, width: 200 }}>
          <Progress 
            percent={progress} 
            size="small" 
            status={progress === 100 ? 'success' : 'active'}
            showInfo={false}
          />
          <div style={{ textAlign: 'center', marginTop: 4, fontSize: '12px', color: '#8c8c8c' }}>
            {progress}%
          </div>
        </div>
      )}
    </div>
  )

  if (children) {
    return (
      <Spin spinning={spinning} tip={tip} size={size}>
        {children}
      </Spin>
    )
  }

  return content
}