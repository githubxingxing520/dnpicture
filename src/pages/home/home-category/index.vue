<template>
  <view class="cate_wrap">
    <navigator :url="`/pages/imgCategory/index?id=${item.id}`"
               class="cate_item"
               v-for="item in cateList"
               :key="item.id">
      <image mode="aspectFill"
             :src="item.cover"></image>
      <view class="cate_name">{{item.name}}</view>
    </navigator>
  </view>
</template>

<script>
export default {
  data () {
    return {
      cateList: []
    }
  },
  mounted () {
    uni.setNavigationBarTitle({ title: "分类" })
    this.getCateData()
  },
  methods: {
    // 获取分类页面数据
    getCateData () {
      this.request({ url: "/image/v1/vertical/category" }).then(res => {
        if (res.code === 0) {
          this.cateList = res.res.category
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.cate_wrap {
  display: flex;
  flex-wrap: wrap;
  .cate_item {
    width: 33.33%;
    position: relative;
    border: 5rpx solid #ffffff;
    image {
      height: 240rpx;
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