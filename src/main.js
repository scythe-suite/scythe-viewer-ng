import Vue from 'vue'

//import VueSocketio from 'vue-socket.io';
//Vue.use(VueSocketio, 'http://socketserver.com:1923');

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue);

import 'vue-awesome/icons'
import Icon from 'vue-awesome'
Vue.component('icon', Icon)

import VueTimeago from 'vue-timeago'
Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'en-US',
  locales: {
    'en-US': require('vue-timeago/locales/en-US.json')
  }
});

import App from './App.vue';
import { go } from './rest.js';

go(new Vue({render: h => h(App)}));
