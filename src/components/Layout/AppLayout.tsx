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
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          期现套利计算器
        </Title>
        
        <Space>
          <Tooltip title="期现套利是利用期货与现货价格差异的投资策略，计算结果仅供参考">
            <InfoCircleOutlined style={{ color: 'white', fontSize: 16 }} />
          </Tooltip>
        </Space>
      </Header>
      
      <Content style={{ 
        padding: '24px',
        background: '#f5f5f5',
        flex: 1
      }}>
        {children}
      </Content>
      
      <Footer style={{ 
        textAlign: 'center', 
        background: '#f5f5f5',
        borderTop: '1px solid #d9d9d9',
        padding: '16px 24px'
      }}>
        <Space split={<Divider type="vertical" />} size="large">
          <Text type="secondary">期现套利计算器 ©2025</Text>
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