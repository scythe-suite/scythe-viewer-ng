import Vue from 'vue';

import axios from 'axios';
import STORE from './store.js';

const DEBUG = true;

function uidlist2map(lst) {
    let map = {};
    lst.forEach(e => {
        map[e.uid] = e;
    });
    return map;
}

function set_details(uid, timestamp, exercise) {
    if (uid == STORE.details.uid && timestamp == STORE.details.timestamp && exercise == STORE.details.exercise) {
        STORE.current_view = 'the-details';
        return;
    }
    let qauth = STORE.session.auth ? `?auth=${STORE.session.auth}` : '';
    let session = STORE.session.id;
    axios.all([
        axios.get(`r/solutions/${session}/${uid}/${timestamp}/${exercise}${qauth}`).catch(()=>{}),
        axios.get(`r/results/${session}/${uid}/${timestamp}/${exercise}${qauth}`).catch(()=>{}),
        axios.get(`r/compilations/${session}/${uid}/${timestamp}/${exercise}${qauth}`).catch(()=>{})
    ]).catch(function(error) {
        if (DEBUG) console.log(error);
    }).then(axios.spread(function(solutions, results, compilation) {
        Object.assign(STORE.details, {
            uid: uid,
            timestamp: timestamp,
            exercise: exercise,
            solutions: solutions ? solutions.data.solutions : [],
            compilation: compilation ? compilation.data.compilations: '',
            results: results ? results.data.results: []
        });
        if (DEBUG) console.log(`Updated details to '${STORE.details.uid}@${STORE.details.timestamp}/${STORE.details.exercise}'`);
        if (DEBUG) console.log(STORE.details);
        STORE.current_view = 'the-details';
    }));
}

function set_summary(session, auth) {
    if (session == STORE.session.id && auth && auth == STORE.session.auth) {
        STORE.current_view = 'the-summary';
        return;
    }
    let qauth = auth ? `?auth=${auth}` : '';
    axios.all([
        axios.get(`r/sessions`),
        axios.get(`r/uids/${session}`),
        axios.get(`r/exercises/${session}`),
        axios.get(`r/summaries/${session}`),
        axios.get(`r/texts/${session}${qauth}`).catch(()=>{}),
        axios.get(`r/cases/${session}${qauth}`).catch(()=>{})
    ]).catch(function(error) {
        if (DEBUG) console.log(error);
    }).then(axios.spread(function(sessions, uids, exercises, summaries, texts, cases) {
        STORE.sessions = sessions.data.sessions;
        let exe2num = exercises.data.exercises;
        Object.assign(STORE.session, {
            id: session,
            auth: auth,
            uids: uidlist2map(uids.data.uids),
            exercises: Object.keys(exe2num).sort(),
            casenum: exe2num,
            summaries: summaries ? summaries.data.summaries : {},
            texts: texts ? texts.data.texts : {},
            cases: cases ? cases.data.cases : {}
        });
        Object.assign(STORE.details, {
            uid: null,
            timestamp: null,
            exercise: null,
            solutions: [],
            compilation: null,
            results: []
        });
        if (DEBUG) console.log(`Updated session to '${STORE.session.id}'`);
        if (DEBUG) console.log(STORE);
        STORE.current_view = 'the-summary';
        window.location.hash = auth ? `#s/${session}/${auth}` : `#s/${session}`;
    }));
}

function set_sessions(root_app) {
    axios.get(`r/sessions`).then(function(sessions) {
        STORE.sessions = sessions.data.sessions;
        if (DEBUG) console.log(`Known sessions '${STORE.sessions}'`);
        STORE.current_view = 'the-home';
        root_app.$mount('#app');
    });
}

function set_overview() {
    axios.get(`r/sessions`).then(function(sessions) {
        sessions = sessions.data.sessions;
        let gets = [];
        sessions.map(session => {gets.push(axios.all([
            axios.get(`r/uids/${session}`),
            axios.get(`r/exercises/${session}`),
            axios.get(`r/summaries/${session}`)
        ]));});
        let uids = {}, exercises = {}, summaries = {};
        axios.all(gets).then(function(data) {
            for (let i = 0; i < sessions.length; i++) {
                Object.assign(uids, uidlist2map(data[i][0].data.uids));
                exercises[sessions[i]] = data[i][1].data.exercises;
                summaries[sessions[i]] = data[i][2].data.summaries;
            }
            Object.assign(STORE.overview, {
                sessions: sessions,
                uids: uids,
                exercises: exercises,
                summaries: summaries
            });
            STORE.current_view = 'the-overview';
        });
    });
}

function onHashchange() {
    let hash = window.location.hash.split('/');
    if (DEBUG) console.log(hash);
    if (hash[0] == '#s' && (hash.length == 2 || hash.length == 3))
        set_summary(hash[1], hash[2]);
    else if (hash[0] == '#o')
        set_overview();
    else
        STORE.current_view = 'the-home';
}

function mount(root_app) {
    window.addEventListener('hashchange', onHashchange);
    set_sessions(root_app);
    onHashchange();
}

function handle_load_message(load) {
    if (DEBUG) console.log(load);
    STORE.load = load;
}

function handle_summary_message(summary) {
    if (DEBUG) console.log(summary);
    if (summary.session_id != STORE.session.id) return;
    let payload = {
        timestamp: summary.timestamp,
        summary: summary.summary
    };
    if (STORE.session.summaries[summary.uid])
        Object.assign(STORE.session.summaries[summary.uid], payload);
    else
        Vue.set(STORE.session.summaries, summary.uid, payload);
}

export {set_details, set_sessions, set_summary, set_overview, mount, handle_summary_message, handle_load_message};
