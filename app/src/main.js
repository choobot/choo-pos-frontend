// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import numeral from 'numeral'

import 'bootstrap/dist/css/bootstrap.css'

Vue.config.productionTip = false

Vue.prototype.$http = axios

Vue.prototype.thb = function (n) {
  return numeral(n).format("0,0.00") + "฿";
}

Vue.prototype.dateFormat = function (d) {
  return d.replace("T", " ").replace("Z", "");
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

