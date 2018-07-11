import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Home from '@/views/Home.vue';
import Session from '@/views/Session.vue';
import Exercise from '@/views/Exercise.vue';
import Overview from '@/views/Overview.vue';
import Charts from '@/views/Charts.vue';

import Navbar from '@/components/Navbar.vue';

export default new Router({
    routes: [
        {
            name: 'home',
            path: '/',
            components: { navbar: Navbar, detail: Home }
        },
        {
            name: 'overview',
            path: '/overview',
            components: { navbar: Navbar, detail: Overview }
        },
        {
            name: 'charts',
            path: '/charts',
            components: { navbar: Navbar, detail: Charts }
        },
        {
            name: 'session',
            path: '/session/:session_id/:auth?',
            components: { navbar: Navbar, detail: Session },
            props: { detail: true }
        },
        {
            name: 'exercise',
            path: '/exercise/:session_id/:uid/:timestamp/:exercise_name',
            components: { navbar: Navbar, detail: Exercise },
            props: { detail: true }
        },
    ]
});
