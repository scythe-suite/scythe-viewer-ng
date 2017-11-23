<template>
<b-table @row-clicked='click' small fixed striped :items='items' :fields='fields' :sortCompare='customSort'>
    <template slot="timestamp" slot-scope="data">
    <timeago :since='parseInt(data.item.timestamp)'></timeago>
  </template>
</b-table>
</template>

<script>
import {mapState} from 'vuex';

export default {
    name: 'session',
    data: () => ({}),
    methods: {
        customSort: function(a, b, key) {
            if (key == 'uid' || key == 'info' || key == 'timestamp') return null; // resort to default sort
            a = a[key];
            b = b[key];
            if (a === undefined) return 1;
            if (b === undefined) return -1;
            if (!a.compile) return 1;
            if (!b.compile) return -1;
            if (b.errors < a.errors) return 1;
            if (b.errors > a.errors) return -1;
            if (b.diffs < a.diffs) return 1;
            if (b.diffs > a.diffs) return -1;
            return 0;
        },
        click: function(item, index, event) {
            if (!this.session.auth) return;
            if (!(event.target && event.target.parentNode && event.target.parentNode.parentNode)) return;
            let cellIndex = event.target.parentNode.parentNode.cellIndex;
            let idx = cellIndex - 3; // this is the number of columns not including exercises
            let exercise = this.session.exercises[idx];
            if (!exercise) return;
            this.$store.dispatch('fetch_exercise', {uid: item.uid, timestamp: item.timestamp, exercise_name: exercise});
        },
        resultFormatter: function(value, key) {
            if (!this.session.casenum[key]) return value;
            let tot = this.session.casenum[key];
            if (!value) return '&nbsp;';
            if (!value.compile) return '<div class="progress"><div class="progress-bar" role="progressbar" style="width: 100%" ></div></div>';
            let res = '';
            if (value.errors)
                res += `<div class="progress-bar bg-danger" role="progressbar" style="width: ${(100*value.errors)/tot}%" >${value.errors}</div>`;
            if (value.diffs)
                res += `<div class="progress-bar bg-warning" role="progressbar" style="width: ${(100*value.diffs)/tot}%" >${value.diffs}</div>`;
            if (value.oks)
                res += `<div class="progress-bar bg-success" role="progressbar" style="width: ${(100*value.oks)/tot}%">${value.oks}</div>`;
            return `<div class="progress">${res}</div>`;
        }
    },
    computed: {
        ...mapState(['session']),
        fields: function() {
            if (!this.session.id) return [];
            let local_fields = this.session.auth ? [
                {key: 'uid', sortable: true},
                {key: 'info', sortable: true},
                {key: 'timestamp', sortable: true}
            ] : [
                {key: 'uid', sortable: true},
                {key: 'timestamp', sortable: true}
            ];
            this.session.exercises.forEach(
                e => local_fields.push({
                    key: e,
                    label: e.substr(3).replace(/_/g, ' '),
                    sortable: true,
                    formatter: 'resultFormatter'
                })
            );
            return local_fields;
        },
        items: function() {
            if (!this.session.id) return [];
            let summaries = this.session.summaries;
            let local_items = [];
            for (let uid in summaries) {
                let entry = summaries[uid];
                let info = this.session.uids[uid].info;
                local_items.push(Object.assign({
                    uid: uid,
                    info: info,
                    timestamp: entry.timestamp,
                }, entry.summary));
            }
            return local_items;
        }
    }
};
</script>
