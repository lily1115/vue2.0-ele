import Goods from '../components/good'
import Ratings from '../components/rating'
import Sellers from '../components/seller'

export default {
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/goods' },
    { path: '/goods', component: Goods },
    { path: '/ratings', component: Ratings },
    { path: '/sellers', component: Sellers }
  ]
}
