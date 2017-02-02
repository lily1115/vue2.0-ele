<template>
  <transition name="food">
    <div class="food" ref="food" v-show="showFlag">
      <div class="food-content">
        <div class="food-image">
          <img :src="food.image" alt="">
          <div class="back" @click="hide"><i class="icon-arrow_lift"></i></div>
        </div>
        <div class="food-header">
          <div class="name">{{food.name}}</div>
          <div class="detail">月售{{food.sellCount}}份<span class="ratings">好评率{{food.rating}}%</span></div>
          <div class="price">￥{{food.price}}<span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span></div>
          <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
          </div>
          <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
        </div>
        <vLine></vLine>
        <div class="food-info" v-show="food.info">
          <div class="title">商品介绍</div>
          <div class="info">{{food.info}}</div>
        </div>
        <vLine></vLine>
        <div class="food-ratings">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px" v-for="rating in food.ratings">
                <div class="user">
                  <span class="username">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" alt="">
                </div>
                <div class="rateTime">{{rating.rateTime | formatDate }}</div>
                <div class="rating-content">
                  <i :class="{ 'icon-thumb_up':rating.rateType === 0 ,'icon-thumb_down':rating.rateType === 1 }"></i>
                  <span class="text" v-show="rating.text">{{rating.text}}</span>
                </div>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import Cartcontrol from 'components/cartcontrol'
import Ratingselect from 'components/ratingselect'
import vLine from 'components/line'
import { formatDate } from 'common/js/util'
const ALL = 2
// const POSITIVE = 0
// const NEGATIVE = 1
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.$on('type.select', this.select)
      this.$on('content.toggle', this.toggle)
    })
  },
  methods: {
    select (type) {
      console.log(type)
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggle (onlyContent) {
      console.log(onlyContent)
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    show () {
      this.showFlag = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFirst (event) {
      if (!event._constructed) {
        return
      }
      Vue.set(this.food, 'count', 1)
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    Cartcontrol,
    Ratingselect,
    vLine
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.food
  position: fixed
  top: 0
  bottom: 48px
  width: 100%
  z-index: 30 
  background-color: #fff 
  &.food-enter-active, &.food-leave-active
    transition: all .4s linear
  &.food-enter, &.food-leave-active
    transform: translate3d(100%, 0, 0)
  .food-image
    position: relative
    top: 0
    left: 0
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: fixed
      top: 10px
      left: 0px
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #fff
  .food-header
    position: relative
    padding: 16px
    .name
      margin-bottom: 8px
      font-size: 14px
      font-weight: 700
      color: #333
    .detail
      margin-bottom: 18px
      font-size: 10px
      color: #999
    .price
      margin-right: 6px
      font-size: 14px
      color: red
      font-weight: 700
      .old-price
        font-size: 10px
        color:  #666
        text-decoration: line-through
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      width: 74px
      height: 24px
      line-height: 24px
      border-radius: 24px
      text-align: center
      color: #fff
      font-size: 10px
      background-color: rgb(0, 160, 220)
      // &.buy-enter-active, &.buy-leave-active
  .food-info
    padding: 18px
    .title
      margin-bottom: 10px
      color: #333
      font-size: 14px
      line-height: 14px
      font-weight: 500
    .info
      font-size: 12px
      color: #666
      line-height: 2
  .food-ratings
    padding-top: 18px
    .title
      padding-left: 18px
      color: #333
      font-size: 14px
      line-height: 14px
    .rating-wrapper
      margin-bottom: 50px
      .rating-item
        margin: 16px 16px
        border-1px(#ccc)
        .user
          position: absolute
          right: 0
          top: 0
          .username
            margin-right: 6px
            font-size: 10px
            color: #999
          img
            border-radius: 50%
        .rateTime
          margin-bottom: 6px
          font-size: 12px
          line-height: 12px
          color: #93999f
        .rating-content
          padding-bottom: 16px
          font-size: 12px
          i
            margin-right: 4px
            &.icon-thumb_down
              color: rgb(147, 153, 159)
            &.icon-thumb_up
              color: rgb(0, 160, 220)
          .text 
            color: #333
</style>