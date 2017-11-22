import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue);

import Overview from './Overview.vue';
import { mount } from './utils.js';

const STORE = {overview: {}};
const app = new Vue({render: h => h(Overview, {props: STORE})});

mount(STORE, app);
