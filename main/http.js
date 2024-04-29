const { Router, static } = require('express');
const path = require('path');

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
    res.sendFile(path.join(__dirname, "app.apk"));
});

router.get('/app/connect', (req, res) => {
    res.sendFile(path.join(__dirname, "connect.html"));

    if (hi && (hi.until > Date.now())) clearInterval(hi.interval);

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip.substring(0, 7) === "::ffff:") ip = ip.substring(7);
    const now = Date.now();
    const new_hi = { ip, until: now + 60 * 1000 };
    new_hi.interval = setInterval(function() {
        if (new_hi.until < now) return clearInterval(this.interval);

        // say hi
        //     if hi { save ip, time, clearInterval }
    }, 3000);
    hi = new_hi;
});

router.get('/app/google', (req, res) => {
    res.send('ji');
    // if hi match { return 403 }
    // verify code get token save ip
    // return result
});




module.exports = router;
