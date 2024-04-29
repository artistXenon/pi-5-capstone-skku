const axios = require('axios');


const { update: updateServerStatus, STATUS_INIT_GOOGLE, statePayload } = require('./server');
const { get, update } = require('./config');
const { onCome, onGo } = require('./human');
const { returnStuffs, onStateUpdate } = require('./stuff');
const { saveToken } = require('./google');
const { wifi, google } = get();

// TODO: forget about wifi. we have predefined wifi already configured in os
// if (!wifi.ap) {
//     //
// }

(async function() {
    if (google.disabled && !google.refresh_token) { // have google credential?
        updateServerStatus(STATUS_INIT_GOOGLE); // remove ip
        let app_ip;
        // TODO: set time out and handle failure of this process. or retry
        
        while (true) {
            await new Promise(r => setTimeout(r, 1000));
            app_ip = statePayload();
            if (!app_ip) continue;
            console.log("saying hi to app");
            try {
                const res = await axios.get('http://' + app_ip + ':9000/hithisispi');
                if (res.data === "OK") {
                    break;
                }
            } catch (e) {
                if (e.code === 'ERR_BAD_REQUEST') continue;
                if (e.code === 'ECONNREFUSED') continue;
                
                console.log(e.code);
                continue;
            }            
        }
        
        while (true) {
            await new Promise(r => setTimeout(r, 1000));
            app_ip = statePayload();
            if (!app_ip) continue;
            console.log("asking for code to app");
            try {
                const res = await axios.get('http://' + app_ip + ':9000/whereismycode');
                if (res.data) {
                    saveToken(res.data);
                    break;
                }
            } catch (e) {
                if (e.code === 'ERR_BAD_REQUEST') continue;
                console.log(e.code);
                continue;
            }            
        }
    }
    
    // check stuffs status
    
    // check if app is in network
    
    
    
    
    // check IO list
    
    
    // start server
    
    
    
    onGo(() => {
        // person going out!
        const stuffs = [];
        // check weather
        //      stuffs.push(); mask/umbrella
        // check stuffs that needs to go
    })
    
    onCome(() => {
        // person came back!
        returnStuffs();
        // additional prompt eg welcome back audio
    });
    
    onStateUpdate((state) => {
        // tell websocket stuff state
    });
    
    // show chrome
    

})();