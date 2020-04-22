<template>
  <scroll-view class="album_view"
               scroll-y
               @scrolltolower="handleScrollTolower">
    <view class="album_swiper">
      <swiper indicator-dots
              autoplay
              circular>
        <swiper-item v-for="item in swiperList"
                     :key="item.id">
          <image mode="widthFix"
                 :src="item.thumb"></image>
        </swiper-item>
      </swiper>
    </view>
    <view class="album_list">
      <navigator class="album_item"
                 v-for="item in albumList"
                 :key="item.id"
                 :url="'/pages/album/index?id='+item.id">
        <view class="album_img">
          <image mode="aspectFill"
                 :src="item.cover"></image>
        </view>
        <view class="album_info">
          <view class="album_name">{{item.name}}</view>
          <view class="album_desc">{{item.desc}}</view>
          <view class="album_btn">
            <view class="album_guanzhu">+ 关注</view>
          </view>
        </view>
      </navigator>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data () {
    return {
      queryParams: {
        limit: 30,
        order: 'hot',
        skip: 0
      },
      swiperList: [], //轮播图
      albumList: [], //专辑
      hasMore: true //是否有数据
    }
  },
  mounted () {
    uni.setNavigationBarTitle({ title: "专辑" })
    this.getAlbumData()
  },
  methods: {
    // 获取专辑数据
    getAlbumData () {
      this.request({
        url: "/image/v1/wallpaper/album",
        data: this.queryParams
      }).then(res => {
        console.log(res)
        if (res.res.album.length === 0) {
          // 没有数据了
          uni.showToast({
            title: "没有更多数据了",
            icon: "none"
          })
          this.hasMore = false
          return
        }
        if (this.swiperList.length === 0) {
          this.swiperList = res.res.banner
        }
        this.albumList = [...this.albumList, ...res.res.album]
      })
    },
    // 滚动到底
    handleScrollTolower () {
      if (this.hasMore) {
        this.queryParams.skip = this.queryParams.skip + this.queryParams.limit
        console.log(this.queryParams)
        this.getAlbumData()
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
.album_view {
  height: calc(100vh - 72rpx);
}
.album_swiper {
  swiper {
    // height: 638 283;
    height: 100vw * 284 /640;
    image {
    }
  }
}
.album_list {
  padding: 10rpx;
  .album_item {
    padding: 10rpx 0;
    display: flex;
    border-bottom: 1rpx solid #ccc;
    .album_img {
      flex: 1;
      padding: 10rpx;
      image {
        width: 200rpx;
        height: 200rpx;
      }
    }

    .album_info {
      flex: 2;
      padding: 0 10rpx;
      overflow: hidden;
      .album_name {
        font-size: 30rpx;
        color: #000;
        padding: 10rpx 0;
      }

      .album_desc {
        padding: 10rpx 0;
        font-size: 24rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .album_btn {
        padding: 10rpx;
        display: flex;
        justify-content: flex-end;
        .album_guanzhu {
          color: $theme-color;
          padding: 10rpx;
          border: 1rpx solid $theme-color;
        }
      }
    }
  }
}
</style>