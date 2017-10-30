<template>
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#">Scythe Viewer</b-navbar-brand>
        <b-nav is-nav-bar>
          <b-nav-item v-if='store.session.auth' href="#" @click='click' :disabled='summary'>Summary</b-nav-item>
          <b-nav-text><icon :name='lock'></icon></b-nav-text>
        </b-nav>
        <b-nav is-nav-bar class="ml-auto"><b-nav-form>
          <b-form-select v-model="selected" :options="options" class="mb-3"></b-form-select>
        </b-nav-form>
      </div>
        </b-nav>
    </b-navbar>
</template>

<script>
import STORE from './store.js';
import { set_summary } from './rest.js';

export default {
    name: 'the-navbar',
    data: () => ({
        store: STORE
    }),
    computed: {
        options: () => STORE.sessions.map(s => ({value: s, text: s})),
        selected: {
            get: function() {return this.store.session.id;},
            set: function(session) {if (session != this.store.session.id) set_summary(session);}
        },
        summary: () => this.store.current_view == 'the-summary',
        lock: function() {return this.store.session.auth ? 'unlock': 'lock';}
    },
    methods: {
        click: () => this.store.current_view = 'the-summary',
    }
};
</script>
