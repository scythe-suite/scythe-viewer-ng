<template>
<b-container fluid>
    <navbar></navbar>
    <b-row>
        <b-col>
            <component :is='$store.state.current_view'></component>
        </b-col>
    </b-row>
</b-container>
</template>

<script>
import Navbar from './Navbar.vue';
import Home from './Home.vue';
import Session from './Session.vue';
import Exercise from './Exercise.vue';
import Overview from './Overview.vue';
import Charts from './Charts.vue';

export default {
    name: 'app',
    data: () => ({}),
    components: {Navbar, Home, Session, Exercise, Overview, Charts}
};
</script>

<style>
body {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
