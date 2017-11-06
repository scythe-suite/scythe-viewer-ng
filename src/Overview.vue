<template>
  <b-container fluid>
    <b-table small fixed  :items='items' :fields='fields'></b-table>
  </b-container>
</template>

<script>
export default {
    name: 'overview',
    props: ['overview'],
    methods: {
        resultFormatter: function(value, key, item) {
          if (key == 'uid' || value === undefined) return value;
          let val = Math.floor(value * 100);
          let res = `<div class="progress-bar bg-success" role="progressbar" style="width: ${val}%">${val ? val : ''}</div>`;
          return `<div class="progress">${res}</div>`;
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
            let num_sessions = this.overview.sessions.length;
            Object.keys(this.overview.uids).sort().forEach(uid => {
                let row = {uid: uid, info: this.overview.uids[uid].info};
                let total = 0;
                this.overview.sessions.forEach(s => {
                    let summary = this.overview.summaries[s][uid];
                    if (summary) {
                        summary = summary.summary;
                        let exercises = this.overview.exercises[s];
                        let num_exercises = Object.keys(exercises).length;
                        let ratio = 0, num = 0;
                        for (let e in exercises) {
                            if (summary[e] && summary[e].oks)
                                ratio += summary[e].oks / exercises[e];
                        }
                        row[s] = ratio / num_exercises;
                        total += row[s];
                    }
                });
                row['_TOTAL_'] = total / num_sessions;
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
