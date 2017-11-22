import axios from 'axios';
import { uidlist2map } from './rest.js';

function computePercentages(uid, overview, justoks) {
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
            let ratio = 0, num = 0;
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

function mount(STORE, root_app) {
    axios.get(`r/sessions`).then(function(sessions) {
        sessions = (sessions.data.sessions).sort();
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
            root_app.$mount('#app');
        });
    });
}

export {computePercentages, mount};
