# 期现套利计算器

一个专业的期现套利年化收益率计算器，帮助投资者快速评估期现套利机会。

## 🔗 在线体验

[点击访问在线版本](https://your-deployed-url.com)

## 📋 项目概述

期现套利计算器是一个纯前端Web应用，通过输入期货价格、现货价格、时间参数、利率和手续费等信息，实时计算期现套利的年化收益率。该工具具有界面简洁、计算准确、使用便捷等特点。

### ✨ 核心功能
- **实时计算**：输入参数后立即计算年化收益率
- **精确计算**：使用高精度数值计算库避免浮点数误差  
- **高级分析**：支持杠杆计算、出入金磨损分析
- **盈亏分析**：提供详细的收益构成分析和风险等级评估
- **响应式设计**：完美适配桌面端和移动端
- **数据验证**：完整的输入验证和错误提示

### 📊 计算公式
```
年化收益率 = ((期货价格 - 现货价格) / 现货价格 - 持有成本率 - 交易费用率) × (365 / 持有天数) × 100%
```

## 🏗️ 技术架构

### 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5.x
- **UI框架**: Ant Design 5.x  
- **计算库**: decimal.js (精确计算) + dayjs (时间处理)
- **图表库**: @ant-design/plots
- **状态管理**: React Hooks + Context API

### 项目结构
```
arbitrage-calculator/
├── public/                 # 静态资源
├── src/                    # 源代码
│   ├── components/         # React组件
│   │   ├── Calculator/     # 计算器主组件
│   │   ├── InputForm/      # 输入表单组件
│   │   ├── ResultDisplay/  # 结果展示组件
│   │   ├── Layout/         # 布局组件
│   │   └── Common/         # 通用组件
│   ├── utils/             # 工具函数
│   │   ├── calculations.ts # 计算逻辑
│   │   ├── validation.ts   # 输入验证
│   │   └── formatters.ts   # 数据格式化
│   ├── types/             # TypeScript类型定义
│   ├── hooks/             # 自定义Hooks
│   └── styles/            # 样式文件
├── package.json           # 项目依赖
├── vite.config.ts         # Vite配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 本地开发
```bash
# 克隆项目
git clone <repository-url>
cd period-arbitrage-calculator

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 生产构建
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📖 使用说明

### 基本参数
1. **投入资金**: 用于期现套利的总资金金额
2. **期货现价**: 当前期货合约价格
3. **现货价格**: 预期交割时的现货价格
4. **当前时间**: 建立套利头寸的时间
5. **交割时间**: 期货合约交割时间
6. **年化利率**: 资金成本年化利率(%)
7. **交易手续费**: 交易成本费率(%)

### 高级功能
- **杠杆计算**: 支持杠杆交易的收益率计算和风险评估
- **出入金磨损**: 考虑资金转入转出过程中的成本损耗
- **盈亏平衡分析**: 计算不同价格情况下的盈亏平衡点
- **敏感性分析**: 分析利率、时间等因素对收益率的影响

### 计算结果
- **年化收益率**: 期现套利的年化收益率
- **实际盈利**: 持有期内的实际盈利金额
- **持有天数**: 套利头寸的持有时间
- **风险等级**: 基于收益率和杠杆的风险评估
- **详细分析**: 价差收益、持有成本、交易成本的详细分解

## 🌟 主要特性

- ✅ **高精度计算**: 使用decimal.js避免浮点数计算误差
- ✅ **实时验证**: 输入即时验证，错误提示友好
- ✅ **响应式设计**: 完美支持桌面端和移动端
- ✅ **杠杆支持**: 支持杠杆交易的完整计算
- ✅ **详细分析**: 提供全面的收益分解和风险评估
- ✅ **现代界面**: 基于Ant Design的专业级UI设计

## ⚠️ 免责声明

**重要提示：**
- 本计算器仅供参考，不构成投资建议
- 期现套利存在市场风险，投资需谨慎
- 实际收益可能因市场条件变化而不同
- 请在投资前咨询专业投资顾问

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

我们欢迎社区贡献！请阅读我们的贡献指南了解如何参与项目开发。

### 开发流程
1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 提交 Issue: [GitHub Issues](https://github.com/username/period-arbitrage-calculator/issues)
- 邮箱: your-email@example.com

---

## 🚀 部署说明

### Vercel部署（推荐）
```bash
# 1. 构建项目
npm run build

# 2. 将dist文件夹上传到Vercel或其他静态托管服务
```

### Netlify部署
```bash
# 构建命令
npm run build

# 发布目录
dist
```

### 其他静态托管
项目构建后会生成`dist`文件夹，可以部署到任何静态文件托管服务。

## 🔧 开发信息

**版本**: 1.0.0  
**开发框架**: React 18 + TypeScript + Vite  
**UI设计**: Ant Design 5.x  
**计算引擎**: Decimal.js (高精度)  
**构建工具**: Vite 5.x