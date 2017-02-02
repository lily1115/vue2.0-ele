<template>
  <div class="ratings" ref="ratings">
     <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1>{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rankRate">高于周围商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="same"><span class="title">服务态度</span><star :size="36" :score="seller.serviceScore"></star><span class="score">{{seller.serviceScore}}</span></div>
          <div class="same"><span class="title">商品评分</span><star :size="36" :score="seller.foodScore"></star><span class="score">{{seller.foodScore}}</span></div>
          <div class="same delivery"><span class="title">送达时间</span><span class="delivery-text">{{seller.deliveryTime}}分钟</span></div>
        </div>
      </div>
      <vLine></vLine>
      <div class="food-ratings">
        <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
        <div class="rating-wrapper">
          <ul v-show="ratings && ratings.length">
            <li v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px" v-for="rating in ratings">
              <div class="avatar">
                <img :src="rating.avatar" width="28" height="28" alt="">
              </div>
              <div class="content">
                <h1 class="username">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <star :size="24" :score="rating.score"></star>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟配送</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <i class="icon-thumb_up"></i>
                  <span v-for="item in rating.recommend" class="item">{{item}}</span>
                </div>
                <div class="time">
                  {{rating.rateTime | formatDate}}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
 
</template>

<script >
import BScroll from 'better-scroll'
// import BScroll from 'better-scroll'
import Star from 'components/star'
import vLine from 'components/line'
import Ratingselect from 'components/ratingselect'
import { formatDate } from 'common/js/util.js'
const ALL = 2
const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      show: true,
      ratings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  created () {
    this.$http.get('/api/ratings')
    .then((res) => {
      res = res.body
      if (res.errno === ERR_OK) {
        this.ratings = res.data
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        })
      }
      this.$on('type.select', this.select)
      this.$on('content.toggle', this.toggle)
    })
  },
  methods: {
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return this.selectType === type
      }
    },
    select (type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggle (onlyContent) {
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },
  components: {
    Star,
    Ratingselect,
    vLine
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" >
@import "../../common/stylus/mixin.styl"
.ratings
  position: absolute;
  top: 174px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .overview
    display: flex
    padding: 18px 0
    .overview-left
      flex: 0 0 137px
      padding: 6px 0
      text-align: center
      border-right: 1px solid #f3f3f3
      @media only screen and (max-width: 320px)
        flex: 0 0 120px
        width: 120px
      h1
        margin-bottom: 6px
        font-size: 24px
        color: rgb(255,153,0)
      .title
        font-size: 12px
        margin-bottom: 8px
        color: #333
      .rankRate
        font-size: 10px
        color: #999
    .overview-right
      padding: 6px 0 6px 18px
      font-size: 12px
      font-weight: 400
      color: #333
      padding-left: 18px
      @media only screen and (max-width: 320px)
        padding-left: 6px
      .same
        display: flex
        margin-bottom: 10px
        .title
          margin-right: 12px
          font-weight: 700
        .score
          vertical-align: top
          margin: 2px 0 0 2px
          color: #f90
        .star
          margin-top: 0
      .delivery
        .delivery-text
          color: #778888
  .food-ratings
    .rating-item
      display: flex
      padding: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      .avatar
        margin-right: 12px
        width: 28px
        flex: 0 0 28px
        img
          border-radius: 50%
      .content
        position: relative
        flex: 1
        font-size: 10px
        .username
          line-height: 12px
          color: #333
        .star-wrapper
          display: flex
          margin: 4px 0 6px
          .star
            justify-content: flex-start
            margin-top: 0
          .delivery
            display: inline-block
            margin-left: 6px
            color: #778
            font-size: 10px
            vertical-align: top
        .text
          margin-bottom: 8px
          font-size: 12px 
          line-height: 1.5
          color: #333
        .recommend
          line-height: 16px
          i
            margin-right: 4px
            font-size: 12px
            color: rgb(0, 160, 220)
          .item
            display: inline-block
            margin: 0 8px 4px 0
            font-size: 9px
            padding: 0 6px
            border: 1px solid rgba(7, 17, 27, 0.1)
            border-radius: 1px
            color: #93999f
        .time
          position: absolute
          top: 0 
          right: 0
</style>