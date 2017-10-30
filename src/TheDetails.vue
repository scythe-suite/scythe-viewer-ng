<template>
  <b-tabs card>
    <b-tab :disabled='solutions.length == 0' title="Sources" active>
        <b-card v-for="solution in solutions" :header="solution.name" :key="solution.name">
            <pre class="card-text"><code v-html='solution.highlighted'></code></pre>
        </b-card>
        <b-card v-if='details.compilation' header="Compilation errors" header-bg-variant="primary">
            <pre class="card-text">{{details.compilation}}</pre>
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
            <div v-html='text.marked' class="card-text"></div>
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
export default {
    name: 'the-details',
    data: () => ({session: STORE.session, details: STORE.details}),
    computed: {
        solutions: function() {
            let original = this.details.solutions;
            return original.map(e => ({
                name: e.name,
                highlighted: hljs.highlightAuto(e.content).value
            }));
        },
        issues: function() {
            return this.details.results.filter(r => r.diffs || r.errors).sort((a, b) => a.name.localeCompare(b.name));
        },
        texts: function() {
            let original = this.session.texts[this.details.exercise];
            if (typeof original === 'undefined') return [];
            return original.map(e => ({
                name: e.name,
                marked: marked(e.content, {sanitize: true})
            }));
        },
        caseNames: function() {
            let original = this.session.cases[this.details.exercise];
            if (typeof original === 'undefined') return [];
            return original.map(e => e.name).sort();
        },
        cases: function() {
            let original = this.session.cases[this.details.exercise];
            let cases = {};
            original.forEach(e => {cases[e.name] = e;});
            return cases;
        }
    }
};
</script>
