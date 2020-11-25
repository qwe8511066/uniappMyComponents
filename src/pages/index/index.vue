<template>
  <view class>
    <u-button @click="goPublicPages">列表的业务组件</u-button>
    <u-button @click="signOut">退出登录</u-button>
  </view>
</template>

<script>
import { checkArrayString } from '@/utils/index'

import { removeToken } from '@/utils/auth'
export default {
  data() {
    return {}
  },
  onLoad() {},
  methods: {
    goPublicPages() {
      uni.navigateTo({
        url: `/pages/publicPages/index`,
      })
    },
    signOut() {
      removeToken()
      uni.redirectTo({
        url: `/pages/login/index`,
      })
    },
  },
}
</script>