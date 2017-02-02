<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart"
         transition="move">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition> 
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script>
import Vue from 'vue'
// import EventHub from '../../common/js/EventHub'
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      //
    }
  },
  methods: {
    decreaseCart (event) {
      if (!event._constructed) return
      if (this.food.count) {
        this.food.count--
      };
    },
    addCart (event) {
      if (!event._constructed) return
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$parent.$emit('cart-add', event.target)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" >
.cartcontrol
  font-size: 0
  .cart-decrease
    display: inline-block
    padding: 6px
    transition: all .4s linear
    .inner
      display: inline-block
      font-size: 24px
      line-height: 24px
      color: rgb(0, 160, 220)
      transition: all 0.4s linear
      transform: rotate(0)
    &.move-transition
      opacity: 1
      transform: translate3d(0,0,0)
    &.move-enter, &.move-leave-active
      opacity: 0
      transform: translate3d(24px,0,0)
      .inner
        transform: rotate(180deg)
  .cart-add
    display: inline-block
    padding: 6px
    font-size: 24px
    line-height: 24px
    color: rgb(0, 160, 220)
  .cart-count
    display: inline-block
    font-size: 10px
    vertical-align: top
    padding-top: 6px
    line-height: 24px
</style>