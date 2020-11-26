<template>
  <section class="PullScroll-Page">
    <sPullScroll
      ref="pullScroll"
      :show-down-success="true"
      :back-top="true"
      :pullDown="pullDown"
      :pullUp="getList"
      :backTop="backTop"
    >
      <div>
        <u-input v-model="myPages.keyword" type="text" border />
        <slot :data="data"></slot>
      </div>
    </sPullScroll>
  </section>
</template>

<script>
import sPullScroll from './sPullScroll'
import { checkArrayString, getMultistage } from '@/utils/index'
export default {
  name: 'publicPages',
  components: {
    sPullScroll,
  },
  props: {
    //列表请求的url
    listServe: {
      type: String,
      default: '',
    },
    listServeMethod: {
      type: String,
      default: 'POST',
    },
    //基本参数
    baseParams: {
      type: Object,
      default: function () {
        return {}
      },
    },
    backTop: {
      type: Boolean,
      default: true,
    },
    myPages: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      // 传给后台的分页
      page: {
        // 每页条数
        pageSize: 10,
      },

      data: [],
      timer: null,
    }
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        console.log('refresh')
        this.$refs.pullScroll.refresh()
      })
    },
    pullDown(pullScroll) {
      this.data = []
      this.getList(pullScroll)
    },
    getList(pullScroll) {
      this.page = Object.assign({}, this.page, this.myPages)
      this.page = Object.assign({}, this.page, this.baseParams)
      this.page.page = pullScroll.page
      this.loading = true
      this.$http[this.listServeMethod.toLowerCase()](
        this.listServe,
        this.page
      ).then((data) => {
        const value = getMultistage(data, 'list')
        let totalCount = getMultistage(data, 'totalCount')
        totalCount = totalCount ? totalCount : 0
        value.forEach((element) => {
          this.data.push(element)
        })
        if (this.data.length >= totalCount) {
          pullScroll.finish()
        } else {
          pullScroll.success()
        }
      })
    },
  },
  mounted() {
    this.refresh()
  },
}
</script>

<style lang="scss">
.PullScroll-Page {
  -webkit-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  height: 100%;
  padding: 40rpx;
  .btn {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    &:not(:first-child) {
      margin-top: 40rpx;
    }
  }
}
</style>
