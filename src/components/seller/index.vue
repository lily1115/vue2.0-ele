<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <div class="name">{{seller.name}}</div>
        <div class="detail border-1px">
          <div class="star-wrapper"><star :size="36" :score="seller.score"></star></div>
          <div class="detailNum"><span class="ratingCount">({{seller.ratingCount}})</span>月售{{seller.sellCount}}份</div>
        </div>
        <div class="favoriteIcon" @click="toggleActive">
          <span class="icon-favorite" :class="{'favorite' : active}"></span><span class="text">{{collectText}}</span>
        </div>
        <ul class="remark">
          <li><h2>起送价</h2><span>{{seller.minPrice}}</span>元</li>
          <li><h2>商家配送</h2><span>{{seller.deliveryPrice}}</span>元</li>
          <li><h2>平均配送时间</h2><span>{{seller.deliveryTime}}</span>分钟</li>
        </ul>
      </div>
      <vLine></vLine>
      <div class="bulletin-wrapper">
        <div class="name">公告与活动</div>
        <div class="bulletin">{{seller.bulletin}}</div>        
        <ul v-if="seller.supports" class="support">
          <li class="support-item" v-for="support in seller.supports">
            <span class="icon" :class="classMap[support.type]"></span><span class="text">
            {{support.description}}
            </span>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="pics">
        <h2>商家实景</h2>
        <div class="picWrapper" ref="picWrapper">
          <ul class="picList" ref="picList">
            <li v-for="item in seller.pics"><img :src="item" width="120" height="90" alt=""></li>
          </ul>
        </div>
      </div>
      <div class="line"></div>
      <div class="infos">
        <h2>商家信息</h2>
        <ul>
          <li v-for="item in seller.infos">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
  
</template>

<script>
import Star from 'components/star'
import vLine from 'components/line'
import BScroll from 'better-scroll'
import { saveToLocal, loadFromLocal } from 'common/js/store'
export default {
  name: 'hello',
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      active: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  updated () {
    this._initScroll()
  },
  computed: {
    collectText () {
      return this.active ? '已收藏' : '收藏'
    }
  },
  watch: {
    seller () {
      this.$nextTick(() => {
        console.log('watch')
        this._initScroll()
        this._initPics()
      })
    }
  },
  mounted () {
    this._initPics()
    // this.$nextTick(() => {
    //   console.log('mounted')
    //   this._initScroll()
    //   // this._initPics()
    // })
  },
  methods: {
    _initScroll () {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPics () {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        let width = (picWidth + margin) * this.seller.pics.length - margin
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical' // 忽略垂直方向的滚动
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    },
    toggleActive (event) {
      if (!event._constructed) {
        return
      }
      this.active = !this.active
      saveToLocal(this.seller.id, 'favorite', this.active)
    }
  },
  components: {
    Star,
    vLine
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" >
@import '../../common/stylus/mixin.styl'
.seller
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .overview
    position: relative
    margin: 18px
    .name
      font-size: 14px
    .detail
      display: flex
      padding-bottom: 18px
      margin-top: 8px
      font-size: 12px
      border-1px(rgba(7, 17, 27, .1))
      .star-wrapper
        height: 18px
        .star
          margin-top: 0
      .detailNum
        display: inline-block
        margin-top: 2px
      .ratingCount
        margin: 0 12px 0 8px
    .remark
      padding-top: 18px
      display: flex
      li
        flex: 1
        text-align: center
        font-size: 10px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        &:last-child
          border-right: 0
        h2
          margin-bottom: 4px
          color: #999
        span
          font-size: 24px
          font-weight: 200
    .favoriteIcon
      position: absolute
      width: 50px
      right: 0px
      top: -4px
      text-align: center
      .icon-favorite
        display: block
        font-size: 24px
        line-height: 24px
        color: #ccc
        &.favorite
          color: red
      .text
        margin-top: 4px
        font-size: 10px
        color: #999
  .bulletin-wrapper
    padding: 18px 18px 0 18px
    .name
      margin-bottom: 8px
      font-size: 14px
      color: #07111b
      font-weight: 500
      line-height: 14px
    .bulletin
      padding: 0 6px
      color: red
      font-size: 10px
      line-height: 2
    .support
      margin-top: 16px
      .support-item
        font-size: 0
        padding: 16px 12px
        border-1px(rgba(7,17,27,.1));
        &:last-child
          border-none()
        .icon
          display: inline-block
          margin-right: 6px
          width: 16px
          height: 16px
          vertical-align: top
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-img('./img/decrease_3')
          &.discount
            bg-img('./img/discount_3')
          &.guarantee
            bg-img('./img/guarantee_3')
          &.invoice
            bg-img('./img/invoice_3')
          &.special
            bg-img('./img/special_3')
        .text
          font-size: 12px
          color: #07111b
          line-height: 16px
  .pics
    margin: 18px  
    h2
      margin-bottom: 12px
      font-size: 14px
      font-weight: 500
      color: rgb(7,17,27)
    .picWrapper
      width: 100%
      overflow: hidden
      white-space: nowrap
      ul
        display: flex
        flex-direction: colume
        li
          flex: 1
          margin-right: 6px
  .infos
    padding: 18px 18px 0 18px 
    h2
      padding-bottom: 12px
      font-size: 14px
      font-weight: 500
      border-1px(#f3f3f3);
      color: rgb(7,17,27)
    ul
      li
        border-1px(rgba(7,17,27,.1));
        padding: 16px 12px
        font-size: 12px
        &:last-child
          border-none()
</style>