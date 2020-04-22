<template>
  <view class="video_play">
    <!-- 页面背景图 -->
    <image :src="videoObj.img"
           class="bg_img"></image>
    <!-- 工具栏 -->
    <view class="video_tool">
      <view :class="['iconfont',is_muted?'iconjingyin':'iconshengyin']"
            @click="handleSwitchMute"></view>
      <view class="iconfont iconzhuanfa">
        <button open-type="share"></button>
      </view>
    </view>
    <!-- 视频 -->
    <view class="video_wrap">
      <video :src="videoObj.video"
             object-fit="fill"
             :muted="is_muted"></video>
    </view>
    <!-- 下载 -->
    <view class="download">
      <view class="download_btn"
            @click="handleDownLoadVideo">下载高清</view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      videoObj: {},
      is_muted: false
    }
  },
  onLoad (options) {
    // this.videoObj = JSON.parse(decodeURIComponent(options.videoObj))
    this.videoObj = getApp().globalData.videoObj
  },
  methods: {
    // 点击切换静音
    handleSwitchMute () {
      this.is_muted = !this.is_muted
    },
    // 点击下载视频
    async handleDownLoadVideo () {
      try {
        uni.showLoading({ title: "下载中" })
        let { tempFilePath } = (await uni.downloadFile({ url: this.videoObj.video }))[1]
        let res = await uni.saveVideoToPhotosAlbum({ filePath: tempFilePath })
        await uni.hideLoading()
        uni.showToast({ title: "下载成功" })
      } catch (error) {
        await uni.hideLoading()
        uni.showToast({ title: "下载失败", icon: "none" })
        console.log(error)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.video_play {
  position: relative;
  .bg_img {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -1;
    filter: blur(20px);
  }

  .video_tool {
    height: 80rpx;
    display: flex;
    justify-content: flex-end;
    .iconfont {
      width: 80rpx;
      color: #ffffff;
      font-size: 50rpx;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20rpx;
    }
    .iconzhuanfa {
      position: relative;
      button {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: transparent;
      }
    }
  }

  .video_wrap {
    display: flex;
    justify-content: center;
    video {
      width: 360rpx;
      height: 600rpx;
    }
  }

  .download {
    display: flex;
    justify-content: center;
    margin-top: 30rpx;
    .download_btn {
      width: 360rpx;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      border: 1rpx solid #ffffff;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>