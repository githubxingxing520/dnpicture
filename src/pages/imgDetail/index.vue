<template>
  <view>
    <!-- 用户信息 -->
    <view class="user_info">
      <view class="user_icon">
        <image mode="widthFix"
               :src="imgDetail.user.avatar"></image>
      </view>
      <view class="user_desc">
        <view class="user_name">{{imgDetail.user.name}}</view>
        <view class="user_time">{{imgDetail.new_atime}}</view>
      </view>
    </view>
    <!-- 高清大图 -->
    <view class="high_img">
      <swiper-action @childFn="handleTouch">
        <image mode="widthFix"
               :src="imgDetail.thumb"></image>
      </swiper-action>
    </view>
    <!-- 点赞 -->
    <view class="user_rank">
      <view class="rank">
        <text class="iconfont icondianzan">{{imgDetail.rank}}</text>
      </view>
      <view class="user_collect">
        <text class="iconfont iconshoucang">收藏</text>
      </view>
    </view>
    <!-- 专辑 -->
    <view class="album_wrap">
      <view class="album_title">相关</view>
      <view class="album_list">
        <view class="album_item"
              v-for="item in albumList"
              :key="item.id">
          <view class="album_cover">
            <image mode="aspectFill"
                   :src="item.cover"></image>
          </view>
          <view class="album_info">
            <view class="album_info_text">专辑</view>
            <view class="album_name">{{item.name}}</view>
            <text class="iconfont iconiconfontjiantou4"></text>
          </view>
        </view>
      </view>
    </view>
    <!-- 最热评论 -->
    <view class="comment hot"
          v-if="hotList.length>0">
      <view class="comment_title">
        <text class="iconfont iconhot1"></text>
        <text class="comment_text">最热评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item"
              v-for="item in hotList"
              :key="item.id">
          <view class="comment_user">
            <view class="user_icon">
              <image mode="widthFix"
                     :src="item.user.avatar"></image>
            </view>
            <view class="user_name">
              <view class="user_nickname">{{item.user.name}}</view>
              <view class="user_time">{{item.cnTime}}</view>
            </view>
            <view class="user_badge">
              <image v-for="item2 in item.user.title"
                     :key="item2.icon"
                     :src="item2.icon"></image>
            </view>
          </view>
          <view class="comment_desc">
            <view class="comment_content">{{item.content}}</view>
            <view class="comment_like">
              <text class="iconfont icondianzan">{{item.size}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 最新评论 -->
    <view class="comment new"
          v-if="commentList.length>0">
      <view class="comment_title">
        <text class="iconfont iconpinglun"></text>
        <text class="comment_text">最新评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item"
              v-for="item in commentList"
              :key="item.id">
          <view class="comment_user">
            <view class="user_icon">
              <image :src="item.user.avatar"></image>
            </view>
            <view class="user_name">
              <view class="user_nickname">{{item.user.name}}</view>
              <view class="user_time">{{item.cnTime}}</view>
            </view>
            <view class="user_badge">
              <image v-for="item2 in item.user.title"
                     :key="item2.icon"
                     :src="item2.icon"></image>
            </view>
          </view>
          <view class="comment_desc">
            <view class="comment_content">{{item.content}}</view>
            <view class="comment_like">
              <text class="iconfont icondianzan">{{item.size}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 下载 -->
    <view class="download">
      <view class="download_btn"
            @click="handleDownload">下载图片</view>
    </view>
  </view>
</template>

<script>
import moment from 'moment'
import swiperAction from "@/components/swiperAction";
export default {
  data () {
    return {
      imgDetail: {},
      albumList: [], //专辑数据
      hotList: [], //最热评论
      commentList: [], //最新评论
      imgIndex: 0
    }
  },
  components: {
    swiperAction
  },
  onLoad () {
    let { imgIndex } = getApp().globalData
    this.imgIndex = imgIndex
    this.getData()
  },
  methods: {
    getData () {
      let { imgList } = getApp().globalData
      this.imgDetail = imgList[this.imgIndex]
      moment.locale("zh-cn")
      this.imgDetail.new_atime = moment(this.imgDetail.atime * 1000).fromNow()
      this.getImgCommentData(this.imgDetail.id)
    },
    // 获取图片评论
    getImgCommentData (id) {
      this.request({
        url: `/image/v2/wallpaper/wallpaper/${id}/comment`
      }).then(res => {
        this.albumList = res.res.album
        res.res.hot.forEach(v => v.cnTime = moment(v.atime * 1000).fromNow())
        res.res.comment.forEach(v => v.cnTime = moment(v.atime * 1000).fromNow())
        this.hotList = res.res.hot
        this.commentList = res.res.comment
        console.log(res.res)
      })
    },
    // 滑动子传父事件
    handleTouch (e) {
      let direction = e.direction
      // let imgIndex = this.imgIndex
      let { imgList } = getApp().globalData
      if (direction === "right" && this.imgIndex > 0) {
        // 右滑
        this.imgIndex--
        this.getData()
      } else if (direction === "left" && this.imgIndex < imgList.length - 1) {
        // 左滑
        this.imgIndex++
        this.getData()
      } else {
        uni.showToast({
          title: "没有数据了",
          icon: "none"
        })
      }
    },
    // 点击下载图片
    async handleDownload () {
      uni.showLoading({ title: "下载中" })
      let res = await uni.downloadFile({ url: this.imgDetail.img })
      let { statusCode, tempFilePath } = res[1]
      if (statusCode === 200) {
        // 下载成功,开始保存
        let res2 = await uni.saveImageToPhotosAlbum({ filePath: tempFilePath })
        uni.hideLoading()
        uni.showToast({ title: "下载成功" })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.user_info {
  display: flex;
  padding: 20rpx;
  .user_icon {
    padding: 0 20rpx;
    image {
      width: 88rpx;
      border-radius: 50%;
    }
  }
  .user_desc {
    .user_name {
      color: #000;
      font-weight: 600;
    }
    .user_time {
      color: #ccc;
      font-size: 24rpx;
      padding: 10rpx 0;
    }
  }
}
.high_img {
  border-bottom: 1px solid #eee;
}
.user_rank {
  display: flex;
  height: 80rpx;
  border-bottom: 5rpx solid #eee;
  .rank {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user_collect {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.album_wrap {
  padding: 20rpx;
  .album_title {
    padding: 10rpx 0;
  }

  .album_list {
    .album_item {
      display: flex;
      padding: 10rpx 0;
      border-bottom: 10rpx solid #eee;
      .album_cover {
        flex: 1;
        image {
          width: 180rpx;
          height: 180rpx;
        }
      }

      .album_info {
        flex: 3;
        padding-left: 20rpx;
        position: relative;
        .album_info_text {
          width: 100rpx;
          height: 50rpx;
          background-color: $theme-color;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .album_name {
          padding: 10rpx 0;
          color: #888;
        }
        .iconfont {
          font-size: 40rpx;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 10%;
          color: #000;
        }
      }
    }
  }
}
.comment {
  .comment_title {
    padding: 15rpx;
    .iconfont {
      color: red;
      font-size: 40rpx;
    }

    .comment_text {
      font-weight: 600;
      font-size: 28rpx;
      color: #666;
      margin-left: 10rpx;
    }
  }

  .comment_list {
    .comment_item {
      border-bottom: 15rpx solid #eee;
      .comment_user {
        display: flex;
        padding: 20rpx 0;
        .user_icon {
          width: 15%;
          display: flex;
          justify-content: center;
          align-items: center;
          image {
            width: 90%;
            height: 100rpx;
          }
        }

        .user_name {
          flex: 1;
          .user_nickname {
            color: #777;
          }

          .user_time {
            color: #ccc;
            font-size: 24rpx;
            padding: 5rpx;
          }
        }

        .user_badge {
          image {
            display: inline-block;
            width: 40rpx;
            height: 40rpx;
          }
        }
      }

      .comment_desc {
        display: flex;
        padding: 30rpx 0;
        .comment_content {
          flex: 1;
          padding-left: 15%;
          color: #000;
        }

        .comment_like {
          text-align: right;
          padding-right: 5rpx;
          .iconfont.icondianzan {
          }
        }
      }
    }
  }
}
.new {
  color: aqua !important;
}
.download {
  display: flex;
  height: 120rpx;
  justify-content: center;
  align-items: center;
  .download_btn {
    width: 90%;
    height: 80%;
    background-color: $theme-color;
    color: #ffffff;
    font-size: 50rpx;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>