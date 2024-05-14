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
    if (userState.Data?.google == null) {
        return undefined; // no user
    }
    // if saved token is invalid 
    // delete google token

    const cal = google.calendar({
        version,
        auth
    });
    const res = await cal.calendarList.list();
    // todo error handle
    
    await cal.calendars.get({ calendarId: res.data.items[0].id })
    return ;
}


module.exports = {
    setCode, setToken,
    getCalendar
};
