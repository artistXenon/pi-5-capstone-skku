const http = require('http');
const fs = require('node:fs');
const path = require('node:path');

const ip = require("ip").address();

const { getOAuthURL } = require('../google');
const ws = require('./ws');

const 
    STATUS_INIT_GOOGLE = 0;
let state_payload;

let _state = 0;

http.createServer((req, res) => {
    const { url } = req;
    let _q = url.indexOf("?");
    _q = _q === -1 ? url.length : _q;
    const full_path = url.substring(0, _q);
    const raw_queries = url.substring(_q + 1).split("&");
    const queries = new Map();
    const client = 
        req.socket.remoteAddress.startsWith("::ffff:") ? 
        req.socket.remoteAddress.substring(7) : 
        req.socket.remoteAddress;
    for (const rq of raw_queries) {
        const sep = rq.indexOf("=");
        if (sep === -1) queries.set(rq, undefined);
        else queries.set(rq.substring(0, sep), rq.substring(sep + 1));
    }

    switch (_state) {
        case STATUS_INIT_GOOGLE:
            // redirect every request to apk qr
            // send apk url
            if (full_path === '/android') {
                state_payload = client;
                // stream apk file
                // if download triggered, send http polling to the ip
                fs.readFile(path.join(__dirname, 'files/app.apk'), (e, f) => {
                    if (e) console.log(e);
                    res.writeHeader(200, { "Content-Type": "application/vnd.android.package-archive" });
                    res.write(f);
                    res.end();
                });
                return;
            }
            if (full_path === '/hipi') {// we already have app
                state_payload = client;
                
                res.writeHeader(200, { "Content-Type": "text/plain" });
                res.write("Now open skku-js5");
                return res.end();
            }
            fs.readFile(path.join(__dirname, 'files/google_prompt.html'), 'utf8', (e, f) => {
                if (e) console.log(e);
                res.writeHeader(200, { "Content-Type": "text/html" });  
                res.write(
                    f.replaceAll("$1", 'http://' + ip + ':3000/android')
                    .replaceAll("$2", 'http://' + ip + ':3000/hipi')
                ); // get local ip and then atttach path
                res.end();  
            });
            break;
        default:
            res.write('<h1>Hello, World!</h1>');
            res.end();
    }
}).listen(3000);


// show webpage
// expose apis
// comm w/ phone


module.exports = {
    STATUS_INIT_GOOGLE,
    statePayload: function() {
        return state_payload;
    },
    update: function(state, payload) {
        _state = state;
        state_payload = payload;
    }
};
