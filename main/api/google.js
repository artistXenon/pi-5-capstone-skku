const { google } = require('googleapis');

const { getState } = require('../states');

const { client_id, client_secret, redirect_uri } = getState('config').Data.api.google;
const user_data = getState('user').Data;

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

async function updateCredentials(c) {
    const { tokens } = await auth.getToken(c);
    auth.setCredentials(tokens);
    return tokens;
}

async function getCalendar() {
    const cal = google.calendar({
        version: 'v3',
        auth
    });
    const res = await cal.calendarList.list();
    // todo error handle
    
    await cal.calendars.get({ calendarId: res.data.items[0].id })
    return ;
}


module.exports = {
    updateCredentials,
    getCalendar
};
