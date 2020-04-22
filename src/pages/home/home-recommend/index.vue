<template>
  <scroll-view class="recommend_view"
               @scrolltolower="handleScrollToLower"
               scroll-y
               v-if="recommendList.length>0">
    <view class="recommend_wrap">
      <navigator :url="`/pages/album/index?id=${item.target}`"
                 class="recommend_item"
                 v-for="item in recommendList"
                 :key="item.id">
        <image mode="widthFix"
               :src="item.thumb"></image>
      </navigator>
    </view>
    <view class="months_wrap">
      <view class="months_title">
        <view class="months_title_info">
          <view class="months_info">
            <text>{{ monthsList.DD }} /</text>{{ monthsList.MM }} 月
          </view>
          <view class="months_text">{{ monthsList.title }}</view>
        </view>
        <view class="months_title_more">更多></view>
      </view>
      <view class="months_content">
        <view class="months_item"
              v-for="(item,index) in monthsList.items"
              :key="item.id">
          <go-detail :list="monthsList.items"
                     :index="index">
            <image mode="aspectFill"
                   :src="item.thumb + item.rule.replace('$<Height>', 360)"></image>
          </go-detail>
        </view>
      </view>
    </view>
    <view class="hots_wrap">
      <view class="hots_title">
        <text>热门</text>
      </view>
      <view class="hots_content">
        <view class="hots_item"
              v-for="(item,index) in verticalList"
              :key="item.id">
          <go-detail :list="verticalList"
                     :index="index">
            <image mode="widthFix"
                   lazy-load
                   :src="item.thumb"></image>
          </go-detail>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import moment from 'moment'
import goDetail from "@/components/goDetail"
export default {
  data () {
    return {
      queryParams: {
        limit: 30,
        order: 'hot',
        skip: 0
      },
      recommendList: [], //推荐
      monthsList: {}, //月份
      verticalList: [], //热门
      hasMore: true //是否有数据
    }
  },
  components: {
    goDetail
  },
  mounted () {
    uni.setNavigationBarTitle({ title: "推荐" })
    this.getRecommendData()
  },
  methods: {
    // 获取推荐数据
    getRecommendData () {
      this.request({
        url: '/image/v3/homepage/vertical',
        data: this.queryParams
      }).then(res => {
        console.log(res)
        if (res.res.vertical.length === 0) {
          // 没有数据了
          uni.showToast({
            title: "没有更多数据了",
            icon: "none"
          })
          this.hasMore = false
          return
        }
        if (this.recommendList.length === 0) {
          this.recommendList = res.res.homepage[1].items
          this.monthsList = res.res.homepage[2]
          this.monthsList.MM = moment(this.monthsList.stime).format('MM')
          this.monthsList.DD = moment(this.monthsList.stime).format('DD')
        }
        this.verticalList = this.verticalList.concat(res.res.vertical)
      })
    },
    // 滚动条触底
    handleScrollToLower () {
      if (this.hasMore) {
        this.queryParams.skip = this.queryParams.skip + this.queryParams.limit
        console.log(this.queryParams)
        this.getRecommendData()
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
<style lang="scss" scoped>
.recommend_view {
  height: calc(100vh - 72rpx);
}
.recommend_wrap {
  display: flex;
  flex-wrap: wrap;
  .recommend_item {
    width: 50%;
    border: 5rpx solid #ffffff;
  }
}
.months_wrap {
  .months_title {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;

    .months_title_info {
      color: $theme-color;
      font-size: 30rpx;
      font-weight: 600;
      display: flex;
      .months_info {
        text {
          font-size: 36rpx;
        }
      }

      .months_text {
        font-size: 34rpx;
        color: #666;
        margin-left: 30rpx;
      }
    }

    .months_title_more {
      font-size: 24rpx;
      color: $theme-color;
    }
  }

  .months_content {
    display: flex;
    flex-wrap: wrap;
    .months_item {
      width: 33.333%;
      border: 5rpx solid #ffffff;
    }
  }
}
.hots_wrap {
  .hots_title {
    padding: 20rpx;
    text {
      border-left: 10px solid $theme-color;
      font-size: 34rpx;
      padding-left: 20rpx;
      font-weight: 600;
    }
  }
  .hots_content {
    display: flex;
    flex-wrap: wrap;
    .hots_item {
      width: 33.33%;
      border: 5rpx solid #ffffff;
    }
  }
}
</style>
