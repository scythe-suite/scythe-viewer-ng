<template>
  <div class='overview'>
    <b-form-checkbox v-model='onlyseen'>Hide never seen students</b-form-checkbox>
    <b-form-checkbox v-model='justoks'>Count exercises with at least one passing case as perfect</b-form-checkbox>
    <b-table :filter-function='filter' :items='items' :fields='fields' small fixed>
      <template v-for='field in fields.slice(1)' slot-scope='row' :slot='field.key'>
        <span :key='field.key'>
          <completion-bar v-if='row.value' :tot='100 * row.value'/>
          <span v-else>&nbsp;</span>
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

import CompletionBar from '@/components/CompletionBar.vue';

export default {
    name: 'overview',
    components: { 'completion-bar': CompletionBar }, 
    data: () => ({
        onlyseen: true,
        justoks: false
    }),
    computed: {
        ...mapState(['overview']),
        ...mapGetters(['sessions', 'percentage']),
        fields: function() {
            if (!this.sessions) return [];
            let local_fields = [{key: 'uid', sortable: true}];
            if (this.$store.state.session.auth)
                local_fields.push({key: 'info', sortable: true});
            this.sessions.slice().forEach(
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
            });
            return local_fields;
        },
        items: function() {
            if (!this.sessions) return [];
            let local_items = [];
            Object.keys(this.overview.uids).sort().forEach(uid => {
                let row = {uid: uid, info: this.overview.uids[uid].info};
                Object.assign(row, this.percentage(uid, this.justoks));
                local_items.push(row);
            });
            return local_items;
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
        },
        filter: function(row) {
            return row['_TOTAL_'] !== undefined || !this.onlyseen;
        }
    },
};
</script>

<style scoped>
.overview {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
