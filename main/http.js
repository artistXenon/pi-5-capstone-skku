const axios = require('axios');
const { Router, static } = require('express');
const path = require('path');
const { setCode } = require('./api/google');
const { getState } = require('./states');

const router = Router();

let hi = {
    ip: undefined,
    interval: undefined,
    until: Date.now(),
};

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "pi.html"));
});

router.get('/app/download', (req, res) => {
    res.set('Content-Disposition', `attachment; filename="app.apk"`);
    res.sendFile(path.join(__dirname, "app.apk"));
});

router.get('/app/connect', (req, res) => {
    res.sendFile(path.join(__dirname, "connect.html"));

    if (hi && (hi.until > Date.now())) clearInterval(hi.interval);

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip.substring(0, 7) === "::ffff:") ip = ip.substring(7);
    if (hi != null) {
        clearInterval(hi.interval);
    }
    const now = Date.now();
    const new_hi = { ip, until: now + 60 * 1000 };
    new_hi.interval = setInterval(function() {
        console.log("emitting hi to " + hi.ip);
        if (hi.until < now) return clearInterval(hi.interval);
        const { ports } = getState('config').Data;
        axios.get(`http://${hi.ip}:9000/hi?http=${ports.http}&ws=${ports.ws}`)
            .then((r) => {
                console.log('hi accepted');
                clearInterval(hi.interval);

            })
            .catch((e) => {});
        // say hi
        //     if hi { save ip, time, clearInterval }
    }, 3000);
    hi = new_hi;
});

router.get('/app/google', async (req, res) => {
    // res.send('hi');
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (hi.ip !== ip) {
        return res.status(403).send('not my app. retry');
    }
    res.send("no");
    console.log(Object.keys(req.query));
    let code = ""; // TODO: get code from query 
    return;
    let token = await setCode(code);
    if (token) {
        return res.send('OK');
    }
    res.status(400).send('invalid code.');
});




module.exports = router;
