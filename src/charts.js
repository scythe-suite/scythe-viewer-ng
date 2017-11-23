import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue);

import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
Vue.use(VueChartkick, {Chartkick})

import Charts from './Charts.vue';
import { mount } from './utils.js';

const STORE = {overview: {}};
const app = new Vue({render: h => h(Charts, {props: STORE})});

mount(STORE, app);
