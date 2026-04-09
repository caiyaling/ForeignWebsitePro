<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElProgress, ElTag } from 'element-plus'

const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    default: '虚拟人设信息'
  },
  userInfo: {
    type: Object,
    default: () => ({
      avatar: '',
      userId: '',
      userIdTag: '',
      statusTags: [],
      userName: '',
      completeness: 0,
      gender: '',
      ethnicity: '',
      school: '',
      education: '',
      location: '',
      maritalStatus: '',
      industry: '',
      occupation: '',
      hobbies: '',
      religion: '',
      registerRegion: '',
      registerTime: '',
      linkUrl: ''
    })
  }
})

// 根据完善度确定进度条颜色
const progressColor = computed(() => {
  const val = props.userInfo.completeness
  if (val >= 80) return '#67c23a'
  if (val >= 50) return '#0048FF'
  return '#e6a23c'
})

// 判断是否为社交平台采集账号
const isSocialCollection = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''
  return from === '/social' && accountType === '采集'
})
</script>

<template>
  <div class="user-info-card">
    <!-- 用户基本信息 -->
    <div class="user-basic-info">
      <div class="user-avatar">
        <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" />
        <div v-else class="avatar-placeholder">
          <span>{{ userInfo.userName?.charAt(0) || 'U' }}</span>
        </div>
      </div>

      <div class="user-details">
        <!-- 用户ID行 -->
        <div class="user-id-row">
          <span class="user-id">{{ userInfo.userId }}</span>
          <el-tag v-if="userInfo.userIdTag" size="small" class="user-tag">{{ userInfo.userIdTag }}</el-tag>
        </div>

        <!-- 状态标签行 -->
        <div class="status-tags">
          <el-tag
            v-for="(tag, index) in userInfo.statusTags"
            :key="index"
            :type="tag.type || 'info'"
            size="small"
            class="status-tag"
          >
            {{ tag.label }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 社交平台采集账号简化版 -->
    <div v-if="isSocialCollection" class="user-detail-info simple">
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">用户昵称：</span>
          <span class="info-value">{{ userInfo.userName || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">粉丝数量：</span>
          <span class="info-value">{{ userInfo.statusTags?.find(t => t.label?.includes('粉丝'))?.label?.replace('粉丝 ', '') || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">好友数量：</span>
          <span class="info-value">{{ userInfo.statusTags?.find(t => t.label?.includes('好友'))?.label?.replace('好友 ', '') || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">群组数量：</span>
          <span class="info-value">{{ userInfo.statusTags?.find(t => t.label?.includes('群主'))?.label?.replace('群主 ', '') || '-' }}</span>
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
              :percentage="userInfo.completeness"
              :stroke-width="6"
              :show-text="false"
              :color="progressColor"
            />
            <span class="completeness-text">{{ userInfo.completeness }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详细信息 - 完整版 -->
    <div v-else class="user-detail-info">
      <!-- 第一行 -->
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">用户名称：</span>
          <span class="info-value">{{ userInfo.userName || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">账号信息完善度：</span>
          <div class="completeness-wrapper">
            <el-progress
              :percentage="userInfo.completeness"
              :stroke-width="6"
              :show-text="false"
              :color="progressColor"
            />
            <span class="completeness-text">{{ userInfo.completeness }}%</span>
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
          <span class="info-value">{{ userInfo.ethnicity || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">毕业院校：</span>
          <span class="info-value">{{ userInfo.school || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">学历：</span>
          <span class="info-value">{{ userInfo.education || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">地区：</span>
          <span class="info-value">{{ userInfo.location || '-' }}</span>
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
          <span class="info-value">{{ userInfo.industry || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">职业：</span>
          <span class="info-value">{{ userInfo.occupation || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">兴趣爱好：</span>
          <span class="info-value">{{ userInfo.hobbies || '-' }}</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">宗教信仰：</span>
          <span class="info-value">{{ userInfo.religion || '-' }}</span>
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
          <span class="info-label">链接URL：</span>
          <span class="info-value link-url">{{ userInfo.linkUrl || '-' }}</span>
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
  width: 59px;
  height: 73px;
  flex-shrink: 0;
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1), 0px 1px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px 0px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #EBEEF5;

  span {
    font-size: 24px;
    font-weight: 700;
    color: #909399;
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

  &.link-url {
    color: #0048FF;
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
