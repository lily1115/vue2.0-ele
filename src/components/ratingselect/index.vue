<template>
  <div class="rating-select">
    <div class="rating-type border-1px">
      <div class="block positive" @click="select(2, $event)" :class="{ 'active' : selectType === 2 }">{{desc.all}}<span>{{ratings.length}}</span></div>
      <div class="block positive" @click="select(0, $event)" :class="{ 'active' : selectType === 0 }">{{desc.positive}}<span>{{positives.length}}</span></div>
      <div class="block negative" @click="select(1, $event)" :class="{ 'active' : selectType === 1 }">{{desc.negative}}<span>{{negatives.length}}</span></div>
    </div>
    <div class="switch" @click="toggleContent">
      <span class="icon-check_circle" :class="{ 'on' : onlyContent}"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script>
const ALL = 2
const POSITIVE = 0
const NEGATIVE = 1
export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  data () {
    return {
      //
    }
  },
  computed: {
    positives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negatives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select (type, event) {
      if (!event._constructed) return
      this.$parent.$emit('type.select', type)
    },
    toggleContent (event) {
      if (!event._constructed) return
      this.onlyContent = !this.onlyContent
      this.$parent.$emit('content.toggle', this.onlyContent)
    }
  }
}
</script>
<style  lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.rating-select
  width: 100%
  border-bottom: 1px solid rgba(7,17,27,0.1)
  .rating-type
    font-size: 0
    margin-left: 18px
    padding: 18px 0
    border-1px(rgba(7, 17, 27, 0.1))
    .block
      display: inline-block
      margin-right: 8px
      line-height: 16px
      border-radius: 2px
      padding: 8px 12px
      font-size: 12px
      color: #4d555d
      background-color: rgba(0, 160, 220, .2)
      &.active
        color: #fff
        background-color: #00a0dc
      &.postive
        background-color: rgb(0, 160, 220)
      &.negative
        background-color: rgba(77,85,93,0.2)
  .switch
    padding: 12px 0 12px 12px
    font-size: 0
    .icon-check_circle
      vertical-align: top
      margin-top: 20px
      margin-right: 6px
      font-size: 24px
      color: rgb(147, 153, 159)
      &.on
        color: #00a0dc
    .text
      vertical-align: top
      line-height: 22px
      font-size: 12px
      color: #666
</style>