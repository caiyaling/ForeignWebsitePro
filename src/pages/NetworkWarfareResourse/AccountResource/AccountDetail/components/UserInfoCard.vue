<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElProgress, ElTag } from 'element-plus'
import defaultAvatar from '@/assets/default-avatar.svg'

const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    default: '虚拟人设信息'
  },
  userInfo: {
    type: Object,
    default: () => ({
      platformName: '',
      accountId: '',
      tags: '',
      fansCount: null,
      friendsCount: null,
      groupCount: null,
      groupAvgCount: null,
      historyPostCount: null,
      validFansRatio: '',
      groupValidUserRatio: '',
      userNickname: '',
      accountInfoCompleteness: '',
      gender: '',
      nation: '',
      school: '',
      education: '',
      region: '',
      maritalStatus: '',
      industry: '',
      occupation: '',
      hobbies: '',
      religion: '',
      registerRegion: '',
      registerTime: '',
      linkUrl: '',
      bindEmail: ''
    })
  }
})

// 进度条颜色 - 固定使用设计稿中的蓝色
const progressColor = '#0048FF'

// 判断来源页面类型
const fromPage = computed(() => {
  const from = route.query.from || ''
  return from
})

// 判断是否为社交平台采集账号
const isSocialCollection = computed(() => {
  const accountType = route.query.accountType || ''
  return fromPage.value.includes('/social') && accountType === '采集'
})

// 判断是否为博客论坛页面
const isBlogForum = computed(() => {
  return fromPage.value.includes('/blog-forum')
})

// 判断是否为电子邮箱页面
const isEmail = computed(() => {
  return fromPage.value.includes('/email')
})

// 判断是否为即时通讯页面
const isInstantMessaging = computed(() => {
  return fromPage.value.includes('/instant-messaging')
})

// 是否显示简化版本（社交平台采集账号、博客论坛、电子邮箱）
// 即时通讯页面显示完整版本
const showSimpleVersion = computed(() => {
  if (isInstantMessaging.value) return false
  return isSocialCollection.value || isBlogForum.value || isEmail.value
})

// 账号信息完善度数值（处理百分比字符串）
const completenessValue = computed(() => {
  const val = props.userInfo.accountInfoCompleteness
  if (!val) return 0
  // 如果是百分比字符串如 "90%"，提取数字
  if (typeof val === 'string' && val.includes('%')) {
    return parseInt(val.replace('%', '')) || 0
  }
  return parseInt(val) || 0
})

// 显示的账号ID（电子邮箱页面显示 bindEmail）
const displayAccountId = computed(() => {
  if (isEmail.value) {
    return props.userInfo.bindEmail || props.userInfo.accountId || '-'
  }
  return props.userInfo.accountId || '-'
})


</script>

<template>
  <div class="user-info-card">
    <!-- 用户基本信息 -->
    <div class="user-basic-info">
      <div class="user-avatar">
        <img :src="defaultAvatar" alt="头像" />
      </div>

      <div class="user-details">
        <!-- 用户ID行 -->
        <div class="user-id-row">
          <span class="user-id">{{ displayAccountId }}<template v-if="userInfo.userNickname && userInfo.userNickname !== '-'"> ({{ userInfo.userNickname }})</template></span>
          <el-tag v-if="userInfo.tags && !isEmail && !isBlogForum && !isSocialCollection" size="small" class="user-tag">{{ userInfo.tags }}</el-tag>
        </div>

        <!-- 状态标签行 -->
        <div v-if="!isEmail && !isBlogForum" class="status-tags">
          <el-tag v-if="userInfo.fansCount" type="success" size="small" class="status-tag">粉丝 {{ userInfo.fansCount }}</el-tag>
          <el-tag v-if="userInfo.friendsCount" type="danger" size="small" class="status-tag">好友 {{ userInfo.friendsCount }}</el-tag>
          <el-tag v-if="userInfo.groupCount" type="primary" size="small" class="status-tag">群组 {{ userInfo.groupCount }}</el-tag>
          <el-tag v-if="userInfo.groupAvgCount && !isSocialCollection" type="warning" size="small" class="status-tag">群平均人数 {{ userInfo.groupAvgCount }}</el-tag>
          <el-tag v-if="userInfo.historyPostCount && !isSocialCollection" type="success" size="small" class="status-tag">历史发言数 {{ userInfo.historyPostCount }}</el-tag>
          <el-tag v-if="!isSocialCollection" type="danger" size="small" class="status-tag">有效粉丝占比 {{ userInfo.validFansRatio || 0 }}%</el-tag>
          <el-tag v-if="!isSocialCollection" type="primary" size="small" class="status-tag">群组有效用户占比 {{ userInfo.groupValidUserRatio || 0 }}%</el-tag>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 博客论坛页面简化版 -->
    <div v-if="isBlogForum" class="user-detail-info simple">
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">用户昵称：</span>
          <span class="info-value">{{ userInfo.userNickname || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">链接URL：</span>
          <span
            class="info-value link-url"
            :title="userInfo.linkUrl || ''"
          >{{ userInfo.linkUrl || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">注册地区：</span>
          <span class="info-value">{{ userInfo.registerRegion || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">注册时间：</span>
          <span class="info-value">{{ userInfo.registerTime || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">历史发言数量：</span>
          <span class="info-value">{{ userInfo.historyPostCount || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">账号信息完善度：</span>
          <div class="completeness-wrapper">
            <el-progress
              :percentage="completenessValue"
              :stroke-width="6"
              :show-text="false"
              :color="progressColor"
            />
            <span class="completeness-text">{{ completenessValue }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 电子邮箱页面简化版 -->
    <div v-else-if="isEmail" class="user-detail-info simple">
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">用户昵称：</span>
          <span class="info-value">{{ userInfo.userNickname || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">注册地区：</span>
          <span class="info-value">{{ userInfo.registerRegion || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">注册时间：</span>
          <span class="info-value">{{ userInfo.registerTime || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">账号信息完善度：</span>
          <div class="completeness-wrapper">
            <el-progress
              :percentage="completenessValue"
              :stroke-width="6"
              :show-text="false"
              :color="progressColor"
            />
            <span class="completeness-text">{{ completenessValue }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 社交平台采集账号简化版 -->
    <div v-else-if="isSocialCollection" class="user-detail-info simple">
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">用户昵称：</span>
          <span class="info-value">{{ userInfo.userNickname || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">注册地区：</span>
          <span class="info-value">{{ userInfo.registerRegion || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">注册时间：</span>
          <span class="info-value">{{ userInfo.registerTime || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">账号信息完善度：</span>
          <div class="completeness-wrapper">
            <el-progress
              :percentage="completenessValue"
              :stroke-width="6"
              :show-text="false"
              :color="progressColor"
            />
            <span class="completeness-text">{{ completenessValue }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 完整版 -->
    <div v-else class="user-detail-info">
      <!-- 第一行 -->
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">用户昵称：</span>
          <span class="info-value ellipsis" :title="userInfo.userNickname || ''">{{ userInfo.userNickname || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">账号信息完善度：</span>
          <div class="completeness-wrapper">
            <el-progress
              :percentage="completenessValue"
              :stroke-width="6"
              :show-text="false"
              :color="progressColor"
            />
            <span class="completeness-text">{{ completenessValue }}%</span>
          </div>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">性别：</span>
          <span class="info-value">{{ userInfo.gender || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">民族：</span>
          <span class="info-value">{{ userInfo.nation || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">毕业院校：</span>
          <span class="info-value ellipsis" :title="userInfo.school || ''">{{ userInfo.school || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">学历：</span>
          <span class="info-value">{{ userInfo.education || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">地区：</span>
          <span class="info-value">{{ userInfo.region || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">婚姻状况：</span>
          <span class="info-value">{{ userInfo.maritalStatus || '-' }}</span>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">所属行业：</span>
          <span class="info-value ellipsis" :title="userInfo.industry || ''">{{ userInfo.industry || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">职业：</span>
          <span class="info-value">{{ userInfo.occupation || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">兴趣爱好：</span>
          <span class="info-value ellipsis" :title="userInfo.hobbies || ''">{{ userInfo.hobbies || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">宗教信仰：</span>
          <span class="info-value">{{ userInfo.religion || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">注册地区：</span>
          <span class="info-value ellipsis" :title="userInfo.registerRegion || ''">{{ userInfo.registerRegion || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">注册时间：</span>
          <span class="info-value">{{ userInfo.registerTime || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">链接URL：</span>
          <span class="info-value link-url" :title="userInfo.linkUrl || ''">{{ userInfo.linkUrl || '-' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-info-card {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}

.user-basic-info {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 60px;
  height: 70px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #ededed;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-id-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-id {
  font-family: 'Alibaba PuHuiTi', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  line-height: 22px;
}

.user-tag {
  background: #0026ff;
  border-color: #0026ff;
  color: #fff;
}

.status-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.status-tag {
  margin: 0;
}

.user-detail-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;

  &.simple {
    .info-row {
      flex-wrap: nowrap;
    }
  }
}

.info-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-label {
  font-family: 'Alibaba PuHuiTi', sans-serif;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
  white-space: nowrap;
}

.info-value {
  font-family: 'Alibaba PuHuiTi', sans-serif;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.88);

  &.ellipsis {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: default;
  }

  &.link-url {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
}

.info-divider {
  width: 1px;
  height: 16px;
  background: #d7d7d7;
  margin: 0 24px;
}

.completeness-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.completeness-wrapper :deep(.el-progress) {
  width: 90px;
}

.completeness-wrapper :deep(.el-progress-bar__outer) {
  background: #ebedf0;
  border-radius: 20px;
}

.completeness-wrapper :deep(.el-progress-bar__inner) {
  border-radius: 20px;
}

.completeness-text {
  font-family: 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  color: #606266;
  min-width: 32px;
}
</style>
