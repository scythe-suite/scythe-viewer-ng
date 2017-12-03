<template>
<div class='overview'>
    <b-form-checkbox v-model='onlyseen'>Hide never seen students</b-form-checkbox>
    <b-form-checkbox v-model='justoks'>Count exercises with at least one passing case as perfect</b-form-checkbox>
    <b-table small fixed :filter='filter' :items='items' :fields='fields'></b-table>
</div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

export default {
    name: 'overview',
    data: () => ({
        onlyseen: true,
        justoks: false
    }),
    created() {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData() {
            this.$store.dispatch('fetch_overview');
        },
        resultFormatter: function(value) {
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
        ...mapState(['overview']),
        ...mapGetters(['sessions', 'percentage']),
        fields: function() {
            if (!this.sessions) return [];
            let local_fields = [{key: 'uid', sortable: true}];
            if (this.$store.state.session.auth)
                local_fields.push({key: 'info', sortable: true});
            this.sessions.forEach(
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
            if (!this.sessions) return [];
            let local_items = [];
            Object.keys(this.overview.uids).sort().forEach(uid => {
                let row = {uid: uid, info: this.overview.uids[uid].info};
                Object.assign(row, this.percentage(uid, this.justoks));
                local_items.push(row);
            });
            return local_items;
        }
    }
};
</script>

<style scoped>
.overview {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
