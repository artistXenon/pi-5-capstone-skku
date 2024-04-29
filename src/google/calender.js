const { google } = require('googleapis');

const secret = require("../../secret.json");

const auth = new google.auth.OAuth2(
    secret.client_id,
    secret.client_secret,
    secret.redirect_uri
);

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
    
    await cal.calendars.get({ calendarId: res.data.items[0].id})
    return ;
}


module.exports = {
    updateCredentials,
    getCalendar
};
