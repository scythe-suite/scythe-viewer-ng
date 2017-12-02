<template>
<b-navbar toggleable type="dark" variant="info">
    <b-navbar-brand href="#">Scythe Viewer</b-navbar-brand>
    <b-navbar-nav>
        <b-nav-item :to="{name: 'overview'}">Overview</b-nav-item>
        <b-nav-item :to="{name: 'charts'}">Charts</b-nav-item>
        <b-nav-item v-if="sessionTo" :to="sessionTo">Session</b-nav-item>
        <b-nav-text>
            <icon :name='lock'></icon>
        </b-nav-text>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
        <b-nav-text v-if='$store.state.load'>
            <b-badge :variant='$store.state.load < 10 ? "secondary" : ($store.state.load < 50 ? "warning" : "danger")'>Load: {{$store.state.load}}</b-badge>
        </b-nav-text>
        <b-nav-form>
            <b-form-select v-model="selected" :options="options"></b-form-select>
        </b-nav-form>
    </b-navbar-nav>
</b-navbar>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

export default {
    name: 'navbar',
    created() {
        if (!this.sessions.length) this.$store.dispatch('fetch_sessions');
    },
    methods: {
    },
    computed: {
        ...mapState(['session']),
        ...mapGetters(['sessions']),
        options() {
            return this.sessions.map(s => ({value: s, text: s}));
        },
        selected: {
            get() {
                return this.session.id;
            },
            set(session_id) {
                if (this.session.id != session_id) // to prevent rest when coming with complete URL
                    this.$router.push({name: 'session', params: {session_id}});
            }
        },
        sessionTo() {
            let session_id = this.session.id;
            if (session_id) return {name: 'session', params: {session_id, auth: this.session.auth}};
            return null;
        },
        lock() {
            return this.session.auth ? 'unlock' : 'lock';
        }
    },
};
</script>

<style scoped>
.navbar-text {
    margin-right: 1em;
}
</style>
