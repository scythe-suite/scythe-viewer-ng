<template>
  <b-container fluid>
      <b-form-checkbox v-model='hidelegend'>Hide legend</b-form-checkbox>
      <b-form-checkbox v-model='setmax'>Scale to max</b-form-checkbox>
      <area-chart height="500px" :data="chart_data" :library="chart_options" :xtype="'number'" :xmax="100"></area-chart>
  </b-container>
</template>

<script>
import {computePercentages} from './utils.js';

export default {
    name: 'charts',
    props: ['overview'],
    data: () => ({
        hidelegend: true,
        setmax: true
    }),
    methods: {
    },
    computed: {
        chart_options: function() {
            let options =  {
                legend: {display: !this.hidelegend},
                //spanGaps: true,
            };
            if (!this.setmax) {
                options.scales = {
                    xAxes: [{ticks: {max: 100}}],
                    yAxes: [{ticks: {max: 100}}]
                };
            }
            return options;
        },
        chart_data: function() {
            if (!this.overview) return {};
            let percentages = Object.keys(this.overview.uids).map(uid => computePercentages(uid, this.overview));
            //let num_uids = percentages.map(p => p['_TOTAL_']).filter(p => p!==undefined).length;
            let data = [];
            this.overview.sessions.map(s => {
                let increasing = percentages.map(p => p[s]).filter(p => p!==undefined).sort();
                console.log(increasing);
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
                console.log(pairs);
                data.push({name: s, data: pairs});
            });
            return data;
        }
    }
};
</script>

<style>
body {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
