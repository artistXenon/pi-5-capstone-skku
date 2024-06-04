const { google } = require('googleapis');

const { getState } = require('../states');

const { client_id, client_secret, redirect_uri } = getState('config').Data.api.google;
const userState = getState('user');

const version = 'v3';
const day = 1000 * 60 * 60 * 24;

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

let cache = [0, undefined];

async function setCode(c) {
    const { tokens } = await auth.getToken(c);
    auth.setCredentials(tokens);
    return tokens;
}

function setToken(t) {
    auth.setCredentials(t);
}

async function getCalendar() {
    const now = Date.now();
    if (cache[0] > now - 1000 * 60 * 5) return cache[1];
    const savedToken = userState.Data?.google;
    if (savedToken == null) {
        return undefined; // no user
    }

    setToken(savedToken);

    const cal = google.calendar({
        version,
        auth
    });

    const today = now - now % day;

    const res = await cal.calendarList.list();
    // todo error handle
    const result = await cal.events.list({ 
        calendarId: res.data.items[1].id, 
        timeMin: new Date(today).toISOString(), 
        timeMax: new Date(today + day).toISOString()
    });
    const events = result.data;
    cache[0] = now;
    cache[1] = events;
    return events;
}


module.exports = {
    setCode, setToken,
    getCalendar
};
