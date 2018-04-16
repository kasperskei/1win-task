import Vue from 'vue'
import Router from 'vue-router'

const Calculator = () => import('./views/Calculator.vue')
const Websocket = () => import('./views/Websocket.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'calculator'
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: Calculator
    },
    {
      path: '/websocket',
      name: 'websocket',
      component: Websocket
    }
  ]
})
