import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import store from './store.js';

import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
Vue.use(VueSocketio, socketio('', {path: document.location.pathname + 'r/socket.io'}), store);

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import 'vue-awesome/icons';
import Icon from 'vue-awesome';
Vue.component('icon', Icon);

import VueTimeago from 'vue-timeago';
Vue.use(VueTimeago, {
    name: 'timeago', // component name, `timeago` by default
    locale: 'en-US',
    locales: {
        'en-US': require('vue-timeago/locales/en-US.json')
    }
});

import App from './App.vue';
import Navbar from './Navbar.vue';
import Home from './Home.vue';
import Session from './Session.vue';
import Exercise from './Exercise.vue';
import Overview from './Overview.vue';
import Charts from './Charts.vue';

const router = new VueRouter({routes: [
    {
        name: 'home',
        path: '/',
        components: {navbar: Navbar, detail: Home}
    },
    {
        name: 'overview',
        path: '/overview',
        components: {navbar: Navbar, detail: Overview}
    },
    {
        name: 'charts',
        path: '/charts',
        components: {navbar: Navbar, detail: Charts}
    },
    {
        name: 'session',
        path: '/session/:session_id/:auth?',
        components: {navbar: Navbar, detail: Session},
        props: {detail: true}
    },
    {
        name: 'exercise',
        path: '/exercise/:session_id/:uid/:timestamp/:exercise_name',
        components: {navbar: Navbar, detail: Exercise},
        props: {detail: true}
    },
]});

const root = new Vue({
    store,
    router,
    render: h => h(App),
});
root.$mount('#app');
