<template>
  <view class="myContent">
    <u-card title="登录标题">
      <view class slot="body">
        <u-button @click="goPublicPages">列表的业务组件</u-button>
      </view>
    </u-card>
    <publicPages class="flexMain"></publicPages>
  </view>
</template>

<script>
import { checkArrayString } from '@/utils/index'
export default {
  components: {},
  data() {
    return {}
  },
  methods: {
    goPublicPages() {},
  },
  onLoad() {
    this.$http
      .post('api/project/getprojectslistbypage', { page: 1, pageSize: 10 })
      .then((data) => {
        console.log(data)
      })
    console.log(process.env.VUE_APP_SERVE_URL)
  },
}
</script>