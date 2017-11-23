<template>
  <b-container fluid>
    <b-form-checkbox v-model='onlyseen'>Hide never seen students</b-form-checkbox>
    <b-form-checkbox v-model='justoks'>Count exercises with at least one passing case as perfect</b-form-checkbox>
    <b-table small fixed :filter='filter' :items='items' :fields='fields'></b-table>
  </b-container>
</template>

<script>
import {computePercentages} from './utils.js';

export default {
    name: 'overview',
    props: ['overview'],
    data: () => ({
        onlyseen: true,
        justoks: false
    }),
    methods: {
      resultFormatter: function(value, key, item) {
          if (value === undefined) return '';
          let val = Math.floor(value * 100);
          let res = `<div class="progress-bar bg-success" role="progressbar" style="width: ${val}%">${val ? val : ''}</div>`;
          return `<div class="progress">${res}</div>`;
      },
      filter: function(row) {
          return row['_TOTAL_'] !== undefined || !this.onlyseen;
      }
    },
    computed: {
        fields: function() {
            if (!this.overview) return [];
            let local_fields = [{key: 'uid', sortable: true}, {key: 'info', sortable: true}];
            this.overview.sessions.forEach(
                s => local_fields.push({
                    key: s,
                    label: s,
                    sortable: true,
                    formatter: 'resultFormatter'
                })
            );
            local_fields.push({
                key: '_TOTAL_',
                label: 'TOTAL',
                sortable: true,
                formatter: 'resultFormatter'
            });
            return local_fields;
        },
        items: function() {
            if (!this.overview) return [];
            let local_items = [];
            Object.keys(this.overview.uids).sort().forEach(uid => {
                let row = {uid: uid, info: this.overview.uids[uid].info};
                Object.assign(row, computePercentages(uid, this.overview, this.justoks));
                local_items.push(row);
            });
            return local_items;
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
