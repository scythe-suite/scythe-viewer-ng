import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

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

const root = new Vue({
    store,
    render: h => h(App),
});
root.$mount('#app');
