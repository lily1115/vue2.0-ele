<template>
  <div class="star" :class="starSize">
    <span v-for="itemClass in itemClasses" class="star-item" :class="itemClass" v-bind:key="itemClass.index"></span>
  </div>
  
</template>

<script >
const LEN = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starSize () {
      return 'star-' + this.size
    },
    itemClasses () {
      let result = []
      let score = Math.floor(this.score * 2) / 2
      let hasDecimal = score % 1 !== 0
      let integar = Math.floor(score)
      for (var i = 0; i < integar; i++) {
        result.push(CLS_ON)
      };
      if (hasDecimal) {
        result.push(CLS_HALF)
      };
      while (result.length < LEN) {
        result.push(CLS_OFF)
      };
      return result
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" >
  @import "../../common/stylus/mixin";
  .star
    margin-top: 16px
    display: -webkit-flex
    display: flex
    justify-content: center
    .star-item
      background-size: cover
      background-repeat: no-repeat
    &.star-48
      .star-item
        margin-right: 22px
        width: 20px
        height: 20px
        background-size: 20px 20px
        &.last-child
          margin-right: 0
        &.on
          bg-img('./img/star48_on')
        &.off
          bg-img('./img/star48_off')
        &.half
          bg-img('./img/star48_half')
    &.star-36
      .star-item
        margin-right: 6px
        width: 15px
        height: 15px
        &.last-child
          margin-right: 0
        &.on
          bg-img('./img/star36_on')
        &.off
          bg-img('./img/star36_off')
        &.half
          bg-img('./img/star36_half')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        &.last-child
          margin-right: 0
        &.on
          bg-img('./img/star24_on')
        &.off
          bg-img('./img/star24_off')
        &.half
          bg-img('./img/star24_half')
</style>