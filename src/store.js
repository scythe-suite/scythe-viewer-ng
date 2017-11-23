import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import axios from 'axios';

const DEBUG = true;

function uidlist2map(lst) {
    let map = {};
    lst.forEach(e => {
        map[e.uid] = e;
    });
    return map;
}

function computePercentages(uid, overview, justoks = false) {
    let num_sessions = overview.sessions.length;
    let total = 0;
    let seen = false;
    let row = {};
    overview.sessions.forEach(s => {
        let summary = overview.summaries[s][uid];
        if (summary) {
            seen = true;
            summary = summary.summary;
            let exercises = overview.exercises[s];
            let num_exercises = Object.keys(exercises).length;
            let ratio = 0;
            for (let e in exercises) {
                if (summary[e] && summary[e].oks)
                    ratio += justoks ? 1 : summary[e].oks / exercises[e];
            }
            row[s] = ratio / num_exercises;
            total += row[s];
        }
    });
    row['_TOTAL_'] = seen ? total / num_sessions : undefined;
    return row;
}

const STORE = new Vuex.Store({
    state: {
        current_view: 'home',
        load: 0,
        sessions: [],
        overview: {},
        session: { // predeclared for mutation detection
            id: null, // a string
            auth: null, // a string
            summaries: {}, // map from uids to summary objects
            texts: {}, // map from exercise name to an array of text objects
            cases: {}, // map from exercise name to an array of case objects
            uids: [], // map from uids to uid objects
            exercises: [], // list of exercise names
            casenum: {} // map from exercise name to the numer of its casess
        },
        exercise: { // predeclared for mutation detection
            uid: null, // a string
            timestamp: null, // a string
            name: null, // a string
            solutions: [], // an array of solution objects
            compilation: null, // a string
            results: [] // an array with an entry per case
        }
    },
    mutations: {
        set_view(state, {view}) {
            state.current_view = view;
        },
        set_sessions(state, sessions) {
            state.sessions = sessions;
        },
        set_overview(state, {overview, next}) {
            if (DEBUG) console.log(overview);
            Object.assign(state.overview, overview);
            state.current_view = next;
        },
        set_session(state, {session, exercise}) {
            Object.assign(state.session, session);
            Object.assign(state.exercise, exercise);
            state.current_view = 'session';
        },
        set_exercise(state, {exercise}) {
            if (DEBUG) console.log(exercise);
            Object.assign(state.exercise, exercise);
            state.current_view = 'exercise';
        },
        SOCKET_LOAD_MESSAGE(state, {load}) {
            if (DEBUG) {
                console.log('got load_message');
                console.log(load);
            }
            state.load = load;
        },
        SOCKET_SUMMARY_MESSAGE(state, {summary}) {
            if (DEBUG) {
                console.log('got summary_message');
                console.log(summary);
            }
            if (summary.session_id != state.session.id) return;
            let payload = {
                timestamp: summary.timestamp,
                summary: summary.summary
            };
            if (state.session.summaries[summary.uid])
                Object.assign(state.session.summaries[summary.uid], payload);
            else
                Vue.set(state.session.summaries, summary.uid, payload);
        }
    },
    actions: {
        fetch_sessions({commit}) {
            axios.get('r/sessions').then(sessions => commit('set_sessions', (sessions.data.sessions).sort().reverse()));
        },
        fetch_overview({commit}, {next}) {
            let sessions = STORE.state.sessions;
            let gets = [];
            sessions.map(session_id => {gets.push(axios.all([
                axios.get(`r/uids/${session_id}`),
                axios.get(`r/exercises/${session_id}`),
                axios.get(`r/summaries/${session_id}`)
            ]));});
            let uids = {}, exercises = {}, summaries = {};
            axios.all(gets).then(function(data) {
                for (let i = 0; i < sessions.length; i++) {
                    Object.assign(uids, uidlist2map(data[i][0].data.uids));
                    exercises[sessions[i]] = data[i][1].data.exercises;
                    summaries[sessions[i]] = data[i][2].data.summaries;
                }
                let overview = {
                    sessions: sessions,
                    uids: uids,
                    exercises: exercises,
                    summaries: summaries
                };
                commit('set_overview', {overview, next});
            });

        },
        fetch_session({commit}, {session_id}) {
            let auth = 'WyJhbGwiXQ.7etEGZYp8yTDx4xB6QlyazXRd0A';
            // if (session_id == STORE.session.id && auth && auth == STORE.session.auth) {
            //     STORE.current_view = 'the-summary';
            //     return;
            // }
            let qauth = auth ? `?auth=${auth}` : '';
            axios.all([
                axios.get(`r/uids/${session_id}`),
                axios.get(`r/exercises/${session_id}`),
                axios.get(`r/summaries/${session_id}`),
                axios.get(`r/texts/${session_id}${qauth}`).catch(() => {}),
                axios.get(`r/cases/${session_id}${qauth}`).catch(() => {})
            ]).catch(function(error) {
                if (DEBUG) console.log(error);
            }).then(axios.spread(function(uids, exercises, summaries, texts, cases) {
                let exe2num = exercises.data.exercises;
                let session = {
                    id: session_id,
                    auth: auth,
                    uids: uidlist2map(uids.data.uids),
                    exercises: Object.keys(exe2num).sort(),
                    casenum: exe2num,
                    summaries: summaries ? summaries.data.summaries : {},
                    texts: texts ? texts.data.texts : {},
                    cases: cases ? cases.data.cases : {}
                };
                let exercise = {
                    uid: null,
                    timestamp: null,
                    name: null,
                    solutions: [],
                    compilation: null,
                    results: []
                };
                commit('set_session', {session, exercise});
            }));
        },
        fetch_exercise({commit}, {uid, timestamp, exercise_name}) {
            // if (uid == STORE.details.uid && timestamp == STORE.details.timestamp && exercise == STORE.details.exercise) {
            //     STORE.current_view = 'the-details';
            //     return;
            // }
            let qauth = STORE.state.session.auth ? `?auth=${STORE.state.session.auth}` : '';
            let session_id = STORE.state.session.id;
            axios.all([
                axios.get(`r/solutions/${session_id}/${uid}/${timestamp}/${exercise_name}${qauth}`).catch(() => {}),
                axios.get(`r/results/${session_id}/${uid}/${timestamp}/${exercise_name}${qauth}`).catch(() => {}),
                axios.get(`r/compilations/${session_id}/${uid}/${timestamp}/${exercise_name}${qauth}`).catch(() => {})
            ]).catch(function(error) {
                if (DEBUG) console.log(error);
            }).then(axios.spread(function(solutions, results, compilation) {
                let exercise = {
                    uid: uid,
                    timestamp: timestamp,
                    name: exercise_name,
                    solutions: solutions ? solutions.data.solutions : [],
                    compilation: compilation ? compilation.data.compilations : '',
                    results: results ? results.data.results : []
                };
                commit('set_exercise', {exercise});
            }));
        }
    }
});

export default STORE;
export {uidlist2map, computePercentages};
