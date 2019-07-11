import Vue from 'vue';

import store from './store';
import router from './router';

import VueSocketIO from 'vue-socket.io';
Vue.use(
    new VueSocketIO({
        debug: true,
        connection: '',
        vuex: {
            store,
            actionPrefix: 'SOCKET_',
            mutationPrefix: 'SOCKET_'
        },
        options: { path: document.location.pathname + 'r/socket.io' }
    })
);

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
        en: require('date-fns/locale/en')
    }
});

import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
