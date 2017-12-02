import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import createLogger from 'vuex/dist/logger';
import axios from 'axios';

const DEBUG = false;

function uidlist2map(lst) {
    let map = {};
    lst.forEach(e => {
        map[e.uid] = e;
    });
    return map;
}

const STORAGE_AUTH_KEY = 'svng_auths';

const localStoragePlugin = store => {
    store.subscribe(({type}, {session}) => {
        if (type === 'set_session')
            console.log(session.auth);
        //window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    });
};

const STORE = new Vuex.Store({
    state: {
        load: 0,
        session2auth: null,
        overview: {
            uids: {},
            exercises: {},
            summaries: {}
        },
        session: {
            id: null, // a string
            summaries: {}, // map from uids to summary objects
            texts: {}, // map from exercise name to an array of text objects
            cases: {}, // map from exercise name to an array of case objects
            uids: [], // map from uids to uid objects
            exercises: [], // list of exercise names
            casenum: {} // map from exercise name to the numer of its casess
        },
        exercise: {
            uid: null, // a string
            timestamp: null, // a string
            name: null, // a string
            solutions: [], // an array of solution objects
            compilation: null, // a string
            results: [] // an array with an entry per case
        }
    },
    getters: {
        sessions(state) {
            return state.session2auth != null ? Object.keys(state.session2auth).sort() : [];
        },
        percentage: (state, getters) => (uid, justoks = false) => {
            let sessions = getters.sessions;
            let total = 0;
            let seen = false;
            let row = {};
            sessions.forEach(s => {
                let summary = state.overview.summaries[s][uid];
                if (summary) {
                    seen = true;
                    summary = summary.summary;
                    let exercises = state.overview.exercises[s];
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
            row['_TOTAL_'] = seen ? total / sessions.length : undefined;
            return row;
        }
    },
    mutations: {
        set_session2auth(state, {session2auth}) {
            state.session2auth = session2auth;
        },
        set_overview(state, {overview}) {
            Object.assign(state.overview, overview);
        },
        set_session(state, {session, exercise}) {
            Object.assign(state.session, session);
            Object.assign(state.exercise, exercise);
        },
        set_exercise(state, {exercise}) {
            Object.assign(state.exercise, exercise);
        },
        SOCKET_LOAD_MESSAGE(state, {load}) {
            state.load = load;
        },
        SOCKET_SUMMARY_MESSAGE(state, {summary}) {
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
        fetch_sessions({commit}, next) {
            axios.get('r/sessions').then(sessions => {
                let ls = window.localStorage.getItem(STORAGE_AUTH_KEY);
                ls = ls ? JSON.decode(ls) : {};
                let session2auth = {};
                for (let s of sessions.data.sessions) session2auth[s] = ls[s];
                commit('set_session2auth', {session2auth});
                if (next) next(); // to chain fetch_overview
            });
        },
        fetch_overview({commit}) {
            let gets = [];
            let sessions = this.getters.sessions;
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
                    uids: uids,
                    exercises: exercises,
                    summaries: summaries
                };
                commit('set_overview', {overview});
            });
        },
        fetch_session({commit}, {session_id, auth, next}) {
            if (session_id == this.state.session.id && auth && auth == this.state.session.auth) return;
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
                if (next) next(); // to chain fetch_exercise
            }));
        },
        fetch_exercise({commit}, {uid, timestamp, exercise_name}) {
            if (uid == this.state.exercise.uid && timestamp == this.state.exercise.timestamp && exercise_name == this.state.exercise.name) return;
            let session_id = this.state.session.id;
            let qauth = this.state.session.auth ? `?auth=${this.state.session.auth}` : '';
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
    },
    strict: process.env.NODE_ENV !== 'production', // eslint-disable-line no-undef
    plugins: process.env.NODE_ENV !== 'production' // eslint-disable-line no-undef
        ? [createLogger(), localStoragePlugin]
        : [localStoragePlugin]
});


export default STORE;
export {uidlist2map};
