window._ = require('lodash')

import Vue from 'vue'
import App from './App.vue'
import router from './router'

window.jQuery = window.$ = require('jquery');
require('bootstrap-sass/assets/stylesheets/_bootstrap.scss')
require('vue2-animate/dist/vue2-animate.min.css')

new Vue({
  el: '#app',
  render: h => h(App),
  router,
})
