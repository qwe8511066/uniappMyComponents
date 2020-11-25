<template>
  <section class="PullScroll-Page">
    <sPullScroll
      ref="pullScroll"
      :show-down-success="true"
      :back-top="true"
      :pullDown="pullDown"
      :pullUp="loadData"
    >
      <ul>
        <li
          v-for="(item,index) of list"
          :key="index"
          style="font-size:30rpx;padding:40rpx;text-align:center;border-bottom:1px solid #aaa"
        >{{item}}</li>
      </ul>
    </sPullScroll>
  </section>
</template>

<script>
import sPullScroll from './sPullScroll'
export default {
  name: 'publicPages',
  components: {
    sPullScroll,
  },
  data() {
    return {
      list: [],
    }
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        this.$refs.pullScroll.refresh()
      })
    },
    pullDown(pullScroll) {
      setTimeout(() => {
        this.loadData(pullScroll)
      }, 200)
    },
    loadData(pullScroll) {
      setTimeout(() => {
        if (pullScroll.page == 1) {
          this.list = []
        }
        const curList = []
        for (let i = this.list.length; i < this.list.length + 20; i++) {
          curList.push(i)
        }
        this.list = this.list.concat(curList)
        if (this.list.length > 60) {
          pullScroll.finish()
        } else {
          pullScroll.success()
        }
      }, 500)
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
