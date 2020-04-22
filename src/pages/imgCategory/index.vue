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
              v-for="(item,index) in imgCateList"
              :key="item.id">
          <go-detail :index="index"
                     :list="imgCateList">
            <image mode="widthFix"
                   lazy-load
                   :src="item.thumb"></image>
          </go-detail>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { uniSegmentedControl } from '@dcloudio/uni-ui'
import goDetail from "@/components/goDetail"
export default {
  components: {
    uniSegmentedControl,
    goDetail
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
      imgCateList: [],
      hasMore: true //是否有数据
    }
  },
  onLoad (options) {
    this.id = options.id
    this.getImgCateData()
  },
  methods: {
    onClickItem (e) {
      this.queryParams.order = this.items[e.currentIndex].order
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
        this.imgCateList = []
        this.queryParams.skip = 0
      }
      this.getImgCateData()
    },
    // 获取图片分类数据
    getImgCateData () {
      this.request({ url: `/image/v1/vertical/category/${this.id}/vertical`, data: this.queryParams }).then(res => {
        if (res.code === 0) {
          if (res.res.vertical.length === 0) {
            this.hasMore = false
            uni.showToast({
              title: "没有更多数据了",
              icon: "none"
            })
            return
          }
          let res_vertical = res.res.vertical.map(item => ({ ...item, thumb: item.img }))
          this.imgCateList = [...this.imgCateList, ...res_vertical]
          console.log(this.imgCateList)
        }
      })
    },
    // 向下滚动加载更多
    handleScrollTolower () {
      if (this.hasMore) {
        this.queryParams.skip += this.queryParams.limit
        this.getImgCateData()
      } else {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none"
        })
      }
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