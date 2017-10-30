const DEBUG = true;

import axios from 'axios';
import STORE from './store.js';

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
        axios.get(`r/summaries/${session}${qauth}`).catch(()=>{}),
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
            uids: uids.data.uids,
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
        if (DEBUG) console.log(STORE.session);
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

function onHashchange() {
    let hash = window.location.hash.split('/');
    if (DEBUG) console.log(hash);
    if (hash[0] == '#s' && (hash.length == 2 || hash.length == 3))
        set_summary(hash[1], hash[2]);
    else
        STORE.current_view = 'the-home';
}

function go(root_app) {
    window.addEventListener('hashchange', onHashchange);
    set_sessions(root_app);
    onHashchange();
}

export {set_details, set_sessions, set_summary, onHashchange, go};
