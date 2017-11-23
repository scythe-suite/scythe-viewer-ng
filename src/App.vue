<template>
<b-container fluid>
    <the-navbar></the-navbar>
    <b-row>
        <b-col>
            <component :is='$store.state.current_view'></component>
        </b-col>
    </b-row>
</b-container>
</template>

<script>
import TheNavbar from './TheNavbar.vue';
import TheHome from './TheHome.vue';
import TheSummary from './TheSummary.vue';
import TheDetails from './TheDetails.vue';
import Overview from './Overview.vue';
import Charts from './Charts.vue';

export default {
    name: 'app',
    data: () => ({}),
    components: {
        TheNavbar,
        TheHome,
        TheSummary,
        TheDetails,
        Overview,
        Charts
    }
};
</script>

<style>
body {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
