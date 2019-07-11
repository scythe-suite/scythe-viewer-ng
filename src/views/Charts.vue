<template>
  <div class='charts'>
    <b-form-checkbox v-model='hidelegend'>Hide legend</b-form-checkbox>
    <b-form-checkbox v-model='setmax'>Scale to max</b-form-checkbox>
    <area-chart :data='chart_data' :library='chart_options' height='500px'/>
  </div>
</template>

<script>
import Vue from 'vue';

import Chartkick from 'vue-chartkick';
import Chart from 'chart.js'; // eslint-disable-line
Vue.use(Chartkick.use(Chart));

import {mapState, mapGetters} from 'vuex';

export default {
    name: 'charts',
    data: () => ({
        hidelegend: true,
        setmax: true
    }),
    computed: {
        ...mapState(['overview']),
        ...mapGetters(['sessions', 'percentage']),
        chart_options: function() {
            let options = {
                legend: {
                    display: !this.hidelegend
                },
                //spanGaps: true,
            };
            if (!this.setmax) {
                options.scales = {
                    xAxes: [{ticks: {max: 100}}],
                    yAxes: [{ticks: {max: 100}}]
                };
            }
            return options;
        },
        chart_data: function() {
            if (!this.sessions) return {};
            let percentages = Object.keys(this.overview.uids).map(uid => this.percentage(uid));
            //let num_uids = percentages.map(p => p['_TOTAL_']).filter(p => p!==undefined).length;
            let data = [];
            this.sessions.map(s => {
                let increasing = percentages.map(p => p[s]).filter(p => p !== undefined).sort();
                increasing.push(101);
                let prev = increasing[0];
                let num = 0;
                let pairs = [];
                for (let i = 1; i < increasing.length; i++) {
                    num++;
                    if (prev < increasing[i]) {
                        pairs.push([
                            Math.floor(100 * num / (increasing.length - 1)),
                            Math.floor(100 * prev)
                        ]);
                        prev = increasing[i];
                    }
                }
                data.push({name: s, data: pairs});
            });
            return data;
        }
    },
    watch: {
        '$route': 'fetchData'
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.$store.dispatch('fetch_overview');
        }
    },
};
</script>

<style scoped>
.charts {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
