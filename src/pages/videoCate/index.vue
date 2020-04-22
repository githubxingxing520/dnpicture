<template>
  <view>
    <view class="category_tab">
      <view class="category_tab_title">
        <view class="title_inner">
          <uni-segmented-control :current="current"
                                 :values="items.map(v=>v.title)"
                                 @clickItem="onClickItem"
                                 style-type="text"
                                 active-color="#d4237a"></uni-segmented-control>

        </view>
        <view class="iconfont iconsearch"> </view>
      </view>
      <scroll-view scroll-y
                   enable-flex
                   @scrolltolower="handleScrollTolower"
                   class="category_tab_content">
        <view class="cate_item"
              v-for="item in videowpList"
              :key="item.id"
              @click="goVideo(item)">
          <image mode="widthFix"
                 lazy-load
                 :src="item.img"></image>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { uniSegmentedControl } from '@dcloudio/uni-ui'
export default {
  components: {
    uniSegmentedControl
  }, data () {
    return {
      items: [{
        title: "最新",
        order: "new"
      }, {
        title: "热门",
        order: "hot"
      }],
      current: 0,
      queryParams: {
        limit: 30,
        skip: 0,
        order: "new"
      },
      id: 0,
      videowpList: [],
      hasMore: true //是否有数据
    }
  },
  onLoad (options) {
    this.id = options.id
    this.getVideoCateData()
  },
  methods: {
    onClickItem (e) {
      this.queryParams.order = this.items[e.currentIndex].order
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
        this.videowpList = []
        this.queryParams.skip = 0
      }
      this.getVideoCateData()
    },
    // 获取图片分类数据
    getVideoCateData () {
      this.request({ url: `/videoimg/v1/videowp/category/${this.id}`, data: this.queryParams }).then(res => {
        if (res.code === 0) {
          if (res.res.videowp.length === 0) {
            this.hasMore = false
            uni.showToast({
              title: "没有更多数据了",
              icon: "none"
            })
            return
          }
          console.log(res)
          this.videowpList = [...this.videowpList, ...res.res.videowp]
        }
      })
    },
    // 向下滚动加载更多
    handleScrollTolower () {
      if (this.hasMore) {
        this.queryParams.skip += this.queryParams.limit
        this.getVideoCateData()
      } else {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none"
        })
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
.category_tab {
  .category_tab_title {
    position: relative;
    .title_inner {
      width: 60%;
      margin: 0 auto;
    }
    .iconsearch {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5%;
    }
  }
  .category_tab_content {
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 72rpx);
    .cate_item {
      width: 33.33%;
      border: 5rpx solid #fff;
      image {
      }
    }
  }
}
</style>