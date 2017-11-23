<template>
<b-navbar toggleable type="dark" variant="info">
    <b-navbar-brand href="#">Scythe Viewer</b-navbar-brand>
    <b-navbar-nav>
        <b-nav-item v-if='$store.state.session.auth' href="#" @click='click' :disabled='summary'>Summary</b-nav-item>
        <b-nav-item href="#" @click='$store.dispatch("fetch_overview", {next: "overview"})'>Overview</b-nav-item>
        <b-nav-item href="#" @click='$store.dispatch("fetch_overview", {next: "charts"})'>Charts</b-nav-item>
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
export default {
    name: 'navbar',
    data: () => ({}),
    created() {
        this.$store.dispatch('fetch_sessions');
    },
    computed: {
        options() {
            return this.$store.state.sessions.map(s => ({
                value: s,
                text: s
            }));
        },
        selected: {
            get: function() {
                return this.$store.state.session.id;
            },
            set: function(session_id) {
                if (session_id != this.$store.state.session.id) this.$store.dispatch('fetch_session', {
                    session_id
                });
            }
        },
        summary: function() {
            return this.$store.state.current_view == 'summary';
        },
        lock: function() {
            return this.$store.state.session.auth ? 'unlock' : 'lock';
        }
    },
    methods: {
        click: function() {
            this.$store.commit('set_view', {view: 'session'});
        },
    }
};
</script>

<style scoped>
.navbar-text {
    margin-right: 1em;
}
</style>
