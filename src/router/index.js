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

const routes = [
  {
    path: '/',
    redirect: '/social'
  },
  {
    path: '/social',
    name: 'SocialPlatform',
    component: SocialPlatform,
    meta: {
      title: '社交平台 - 作战资源库'
    }
  },
  {
    path: '/instant-messaging',
    name: 'InstantMessaging',
    component: InstantMessaging,
    meta: {
      title: '即时通讯 - 作战资源库'
    }
  },
  {
    path: '/blog-forum',
    name: 'BlogForum',
    component: BlogForum,
    meta: {
      title: '博客论坛 - 作战资源库'
    }
  },
  {
    path: '/email',
    name: 'Email',
    component: Email,
    meta: {
      title: '电子邮件 - 作战资源库'
    }
  },
  {
    path: '/account-detail',
    name: 'AccountDetail',
    component: AccountDetail,
    meta: {
      title: '账号详情 - 作战资源库'
    }
  },
  {
    path: '/device',
    name: 'SpecialDevice',
    component: SpecialDevice,
    meta: {
      title: '专用设备 - 作战资源库'
    }
  },
  {
    path: '/phone',
    name: 'PhoneCard',
    component: PhoneCard,
    meta: {
      title: '手机卡号 - 作战资源库'
    }
  },
  {
    path: '/proxy',
    name: 'NetworkProxy',
    component: NetworkProxy,
    meta: {
      title: '网络代理 - 作战资源库'
    }
  },
  {
    path: '/telecom',
    name: 'TelecommResource',
    component: TelecommResource,
    meta: {
      title: '电信资源 - 作战资源库'
    }
  },
  {
    path: '/data-import',
    name: 'DataImport',
    component: DataImport,
    meta: {
      title: '数据导入 - 作战资源库'
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
