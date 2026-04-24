<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElProgress, ElTag, ElTooltip } from 'element-plus'
import defaultAvatar from '@/assets/default-avatar.svg'
import { getAssetUrl } from '@/utils/assets'

const route = useRoute()

// 平台图标配置映射
const platformConfig = {
  'Facebook': { icon: getAssetUrl('/figma/mnijidos-mhm8ijf.svg') },
  'Instagram': { icon: getAssetUrl('/figma/mnijidos-9h6v96r.svg') },
  'Threads': { icon: getAssetUrl('/figma/mnijidos-927feh6.svg') },
  'YouTube': { icon: getAssetUrl('/figma/mnijidos-hh4aiod.svg') },
  'TikTok': { icon: getAssetUrl('/figma/mnijidos-neinw5m.svg') },
  'X': { icon: getAssetUrl('/figma/mnijidos-63851so.svg') },
  'Twitter': { icon: getAssetUrl('/figma/mnijidos-63851so.svg') },
  'line': { icon: getAssetUrl('/figma/mnijidos-9h6v96r.svg') },
  'Line': { icon: getAssetUrl('/figma/mnijidos-9h6v96r.svg') },
  'Telegram': { icon: getAssetUrl('/figma/mnijidos-9h6v96r.svg') },
  'WhatsApp': { icon: getAssetUrl('/figma/mnijidos-9h6v96r.svg') },
  'WeChat': { icon: getAssetUrl('/figma/mnijidos-9h6v96r.svg') },
  'QQ': { icon: getAssetUrl('/figma/mnijidos-9h6v96r.svg') },
  'Weibo': { icon: getAssetUrl('/figma/mnijidos-9h6v96r.svg') }
}

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

// 平台图标
const platformIcon = computed(() => {
  const platformName = props.userInfo.platformName || ''
  const config = platformConfig[platformName] || { icon: '' }
  return config.icon
})

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
          <!-- 平台图标 -->
          <div v-if="platformIcon" class="platform-icon">
            <img :src="platformIcon" alt="平台图标" />
          </div>
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
    <div v-if="isBlogForum" class="user-detail-info">
      <div class="info-columns">
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">用户昵称</div>
            <span class="info-value">{{ userInfo.userNickname || '-' }}</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">历史发言数量</div>
            <span class="info-value">{{ userInfo.historyPostCount || '-' }}</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">链接URL</div>
            <el-tooltip :content="userInfo.linkUrl || '-'" placement="top" :disabled="!userInfo.linkUrl">
              <span class="info-value link-url">{{ userInfo.linkUrl || '-' }}</span>
            </el-tooltip>
          </div>
          <div class="info-item">
            <div class="info-label-box">账号信息完善度</div>
            <span class="info-value">{{ completenessValue }}%</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">注册地区</div>
            <span class="info-value">{{ userInfo.registerRegion || '-' }}</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">注册时间</div>
            <span class="info-value">{{ userInfo.registerTime || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 电子邮箱页面简化版 -->
    <div v-else-if="isEmail" class="user-detail-info">
      <div class="info-columns">
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">用户昵称</div>
            <span class="info-value">{{ userInfo.userNickname || '-' }}</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">账号信息完善度</div>
            <span class="info-value">{{ completenessValue }}%</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">注册地区</div>
            <span class="info-value">{{ userInfo.registerRegion || '-' }}</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">注册时间</div>
            <span class="info-value">{{ userInfo.registerTime || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 社交平台采集账号简化版 -->
    <div v-else-if="isSocialCollection" class="user-detail-info">
      <div class="info-columns">
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">用户昵称</div>
            <span class="info-value">{{ userInfo.userNickname || '-' }}</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">账号信息完善度</div>
            <span class="info-value">{{ completenessValue }}%</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">注册地区</div>
            <span class="info-value">{{ userInfo.registerRegion || '-' }}</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">注册时间</div>
            <span class="info-value">{{ userInfo.registerTime || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 完整版（按列分组排列） -->
    <div v-else class="user-detail-info">
      <div class="info-columns">
        <!-- 第1列 -->
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">用户名称</div>
            <span class="info-value" :title="userInfo.userNickname || ''">{{ userInfo.userNickname || '-' }}</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">毕业院校</div>
            <span class="info-value" :title="userInfo.school || ''">{{ userInfo.school || '-' }}</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">行业</div>
            <span class="info-value" :title="userInfo.industry || ''">{{ userInfo.industry || '-' }}</span>
          </div>
        </div>

        <!-- 第2列 -->
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">账号信息完善度</div>
            <span class="info-value">{{ completenessValue }}%</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">性别</div>
            <span class="info-value">{{ userInfo.gender || '-' }}</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">民族</div>
            <span class="info-value">{{ userInfo.nation || '-' }}</span>
          </div>
        </div>

        <!-- 第3列 -->
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">学历</div>
            <span class="info-value">{{ userInfo.education || '-' }}</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">地区</div>
            <span class="info-value">{{ userInfo.region || '-' }}</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">职业</div>
            <span class="info-value">{{ userInfo.occupation || '-' }}</span>
          </div>
        </div>

        <!-- 第4列 -->
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">婚姻状况</div>
            <span class="info-value">{{ userInfo.maritalStatus || '-' }}</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">宗教信仰</div>
            <span class="info-value">{{ userInfo.religion || '-' }}</span>
          </div>
          <div class="info-item">
            <div class="info-label-box">注册地区</div>
            <span class="info-value" :title="userInfo.registerRegion || ''">{{ userInfo.registerRegion || '-' }}</span>
          </div>
        </div>

        <!-- 第5列 -->
        <div class="info-column">
          <div class="info-item">
            <div class="info-label-box">兴趣爱好</div>
            <el-tooltip :content="userInfo.hobbies || '-'" placement="top" :disabled="!userInfo.hobbies">
              <span class="info-value">{{ userInfo.hobbies || '-' }}</span>
            </el-tooltip>
          </div>
          <div class="info-item">
            <div class="info-label-box">链接URL</div>
            <el-tooltip :content="userInfo.linkUrl || '-'" placement="top" :disabled="!userInfo.linkUrl">
              <span class="info-value link-url">{{ userInfo.linkUrl || '-' }}</span>
            </el-tooltip>
          </div>
          <div class="info-item">
            <div class="info-label-box">注册时间</div>
            <span class="info-value">{{ userInfo.registerTime || '-' }}</span>
          </div>
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

.platform-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 1000px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.user-id {
  font-family: 'Alibaba PuHuiTi', 'Microsoft YaHei', sans-serif;
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
  padding-top: 16px;
}

/* 按列分组的布局 */
.info-columns {
  display: flex;
  align-items: flex-start;
  gap: 56px;
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-label-box {
  min-width: 143px;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 2px;
  font-family: 'Alibaba PuHuiTi', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  letter-spacing: 0.16px;
  white-space: nowrap;
  text-align: center;
}

.info-value {
  font-family: 'Alibaba PuHuiTi', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.88);
  line-height: 22px;
  letter-spacing: 0.16px;
  white-space: nowrap;

  &.link-url {
    cursor: pointer;
    max-width: 163px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
}
</style>