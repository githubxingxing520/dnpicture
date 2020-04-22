<template>
  <scroll-view enable-flex
               scroll-y
               @scrolltolower="handleScrollTolower"
               class="video_main">
    <view class="video_item"
          v-for="item in videowpList"
          :key="item.id"
          @click="goVideo(item)">
      <image mode="widthFix"
             :src="item.img"></image>
    </view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    videoObj: Object
  },
  data () {
    return {
      videowpList: [],
      hasMore: true
    }
  },
  watch: {
    videoObj () {
      this.videowpList = []
      this.getData()
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取页面数据
    getData () {
      let { title, url, queryParams } = this.videoObj
      uni.setNavigationBarTitle({ title: title })
      this.request({ url, data: queryParams }).then(res => {
        if (res.code === 0) {
          if (res.res.videowp.length === 0) {
            this.hasMore = false
            uni.showToast({ title: "没有更多数据了", icon: "none" })
            return
          }
          this.videowpList = [...this.videowpList, ...res.res.videowp]
        }
      })
    },
    // 滚动到底加载更多
    handleScrollTolower () {
      if (this.hasMore) {
        this.videoObj.queryParams.skip += this.videoObj.queryParams.limit
        this.getData()
      } else {
        uni.showToast({ title: "没有更多数据了", icon: "none" })
      }
    },
    // 点击跳转到播放页
    goVideo (item) {
      getApp().globalData.videoObj = item
      uni.navigateTo({ url: "/pages/videoPlay/index" })
      //   uni.navigateTo({ url: "/pages/videoPlay/index?videoObj=" + encodeURIComponent(JSON.stringify(item)) })
    }
  }
}
</script>
<style lang='scss' scoped>
.video_main {
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 72rpx);
  .video_item {
    width: 33.33%;
    border: 5rpx solid #ffffff;
    image {
    }
  }
}
</style>