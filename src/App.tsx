import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { AppLayout } from './components/Layout/AppLayout'
import { ErrorBoundary } from './components/Common/ErrorBoundary'
import { Calculator } from './components/Calculator'
import './styles/mobile.css'

dayjs.locale('zh-cn')

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <ErrorBoundary>
        <AppLayout>
          <Calculator />
        </AppLayout>
      </ErrorBoundary>
    </ConfigProvider>
  )
}

export default App