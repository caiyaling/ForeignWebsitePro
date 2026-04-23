import { createRouter, createWebHashHistory } from 'vue-router'
import SocialPlatform from '@/pages/NetworkWarfareResourse/AccountResource/SocialPlatform.vue'
import InstantMessaging from '@/pages/NetworkWarfareResourse/AccountResource/InstantMessaging.vue'
import BlogForum from '@/pages/NetworkWarfareResourse/AccountResource/BlogForum.vue'
import Email from '@/pages/NetworkWarfareResourse/AccountResource/Email.vue'
import AccountDetail from '@/pages/NetworkWarfareResourse/AccountResource/AccountDetail/Index.vue'
import SpecialDevice from '@/pages/NetworkWarfareResourse/BaseResource/SpecialDevice.vue'
import PhoneCard from '@/pages/NetworkWarfareResourse/BaseResource/PhoneCard.vue'
import NetworkProxy from '@/pages/NetworkWarfareResourse/BaseResource/NetworkProxy.vue'
import TelecommResource from '@/pages/NetworkWarfareResourse/BaseResource/TelecommResource.vue'
import DataImport from '@/pages/NetworkWarfareResourse/DataImport/Index.vue'
import Overview from '@/pages/NetworkWarfareResourse/Overview/Index.vue'
import OperationOverview from '@/pages/NetworkWarfareResourse/OperationOverview/Index.vue'
import HitPostsDetail from '@/pages/NetworkWarfareResourse/OperationOverview/HitPostsDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/network-warfare-resource/overview'
  },
  {
    path: '/network-warfare-resource/overview',
    name: 'Overview',
    component: Overview,
    meta: {
      title: '资源概览 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/social',
    name: 'SocialPlatform',
    component: SocialPlatform,
    meta: {
      title: '社交平台 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/instant-messaging',
    name: 'InstantMessaging',
    component: InstantMessaging,
    meta: {
      title: '即时通讯 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/blog-forum',
    name: 'BlogForum',
    component: BlogForum,
    meta: {
      title: '博客论坛 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/email',
    name: 'Email',
    component: Email,
    meta: {
      title: '电子邮件 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/account-detail',
    name: 'AccountDetail',
    component: AccountDetail,
    meta: {
      title: '账号详情 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/device',
    name: 'SpecialDevice',
    component: SpecialDevice,
    meta: {
      title: '专用设备 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/phone',
    name: 'PhoneCard',
    component: PhoneCard,
    meta: {
      title: '手机卡号 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/proxy',
    name: 'NetworkProxy',
    component: NetworkProxy,
    meta: {
      title: '网络代理 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/telecom',
    name: 'TelecommResource',
    component: TelecommResource,
    meta: {
      title: '电信资源 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/data-import',
    name: 'DataImport',
    component: DataImport,
    meta: {
      title: '数据导入 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/operation-overview',
    name: 'OperationOverview',
    component: OperationOverview,
    meta: {
      title: '运营数据概览 - 作战资源库'
    }
  },
  {
    path: '/network-warfare-resource/hit-posts',
    name: 'HitPostsDetail',
    component: HitPostsDetail,
    meta: {
      title: '爆款贴文排行榜 - 作战资源库'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '作战资源库'
  next()
})

export default router
