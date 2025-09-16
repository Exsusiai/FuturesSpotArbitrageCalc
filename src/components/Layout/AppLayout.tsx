import { Layout, Typography, Space, Tooltip, Divider } from 'antd'
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <Header style={{ 
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
        padding: '0',
        margin: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100vw',
        minWidth: '100vw',
        left: 0,
        right: 0
      }}>
        <div style={{ 
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <div className="header-title-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={3} className="header-title-main" style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 600,
              lineHeight: 1.2
            }}>
              Futures Spot Arbitrage Calc
            </Title>
            <Text className="header-title-sub" style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: 'clamp(12px, 3vw, 14px)',
              marginTop: '-2px'
            }}>
              期现套利计算器
            </Text>
          </div>
          
          <Space>
            <Tooltip title="期现套利是利用期货与现货价格差异的投资策略，计算结果仅供参考">
              <InfoCircleOutlined style={{ 
                color: 'white', 
                fontSize: 'clamp(14px, 3vw, 16px)',
                opacity: 0.8,
                transition: 'opacity 0.3s'
              }} />
            </Tooltip>
          </Space>
        </div>
      </Header>
      
      <Content style={{ 
        padding: '24px',
        background: '#f5f5f5',
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {children}
        </div>
      </Content>
      
      <Footer style={{ 
        textAlign: 'center', 
        background: '#f5f5f5',
        borderTop: '1px solid #d9d9d9',
        padding: '16px 24px'
      }}>
        <Space split={<Divider type="vertical" />} size="large" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <Text type="secondary">Futures Spot Arbitrage Calc ©2025</Text>
          <Space>
            <WarningOutlined style={{ color: '#faad14' }} />
            <Text type="secondary">仅供参考，投资有风险</Text>
          </Space>
          <Text type="secondary">请在投资前咨询专业人士</Text>
        </Space>
      </Footer>
    </Layout>
  )
}