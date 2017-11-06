import Vue from 'vue'
import axios from 'axios';
import { uidlist2map } from './rest.js';

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue);

import Overview from './Overview.vue';

const STORE = {overview: {}};

const vueapp = new Vue({render: h => h(Overview, {props: STORE})});

axios.get(`r/sessions`).then(function(sessions) {
    sessions = sessions.data.sessions;
    let gets = [];
    sessions.map(session => {gets.push(axios.all([
        axios.get(`r/uids/${session}`),
        axios.get(`r/exercises/${session}`),
        axios.get(`r/summaries/${session}`)
    ]));});
    let uids = {}, exercises = {}, summaries = {};
    axios.all(gets).then(function(data) {
        for (let i = 0; i < sessions.length; i++) {
            Object.assign(uids, uidlist2map(data[i][0].data.uids));
            exercises[sessions[i]] = data[i][1].data.exercises;
            summaries[sessions[i]] = data[i][2].data.summaries;
        }
        Object.assign(STORE.overview, {
            sessions: sessions,
            uids: uids,
            exercises: exercises,
            summaries: summaries
        });
        vueapp.$mount('#app');
    });
});
