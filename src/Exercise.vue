<template>
<b-tabs card>
    <b-tab :disabled='solutions.length == 0' title="Sources" active>
        <b-card v-for="solution in solutions" :header="solution.name" :key="solution.name">
            <pre class="card-text"><code v-html='solution.highlighted'></code></pre>
        </b-card>
        <b-card v-if='exercise.compilation' header="Compilation errors" header-bg-variant="primary">
            <pre class="card-text">{{exercise.compilation}}</pre>
        </b-card>
    </b-tab>
    <b-tab :disabled='issues.length == 0' title="Issues">
        <b-card v-for="issue in issues" :header="issue.name" :key="issue.name" :header-bg-variant="issue.errors ? 'danger' : 'warning'">
            <pre v-if='issue.errors' class="card-text">{{issue.errors}}</pre>
            <div v-if='issue.diffs'>
                <b-card-group deck>
                    <b-card header="Expected"><pre class="card-text">{{cases[issue.name].expected}}</pre></b-card>
                    <b-card header="Actual"><pre class="card-text">{{issue.actual}}</pre></b-card>
                    <b-card header="Diffs"><pre class="card-text">{{issue.diffs}}</pre></b-card>
                </b-card-group>
            </div>
        </b-card>
    </b-tab>
    <b-tab :disabled='texts.length == 0' title="Texts">
        <b-card v-for="text in texts" :header="text.name" :key="text.name">
            <div v-html='text.marked' class="markdown-body card-text"></div>
        </b-card>
    </b-tab>
    <b-tab :disabled='caseNames.length == 0' title="Cases">
        <b-card v-for="name in caseNames" :header="name" :key="name">
            <b-card-group deck>
                <b-card v-if='cases[name].input' header="Input"><pre class="card-text">{{cases[name].input}}</pre></b-card>
                <b-card v-if='cases[name].args' header="Args"><pre class="card-text">{{cases[name].args}}</pre></b-card>
                <b-card header="Expected"><pre class="card-text">{{cases[name].expected}}</pre></b-card>
            </b-card-group>
        </b-card>
    </b-tab>
</b-tabs>
</template>

<script>
import marked from 'marked';
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});
import 'github-markdown-css/github-markdown.css';

import hljs from 'highlight.js';
import 'highlight.js/styles/solarized-light.css';

import {mapState} from 'vuex';

export default {
    name: 'exercise',
    props: ['session_id', 'auth', 'uid', 'timestamp', 'exercise_name'],
    data: () => ({}),
    created () {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData() {
            let next = () => this.$store.dispatch('fetch_exercise',
                {uid: this.uid, timestamp: this.timestamp, exercise_name: this.exercise_name}
            );
            if (this.session_id != this.$store.state.session.id || this.auth != this.$store.state.session.auth)
                this.$store.dispatch('fetch_session', {session_id: this.session_id, auth: this.auth, next});
            else next();
        },
    },
    computed: {
        ...mapState(['session', 'exercise']),
        solutions: function() {
            let original = this.exercise.solutions;
            return original.map(e => ({
                name: e.name,
                highlighted: hljs.highlightAuto(e.content).value
            }));
        },
        issues: function() {
            return this.exercise.results.filter(r => r.diffs || r.errors).sort((a, b) => a.name.localeCompare(b.name));
        },
        texts: function() {
            let original = this.session.texts[this.exercise.name];
            if (typeof original === 'undefined') return [];
            return original.map(e => ({
                name: e.name,
                marked: marked(e.content)
            }));
        },
        caseNames: function() {
            let original = this.session.cases[this.exercise.name];
            if (typeof original === 'undefined') return [];
            return original.map(e => e.name).sort();
        },
        cases: function() {
            let original = this.session.cases[this.exercise.name];
            let cases = {};
            original.forEach(e => {
                cases[e.name] = e;
            });
            return cases;
        }
    }
};
</script>

<style scoped>
.card {
    margin-top: .5rem;
    margin-bottom: .5rem;
}
</style>
