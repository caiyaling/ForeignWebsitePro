# 前端开发规范

## 一、技术栈

- **框架**: Vue 3 + Composition API
- **构建工具**: Vite 5
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **CSS 方案**: Tailwind CSS v4 + SCSS
- **HTTP 请求**: Axios

## 二、目录结构

```
src/
├── main.js              # 应用入口
├── App.vue              # 根组件
├── style.css            # 全局样式
├── router/              # 路由配置
│   └── index.js
├── utils/               # 工具函数
│   └── request.js       # Axios 封装
├── stores/              # Pinia 状态管理
└── pages/               # 页面组件（按功能模块划分）
    └── FeatureName/
        ├── Index.vue            # 页面入口
        └── components/          # 页面局部组件
            ├── ComponentA.vue
            └── ComponentB.vue
```

## 三、命名规范

### 3.1 文件命名

| 类型 | 命名方式 | 示例 |
|------|----------|------|
| Vue 组件 | PascalCase | `GlobalHeader.vue`、`DataTable.vue` |
| JS/TS 文件 | camelCase | `request.js`、`formatDate.js` |
| 目录名 | PascalCase | `NetworkWarfareResourse/` |

### 3.2 变量命名

- 使用 camelCase 驼峰命名
- 布尔值使用 `is`、`has`、`should` 等前缀
- 常量使用 UPPER_SNAKE_CASE

```javascript
// 推荐
const userName = 'admin'
const isLoading = false
const API_BASE_URL = '/api'

// 不推荐
const user_name = 'admin'
const loading = false
```

### 3.3 CSS 类名

- 使用 kebab-case 短横线命名
- 使用语义化的类名，避免过度缩写

```scss
// 推荐
.summary-panel { }
.card-row { }
.panel-toolbar { }

// 不推荐
.summaryPanel { }
.cr { }
```

## 四、Vue 组件规范

### 4.1 组件结构

组件按以下顺序组织：

```vue
<script setup>
// 1. 导入
import { ref, computed } from 'vue'
import ComponentA from './ComponentA.vue'

// 2. Props 定义
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

// 3. Emits 定义
const emit = defineEmits(['update', 'delete'])

// 4. 响应式状态
const isActive = ref(false)

// 5. 计算属性
const filteredData = computed(() => props.data.filter(...))

// 6. 方法
const handleClick = () => {
  emit('update')
}
</script>

<template>
  <!-- 模板内容 -->
</template>

<style lang="scss" scoped>
/* 样式内容 */
</style>
```

### 4.2 Props 定义

- 必须定义类型
- 提供默认值（非必填项）

```javascript
// 推荐
defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  size: {
    type: Number,
    default: 100
  }
})

// 不推荐
defineProps(['title', 'data', 'size'])
```

### 4.3 事件命名

- 使用 kebab-case 命名事件
- 使用 `update:propName` 格式实现双向绑定

```javascript
// 推荐
emit('update:filters', newValue)
emit('search')
emit('page-change', page)

// 不推荐
emit('updateFilters', newValue)
```

## 五、样式规范

### 5.1 样式组织

- 使用 `<style lang="scss" scoped>` 限定作用域
- 使用嵌套规则组织相关样式
- 使用 `:deep()` 修改子组件样式

```scss
.panel-toolbar {
  display: flex;
  align-items: center;

  // 嵌套
  .panel-title {
    font-size: 14px;
  }

  // 伪元素
  &::after {
    content: '';
  }

  // 状态
  &:hover {
    background: #f5f5f5;
  }
}

// 修改 Element Plus 组件样式
:deep(.el-table__header th) {
  background: #f5f7fa;
}
```

### 5.2 颜色规范

使用 Element Plus 主题色或项目定义的颜色：

| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主色 | `#409eff` / `#0048FF` | 主要按钮、链接 |
| 成功 | `#67c23a` | 成功状态 |
| 警告 | `#e6a23c` | 警告状态 |
| 危险 | `#f56c6c` / `#F53F3F` | 错误、删除 |
| 信息 | `#909399` | 次要信息 |
| 文字主色 | `#303133` | 主要文字 |
| 文字次色 | `#606266` | 次要文字 |
| 边框色 | `#dcdfe6` | 边框、分割线 |
| 背景色 | `#f5f7fa` | 页面背景 |

### 5.3 字体规范

主字体：`'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif`

常用字号：
- 标题：`20px`
- 正文：`14px`
- 辅助文字：`12px`

## 六、Element Plus 使用规范

### 6.1 组件导入

按需导入组件，减少打包体积：

```javascript
// 推荐
import { ElInput, ElSelect, ElButton } from 'element-plus'

// 全局注册在 main.js 中已配置，无需重复导入
```

### 6.2 表单验证

使用 Element Plus 的表单验证：

```javascript
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ]
}
```

## 七、HTTP 请求规范

### 7.1 使用封装的 request 实例

```javascript
import request from '@/utils/request'

// GET 请求
const fetchData = () => {
  return request.get('/api/data', { params: { id: 1 } })
}

// POST 请求
const saveData = (data) => {
  return request.post('/api/data', data)
}
```

### 7.2 环境变量

API 基础 URL 通过环境变量配置：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

## 八、路由规范

### 8.1 路由定义

```javascript
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/pages/User/Index.vue'),
    meta: {
      title: '用户管理'
    }
  }
]
```

### 8.2 路由守卫

在 `router/index.js` 中配置全局守卫：

```javascript
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '默认标题'
  next()
})
```

## 九、注释规范

### 9.1 文件头注释

```javascript
/**
 * @description 数据表格组件
 * @author 作者名
 * @date 2024-01-01
 */
```

### 9.2 函数注释

```javascript
/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或字符串
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的日期字符串
 */
const formatDate = (date, format) => {
  // ...
}
```

### 9.3 复杂逻辑注释

在复杂业务逻辑处添加说明注释，解释意图。

## 十、Git 提交规范

### 10.1 提交信息格式

```
<type>(<scope>): <subject>

<body>
```

### 10.2 提交类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 Bug |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 重构代码 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

示例：

```
feat(user): 添加用户列表页面

- 新增用户列表组件
- 添加搜索筛选功能
- 集成分页组件
```
