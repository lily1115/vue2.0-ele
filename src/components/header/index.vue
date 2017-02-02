<template>
  <div class="header">
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64px" height="64px" :src="seller.avatar" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span></div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span><span class="text">
            {{seller.supports[0].description}}
          </span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">
          {{seller.supports.length}}个
        </span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin_wrapper" @click="showDetail">
      <span class="bulletin_icon"></span><span class="bulletin_text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div v-show="detailShow" class="detail">
      <div class="detail_wrapper clearfix">
        <div class="detail_main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star_wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="support">
            <li class="support-item" v-for="support in seller.supports">
              <span class="icon" :class="classMap[support.type]"></span><span class="text">
              {{support.description}}
              </span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin"><p class="content">{{seller.bulletin}}</p></div>
          <!-- <div class="discount" :class="type"+item.type v-for="item in seller.supports">{{item.description}}</div>
          <p>{{seller.bulletin}}</p> -->
        </div>
      </div>
      <div class="detail_close" @click="hideDetail">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>
  
</template>

<script >
import star from 'components/star/index'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      detailShow: false
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  },
  components: {
    star
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" >
// @import '../../common/stylus/icon.styl'
@import "../../common/stylus/mixin";
.header
  position: relative
  overflow: hidden
  color: #fff
  background: rgba(7, 17, 27, 0.5)
  .content-wrapper
    position: relative
    overflow: hidden
    padding: 24px 12px 18px 24px
    font-size: 0
    .avatar
      display: inline-block
      vertical-align: top
      img
        border-radius: 2px
    .content
      display: inline-block
      margin-left: 16px
      line-height: 1.5
      .title
        margin: 2px 0 6px 0
        .brand
          display: inline-block
          vertical-align: top
          width: 30px
          height: 18px
          bg-img('./img/brand')
          background-size: 30px 18px
          background-repeat: no-repeat
        .name
          margin-left: 6px
          font-size: 16px
          font-weight: bold
          line-height: 18px
      .description
        font-size: 14px
        margin-bottom: 6px
      .support
        .icon
          display: inline-block
          margin-right: 4px
          width: 12px
          height: 12px
          vertical-align: top
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-img('./img/decrease_1')
          &.discount
            bg-img('./img/discount_1')
          &.guarantee
            bg-img('./img/guarantee_1')
          &.invoice
            bg-img('./img/invoice_1')
          &.special
            bg-img('./img/special_1')
        .text
          font-size: 12px
          line-height: 12px
    .support-count
      position: absolute
      right: 12px
      bottom: 18px
      padding: 0 8px
      font-size: 12px
      line-height: 24px
      text-align: center
      border-radius: 14px
      background-color: rgba(0,0,0,0.2)
      .count
        vertical-align: top
        font-size: 10px
      .icon-keyboard_arrow_right
        margin-left: 2px
        line-height: 24px
        font-size: 10px
  .bulletin_wrapper
    position: relative
    height: 28px
    line-height: 28px
    padding: 0 22px 0 12px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    background: rgba(7, 17, 27, 0.2)
    .bulletin_icon
      display: inline-block
      vertical-align: top
      margin-top: 8px
      width: 22px
      height: 12px
      bg-img('./img/bulletin')
      background-size: 22px 12px
      background-repeat: no-repeat
    .bulletin_text
      margin: 0 4px;
      vertical-align: top;
      font-size: 10px;
    .icon-keyboard_arrow_right
      position: absolute
      font-size: 10px
      right: 12px
      top: 8px  
  .background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -1
    -webkit-filter: blur(10px)
    filter: blur(10px)
  .detail
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(7, 17, 27, 0.8)
    z-index: 100
    .detail_wrapper
      width: 100%
      min-height: 100%
      .detail_main
        padding-bottom: 64px
        margin-top: 64px
        .name
          text-align: center
          font-size: 16px
          font-weight: 700
          color: #fff
        .star-wrapper
          margin-top: 18px
          padding: 2px 0
          text-align: center
        .title
          display: flex
          margin: 28px auto 24px
          width: 80%
          .line
            width: 34%
            border-top: 1px solid rgba(255, 255, 255, 0.2)
            vertical-align: top
          .text
            margin-top: -20px
            padding: 12px
        .bulletin
          width: 80%
          margin: 0 auto
          .content
            padding: 0 12px
            font-size: 12px
            font-weight: 200
            line-height: 2
        .support
          width: 80%
          margin: 0 auto
          .support-item
            padding: 0 12px
            margin-bottom: 12px
            font-size: 0
            .icon
              display: inline-block
              margin-right: 6px
              width: 16px
              height: 16px
              vertical-align: top
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                bg-img('./img/decrease_2')
              &.discount
                bg-img('./img/discount_2')
              &.guarantee
                bg-img('./img/guarantee_2')
              &.invoice
                bg-img('./img/invoice_2')
              &.special
                bg-img('./img/special_2')
            .text
              font-size: 12px
              font-weight: 200
              line-height: 12px
    .detail_close
      position: relative
      width: 32px
      height: 32px
      margin: -64px auto 0 auto
      clear: both
      font-size: 32px
 
</style>