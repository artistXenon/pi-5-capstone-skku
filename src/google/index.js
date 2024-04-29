const axios = require('axios');
const qs = require('qs');

const { get, update } = require('../config');
const { updateCredentials, getCalendar } = require('./calender');

let oauth_url = 'https://www.youtube.com/shorts/dSrAIw_slh4'; 
let oauth_url_gen = 0;

function getOAuthURL() {
    const now = Date.now();
    if (now - oauth_url_gen > 60_000) {
        // generate new url
        oauth_url = 'https://www.youtube.com/shorts/dSrAIw_slh4'; 
    }
    return oauth_url;
}

async function saveToken(code) {
    data = require('../../secret.json');
    data.code = code;
    try {
        const { refresh_token, access_token, expires_in } = await updateCredentials(code);
        const _c = get();
        _c.google.refresh_token = refresh_token;
        _c.google.access_token = access_token;
        _c.google.expire = Date.now() + expires_in * 1000;
        update(_c);        
        console.log(await getCalendar());

    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getOAuthURL,
    saveToken
}