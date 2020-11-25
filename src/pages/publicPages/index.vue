<template>
  <view class="myContent">
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