const STORE = {
    current_view: 'the-home',
    load: 0,
    sessions: [],
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
    details: { // predeclared for mutation detection
        uid: null, // a string
        timestamp: null, // a string
        exercise: null, // a string
        solutions: [], // an array of solution objects
        compilation: null, // a string
        results: [] // an array with an entry per case
    }
};

export default STORE;
