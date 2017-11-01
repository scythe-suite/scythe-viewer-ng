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
import { go } from './rest.js';

go(new Vue({
    render: h => h(App),
    sockets: {
        connect: function(){
            console.log('socket connected')
        },
        new_result: function(msg){
            console.log('got results');
            console.log(msg);
        }
    }
}));
