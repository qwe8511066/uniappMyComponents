// router.js
import { RouterMount, createRouter } from 'uni-simple-router';
import {
  getToken
} from '@/utils/auth'
const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  routes: [...ROUTES],
  detectBeforeLock: () => { router.$lockStatus = false; },
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  if (token) {

  } else {
    if (to.path != '/pages/login/index') {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      })
      setTimeout(() => {
        next({ path: '/pages/login/index' });
      }, 1500);
      return false
    }
  }
  next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {

  console.log('跳转结束')
  // next();
})

export {
  router,
  RouterMount
}