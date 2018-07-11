<template>
  <div>
    <b-table :items='items' :fields='fields' :sort-compare='customSort' small fixed striped @row-clicked='click'>
      <template slot='timestamp' slot-scope='data'>
        <timeago :since='parseInt(data.item.timestamp)'/>
      </template>
      <template v-for='(tot, exercise) in casenum' slot-scope='row' :slot='exercise'>
        <span :key='exercise'>
          <status-bar v-if='row.value' :status='row.value' :tot='tot'/>
          <span v-else>&nbsp;</span>
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
import {mapState} from 'vuex';

import StatusBar from '@/components/StatusBar.vue';

export default {
    name: 'session',
    components: { 'status-bar': StatusBar }, 
    props: ['session_id', 'auth'],
    data: () => ({}),
    computed: {
        ...mapState(['session', 'session2auth']),
        casenum: function() { 
            if (!this.session.id) return {};
            return this.session.casenum;
        },
        fields: function() {
            if (!this.session.id) return [];
            let local_fields = this.session2auth[this.session.id] ? [
                {key: 'uid', sortable: true},
                {key: 'info', sortable: true},
                {key: 'timestamp', sortable: true}
            ] : [
                {key: 'uid', sortable: true},
                {key: 'timestamp', sortable: true}
            ];
            this.session.exercises.slice().forEach(
                e => local_fields.push({
                    key: e,
                    label: e.substr(3).replace(/_/g, ' '),
                    sortable: true
                })
            );
            return local_fields;
        },
        items: function() {
            if (!this.session.id) return [];
            let summaries = this.session.summaries;
            let local_items = [];
            for (let uid in summaries) {
                if (uid == '000000') continue;
                let entry = summaries[uid];
                let info = this.session.uids[uid] ? this.session.uids[uid].info : '';
                local_items.push(Object.assign({
                    uid: uid,
                    info: info,
                    timestamp: entry.timestamp,
                }, entry.summary));
            }
            return local_items;
        }
    },
    watch: {
        '$route': 'fetchData'
    },
    created () {
        this.fetchData();
    },
    methods: {
        fetchData() {
            if (this.auth) this.$store.commit('set_auth', {session_id: this.session_id, auth: this.auth});
            this.$store.dispatch('fetch_session', {session_id: this.session_id});
        },
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
            if (!this.session2auth[this.session.id]) return; // we are not authorized
            let td = event.target.closest('td');
            if (!td) return;
            let idx = td.cellIndex - 3; // this is, if authorized, the number of columns not including exercises
            let exercise_name = this.session.exercises[idx];
            if (!exercise_name) return;
            this.$router.push({name: 'exercise', params: {session_id: this.session.id, uid: item.uid, timestamp: item.timestamp, exercise_name}});
        }
    },
};
</script>
