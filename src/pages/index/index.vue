<template>
  <view class>
    <swipeLogo></swipeLogo>
    <u-button @click="goPublicPages">列表的业务组件</u-button>
  </view>
</template>

<script>
import { checkArrayString } from '@/utils/index'
export default {
  data() {
    return {}
  },
  methods: {
    goPublicPages() {
      uni.navigateTo({
        url: `/pages/publicPages/index`,
      })
    },
  },
}
</script>