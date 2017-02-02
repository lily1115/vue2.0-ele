<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" v-for="(item, index) in goods" :class="{active : currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text border-1px" :class="">
            <span class="icon" v-show="item.type > 0" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="food-wrapper" ref="foodWrapper">
      <ul>
        <li class="food-list food-list-hook" v-for="item in goods">
          <h2 class="title">{{item.name}}</h2>
          <ul>
            <li class="food-item" @click="selectFood(food, $event)" v-for="food in item.foods">
              <div class="icon"><img :src="food.icon" width="57" height="57" alt=""></div>
              <div class="content">
                <div class="name">{{food.name}}</div>
                <div class="desc">{{food.description}}</div>
                <div class="extra">
                  <span class="sellCount">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @cart-add="_drop()" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script >
import BScroll from 'better-scroll'
import Cartcontrol from 'components/cartcontrol'
import Food from 'components/food'
import Shopcart from 'components/shopcart'

const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      classMap: [],
      goods: {},
      scrollY: 0,
      listHeight: [],
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {
      for (var i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      if (this.goods.length) {
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
      }
      return foods
    }
  },
  created () {
    this.$on('cart-add', this._drop)
    this.$http.get('/api/goods')
    .then(res => res.json())
    .then(res => {
      if (res.errno === ERR_OK) {
        this.goods = res.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
    .catch(() => {
      // 吞掉异常
    })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    },
    _drop (el) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(el)
      })
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        click: true,
        probeType: 3
      })
      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      let foodlist = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (var i = 0; i < foodlist.length; i++) {
        let item = foodlist[i]
        height += item.clientHeight
        this.listHeight.push(height)
      };
    },
    selectMenu (index, $event) {
      if (!$event._constructed) {
        return
      }
      let foodlist = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      let el = foodlist[index]
      this.foodScroll.scrollToElement(el, 300)
    }
  },
  components: {
    Cartcontrol,
    Food,
    Shopcart
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" >
@import "../../common/stylus/mixin.styl"
.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background-color: #f3f5f7
    li.menu-item
      display: table
      height: 54px
      line-height: 14px
      padding: 0 12px
      &.active
        position: relative
        margin-top: -1px
        font-weight: 700
        background-color: #fff
      .icon
        display: inline-block
        margin-right: 2px
        width: 12px
        height: 12px
        vertical-align: top
        background-size: 12px 12px
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
        display: table-cell
        width: 56px
        font-size: 12px
        vertical-align: middle
        border-1px(rgba(7, 17, 27, 0.1))
  .food-wrapper
    flex: 1
    .title
      padding-left: 14px
      font-size: 12px
      border-left: 2px solid #d9dde1
      background-color: #f3f5f7
      line-height: 26px
      color: rgb(147, 153, 159)
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.2))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        color: rgb(147, 153, 159)
        .name
          margin: 2px 0 8px 0
          font-size: 14px
          color: rgb(7, 17, 27)
        .extra
          font-size: 10px
          margin-bottom: 8px
          .sellCount
            margin-right: 12px
        .desc
          margin-bottom: 8px
          font-size: 10px
        .price
          font-size: 10px
          .now
            font-weight: 700
            margin-right: 8px
            font-size: 14px
            color: red
          .old
            text-decoration: line-through
            font-weight: 700
            color: #999
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px          
</style>