import { createRouter, createWebHistory } from 'vue-router'
import SocialPlatform from '@/pages/NetworkWarfareResourse/SocialPlatform.vue'
import InstantMessaging from '@/pages/NetworkWarfareResourse/InstantMessaging.vue'
import BlogForum from '@/pages/NetworkWarfareResourse/BlogForum.vue'
import Email from '@/pages/NetworkWarfareResourse/Email.vue'
import AccountDetail from '@/pages/NetworkWarfareResourse/AccountDetail/Index.vue'

const routes = [
  {
    path: '/',
    redirect: '/social'
  },
  {
    path: '/social',
    name: 'SocialPlatform',
    component: SocialPlatform
  },
  {
    path: '/instant-messaging',
    name: 'InstantMessaging',
    component: InstantMessaging,
    meta: {
      title: '即时通讯 - 网络资源库'
    }
  },
  {
    path: '/blog-forum',
    name: 'BlogForum',
    component: BlogForum,
    meta: {
      title: '博客论坛 - 网络资源库'
    }
  },
  {
    path: '/email',
    name: 'Email',
    component: Email,
    meta: {
      title: '电子邮件 - 网络资源库'
    }
  },
  {
    path: '/account-detail',
    name: 'AccountDetail',
    component: AccountDetail,
    meta: {
      title: '账号详情 - 网络资源库'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '网络资源库'
  next()
})

export default router
