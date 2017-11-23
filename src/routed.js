import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue);

import RoutedApp from './RoutedApp.vue';

const Navbar = { template: '<div>Navbar</div>' };
const Overview = { template: '<div>Overview</div>' };
const Session = { props: ['session_id'], template: '<div>Session {{session_id}}</div>' };
const Exercise = { props: ['session_id', 'uid', 'timestamp', 'exercise'], template: '<div>Exercise {{session_id}}, {{uid}}</div>' };

const routes = [
  { path: '/', redirect: {name: 'overview'} },
  { path: '/overview', name: 'overview', components: {navbar: Navbar, detail: Overview} },
  { path: '/session/:session_id', name: 'session', components: {navbar: Navbar, detail: Session}, props: {detail: true} },
  { path: '/exercise/:session_id/:uid/:timestamp/:exercise', name: 'exercise', components: {navbar: Navbar, detail: Exercise}, props: {detail: true} }
]

const app = new Vue({
  router: new VueRouter({routes}),
  render: h => h(RoutedApp)
}).$mount('#app')
