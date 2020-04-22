<template>
  <view>
    <view class="album_bg">
      <image mode="widthFix"
             :src="albumList.cover"></image>
      <view class="album_info">
        <view class="album_name">{{albumList.name}}</view>
        <view class="album_btn">关注专辑</view>
      </view>
    </view>
    <view class="album_author">
      <view class="album_author_info">
        <image mode="widthFix"
               :src="albumList.user.avatar"></image>
        <view class="author_name">{{albumList.user.name}}</view>
      </view>
      <view class="album_author_desc">
        <text>{{albumList.desc}}</text>
      </view>
    </view>
    <view class="album_list">
      <view class="album_item"
            v-for="(item,index) in wallpaperList"
            :key="item.id">
        <go-detail :list="wallpaperList"
                   :index="index">
          <image mode="aspectFill"
                 :src="item.thumb+item.rule.replace('$<Height>',360)"></image>
        </go-detail>
      </view>
    </view>
  </view>
</template>

<script>
import goDetail from "@/components/goDetail"
export default {
  data () {
    return {
      queryParams: {
        limit: 30,
        order: "new",
        skip: 0,
        first: 1
      },
      id: "",
      hasMore: true,
      wallpaperList: [],
      albumList: {}
    }
  },
  components: {
    goDetail
  },
  onLoad (options) {
    this.id = options.id
    this.getAlbumDetailsData()
  },
  onReachBottom () {
    if (this.hasMore) {
      this.queryParams.first = 0
      this.queryParams.skip += this.queryParams.limit
      this.getAlbumDetailsData()
    } else {
      uni.showToast({
        title: "没有更多数据了",
        icon: "none"
      })
    }

  },
  methods: {
    // 获取专辑详情数据
    getAlbumDetailsData () {
      this.request({
        url: `/image/v1/wallpaper/album/${this.id}/wallpaper`,
        data: this.queryParams
      }).then(res => {
        console.log(res)
        if (res.res.wallpaper.length === 0) {
          uni.showToast({
            title: "没有更多数据了",
            icon: "none"
          })
          this.hasMore = false
          return
        }
        if (Object.keys(this.albumList).length === 0) {
          this.albumList = res.res.album
        }
        this.wallpaperList = [...this.wallpaperList, ...res.res.wallpaper]
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.album_bg {
  position: relative;
  image {
  }
  .album_info {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    height: 80rpx;
    align-items: center;
    color: #ffffff;
    padding: 0 15rpx;
    .album_name {
      font-size: 40rpx;
    }
    .album_btn {
      background-color: $theme-color;
      width: 152rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10rpx;
    }
  }
}
.album_author {
  padding: 10rpx;
  .album_author_info {
    display: flex;
    padding: 10rpx 0;
    image {
      width: 50rpx;
    }
    .author_name {
      color: #000;
      margin-left: 15rpx;
    }
  }
  .album_author_desc {
  }
}
.album_list {
  display: flex;
  flex-wrap: wrap;
  .album_item {
    width: 33.33%;
    border: 3rpx solid #ffffff;
    image {
      height: 160rpx;
    }
  }
}
</style>