const { google } = require('googleapis');

const { getState } = require('../states');

const { client_id, client_secret, redirect_uri } = getState('config').Data.api.google;
const userState = getState('user');

version = 'v3';

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);


async function setCode(c) {
    const { tokens } = await auth.getToken(c);
    auth.setCredentials(tokens);
    return tokens;
}

function setToken(t) {
    auth.setCredentials(t);
}

async function getCalendar() {
    const savedToken = userState.Data?.google;
    if (savedToken == null) {
        return undefined; // no user
    }
    setToken(savedToken);

    const cal = google.calendar({
        version,
        auth
    });
    const res = await cal.calendarList.list();
    // todo error handle

    const result = await cal.calendars.get({ calendarId: res.data.items[1].id });
    console.log(result);
    return result;
}


module.exports = {
    setCode, setToken,
    getCalendar
};
