<template>
  <view>
    <view class="video_tab">
      <view class="video_tab_title">
        <view class="title_inner">
          <uni-segmented-control :current="current"
                                 :values="items.map(v=>v.title)"
                                 @clickItem="onClickItem"
                                 style-type="text"
                                 active-color="#d4237a"></uni-segmented-control>

        </view>
        <view class="iconfont iconsearch"> </view>
      </view>
      <view class="video_tab_content">
        <block v-if="current<4">
          <video-main :videoObj="items[current]"></video-main>
        </block>
        <block v-if="current===4">
          <video-category :videoObj="items[current]"></video-category>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import { uniSegmentedControl } from '@dcloudio/uni-ui'
import videoMain from './video-main'
import videoCategory from './video-category'
export default {
  components: {
    uniSegmentedControl,
    videoMain,
    videoCategory
  }, data () {
    return {
      items: [{
        title: "推荐", url: "/videoimg/v1/videowp/featured", queryParams: { limit: 30, skip: 0, order: "hot" }
      }, {
        title: "娱乐", url: "/videoimg/v1/videowp/category/59b25abbe7bce76bc834198a", queryParams: { limit: 30, skip: 0, order: "new" }
      }, {
        title: "最新", url: "/videoimg/v1/videowp/videowp", queryParams: { limit: 30, skip: 0, order: "new" }
      }, {
        title: "热门", url: "/videoimg/v1/videowp/videowp", queryParams: { limit: 30, skip: 0, order: "hot" }
      }, {
        title: "分类", url: "/videoimg/v1/videowp/category", queryParams: {}
      }],
      current: 0
    }
  },
  methods: {
    onClickItem (e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    }
  },
  onLoad () {

  }
}
</script>
<style lang="scss" scoped>
.video_tab {
  .video_tab_title {
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
  .video_tab_content {
  }
}
</style>
