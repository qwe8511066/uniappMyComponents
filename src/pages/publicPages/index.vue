<template>
  <view class="myContent">
    <publicPages :myPages="myPages" class="flexMain" listServe="api/project/getprojectslistbypage">
      <template v-slot="{data}">
        <u-card v-for="(item,index) in data" :key="index">
          <view class slot="body">
            <view
              class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0"
            >{{item.projects.projectName}}</view>
          </view>
        </u-card>
      </template>
    </publicPages>
  </view>
</template>

<script>
import { checkArrayString } from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      myPages: {
        keyword: '测试',
      },
    }
  },
  methods: {
    goPublicPages() {},
  },
  onLoad() {
    // this.$http
    //   .post('api/project/getprojectslistbypage', { page: 1, pageSize: 10 })
    //   .then((data) => {
    //     console.log(data)
    //   })
    // console.log(process.env.VUE_APP_SERVE_URL)
  },
}
</script>