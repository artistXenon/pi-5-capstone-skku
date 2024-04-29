const fs = require('node:fs');

const CONFIG_PATH = 'config.json';

const DEFAULT_CONFIG = {
    wifi: {
        ap: "pro",
        password: "00000101"
    },
    google: {
        refresh_token: "",
        access_token: "",
        expire: 0,
        disabled: true
    },
    weather: {
        key: "48d84981db9cdacdccceb47dd0c25f1d"
    }
};

let _config = undefined;

if (fs.existsSync(CONFIG_PATH)) {
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    try {
        _config = JSON.parse(data);
    } catch (_) {}
} 

function update(config) {
    if (config === undefined) {
        _config = DEFAULT_CONFIG;
    } else {
        _config = config;
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(_config));    
}
update();

module.exports = {
    get: function() {
        return _config;
    },
    update
};