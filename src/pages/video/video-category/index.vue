<template>
  <scroll-view class="cate_main"
               enable-flex
               scroll-y>
    <navigator class="cate_item"
               :url="`/pages/videoCate/index?id=${item.id}`"
               v-for="item in cateList"
               :key="item.id">
      <image mode="aspectFill"
             :src="item.img"></image>
      <view class="cate_name">{{item.name}}</view>
    </navigator>
  </scroll-view>
</template>

<script>
export default {
  props: {
    videoObj: Object
  },
  data () {
    return {
      cateList: [],
      hasMore: true
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取页面数据
    getData () {
      let { title, url } = this.videoObj
      uni.setNavigationBarTitle({ title: title })
      this.request({ url }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.cateList = res.res.category
        }
      })
    },
  }
}
</script>
<style lang='scss' scoped>
.cate_main {
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 72rpx);
  .cate_item {
    position: relative;
    width: 50%;
    border: 5rpx solid #ffffff;
    image {
      height: 276rpx;
    }
    .cate_name {
      position: absolute;
      width: 100%;
      height: 50rpx;
      left: 0;
      bottom: 0;
      color: #fff;
      background-image: linear-gradient(
        to right top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      );
      font-size: 40rpx;
      line-height: 50rpx;
      padding-left: 20rpx;
    }
  }
}
</style>