/* 封装左右手势操作
1.提供插槽
2.对外提供数据(滑动方向)
 */
<template>
  <view @touchstart="handleTouchStart"
        @touchend="handleTouchEnd">
    <slot></slot>
  </view>
</template>

<script>
export default {
  data () {
    return {
      startTime: 0, //开始触摸时间 
      startX: 0, //开始触摸时X坐标
      startY: 0 //开始触摸时Y坐标 
    }
  },
  methods: {
    // 触摸开始
    handleTouchStart (e) {
      // 1.记录触摸开始的时间
      this.startTime = Date.now()
      this.startX = e.changedTouches[0].pageX
      this.startY = e.changedTouches[0].pageY
    },
    // 触摸结束
    handleTouchEnd (e) {
      // 1.判断滑动时间，超过一定的时长就拒绝滑动
      let endTime = Date.now()
      let startTime = this.startTime
      let startX = this.startX
      let startY = this.startY
      let endX = e.changedTouches[0].pageX
      let endY = e.changedTouches[0].pageY
      if (endTime - startTime > 3000) {
        // 如果用户触摸划屏时间过长超过3秒就不操作
        return
      }
      // 2.判断X轴滑动距离，少于一定范围就不操作，因为往左划是负数，所以取绝对值
      if (Math.abs(endX - startX) > 50 && Math.abs(endY - startY) < 10) {
        // 滑动距离合法
        // 3.判断滑动方向（如果endX大于startX说明是右滑，反之是左滑）
        let direction = ""
        if (endX > startX) {
          direction = "right"
        } else {
          direction = "left"
        }
        this.$emit("childFn", { direction })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>