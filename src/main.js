import Vue from 'vue';

import store from './store';
import router from './router';

import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
Vue.use(VueSocketio, socketio('', {path: document.location.pathname + 'r/socket.io'}), store);

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
Vue.component('icon', Icon);

import VueTimeago from 'vue-timeago';
Vue.use(VueTimeago, {
    name: 'timeago', // component name, `timeago` by default
    locale: 'en',
    locales: {
        'en': require('date-fns/locale/en')
    }
});

import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
