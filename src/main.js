import Vue from 'vue'

import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
Vue.use(VueSocketio, socketio('', {path: document.location.pathname + 'r/socket.io'}));

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
import { mount, handle_summary_message } from './rest.js';

mount(new Vue({
    render: h => h(App),
    sockets: {
        connect: function() {
            console.log('socket connected')
        },
        summary_message: function(msg) {
            console.log('got summary_message');
            let data = JSON.parse(msg.data.data);
            handle_summary_message(data);
        }
    }
}));
