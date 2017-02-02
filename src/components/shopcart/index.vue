<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount > 0}"><i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i></div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price"  :class="{highlight: totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.prevent.stop="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
        <div class="ball-container">
          <transition name="drop" v-for="ball in balls" 
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
        <transition name="fold">
        <div class="shoplist-wrapper" v-show="listShow">
          <div class="list-header">
            <div class="name">购物车</div>
            <div class="empty" @click="empty">清空</div>
          </div>
          <div class="list-content"  ref="listContent">
            <ul>
              <li class="food border-1px" v-for="food in selectFoods">
                <div class="name">{{food.name}}</div>
                <div class="price">￥{{food.price * food.count}}</div>
                <div class="cart-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
        </transition>
      </div>
    </div>
    <transition name="mask">
      <div class="list-mask" v-show="listShow" @click="hideShow"></div>
    </transition>
  </div>
</template>

<script>
import Cartcontrol from 'components/cartcontrol'
import BScroll from 'better-scroll'

export default {
  props: {
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      balls: [
        {show: false},
        {show: false},
        {show: false},
        {show: false}
      ],
      dropBalls: [],
      fold: true
    }
  },
  created () {
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      return this.totalPrice > this.minPrice ? 'enough' : 'not-enough'
    },
    listShow () {
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {click: true})
          } else {
            this.scroll.refresh()
          }
        })
      };
      return show
    }
  },
  methods: {
    pay () {
      if (this.totalPrice < this.minPrice) return
      window.alert(`您需要支付￥${this.totalPrice}元`)
    },
    hideShow () {
      this.fold = true
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    drop (el) {
      for (var i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeEnter (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        };
      }
    },
    enter (el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight /* 触发浏览器重绘 */
        // 体验优化，异步执行小球下落动画
      this.$nextTick(() => {
        el.style.display = ''
        el.style.webkitTransform = `translate3d(0, 0, 0)`
        el.style.transform = `translate3d(0, 0, 0)`
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = `translate3d(0, 0, 0)`
        inner.style.transform = `translate3d(0, 0, 0)`
      })
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList () {
      if (!this.totalCount) return
      this.fold = !this.fold
    }
  },
  components: {
    Cartcontrol
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.shopcart
  position: fixed
  left: 0 
  bottom: 0
  z-index: 50
  width: 100%
  height: 48px
  .content
    background-color: #141d27
    color: rgba(255, 255, 255, .4)
    display: flex
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        margin: 0 12px
        position: relative
        top: -10px
        left: 0px
        width: 56px
        height: 56px
        padding: 6px
        box-sizing: border-box 
        border-radius: 50%
        background-color: #141d27
        .logo
          width: 100%
          height: 100%
          border-sizing: border-box 
          border-radius: 50%
          background-color: #2b343c
          text-align: center
          &.highlight
            background-color: #00a0dc
          i.icon-shopping_cart
            font-size: 24px
            line-height: 44px
            color: #80858a
            &.highlight
              color: #fff
        .num
          position: absolute
          right: 0
          top: 0
          width: 24px
          height: 16px
          line-height: 16px
          font-size: 10px
          text-align: center
          border-radius: 16px
          color: #fff
          background-color: rgb(240, 20, 20)
          bow-shadow: 0 4px 8px 0 rgba(0,0,0,.4)
      .price
        display: inline-block
        font-size: 16px
        vertical-align: top
        margin-top: 12px
        padding-right: 12px
        line-height: 24px
        font-weight: 700
        border-right: 1px solid rgba(255, 255, 255, .4)
        &.highlight
          color: #fff
      .desc
        display: inline-block
        margin: 18px 0 0 6px
        font-size: 12px
        vertical-align: top
        font-weight: 200
    .content-right
      width: 105px
      flex: 0 0 105px
      .pay
        padding-top: 16px
        height: 48px
        font-size: 12px
        text-align: center
        background-color: #2b333b
        font-weight: 700
        &.not-enough
          background-color: #2b333b
        &.enough
          color: #fff
          background-color: #00b43c
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-enter-active
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background-color: rgb(0, 160, 220)
            transition: all .4s linear
    .shoplist-wrapper
      position: absolute
      left: 0
      bottom: 48px
      width: 100%
      z-index: -1
      transform: translate3d(0, 0, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all .4s ease
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 100%, 0)
      .list-header
        padding: 0 18px
        height: 40px
        background-color: #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .name
          float: left
          font-size: 14px
          font-weight: 200
          line-height: 40px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          line-height: 40px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 211px
        background-color: #fff
        overflow: hidden
        line-height: 48px
        .food
          border-1px(rgba(7,17,27,0.1))
          color: #333
        .price
          position: absolute
          right: 100px
          top: 0
          font-weight: 700
          color: rgb(240, 20, 20)
        .cart-wrapper
          position: absolute
          right: 0
          top: 6px
.list-mask
  position: fixed
  top: 0 
  left: 0 
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.6)
  z-index: 40
  backdrop-filter: blur(10px)
  &.mask-enter-active, &.mask-leave-active
    transition: all .4s linear
  &.mask-enter, &.mask-leave-active
    opactiy: 0
    background-color: rgba(0, 0, 0, 0)
</style>