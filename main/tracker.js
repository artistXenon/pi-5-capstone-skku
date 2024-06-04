const { getCalendar } = require("./api/google");
const getWeather = require("./api/weather");
const { getHandle } = require("./io");
const { getState } = require("./states");
const { getConn } = require("./ws");

const stuffs_state = getState('stuffs');

let instance;
class Tracker {
    #handle;
    #prev0 = 0;
    #state = 0; //0: idle, 1: going, 2: coming
    #prevSensors = [];

    constructor() {
        this.#handle = getHandle();
        // reset handle
        // load from stuffs state in or out
    }
    /**
     * save state of sensors, app connection
     * give led controls
     * 
     * 
     */

    async onTick() {
        const HUMAN_SENSOR_INDEX = 0;
        
        const sensorNow = this.#handle.Sensors;

        if (this.#state === 0) {
            if (this.#prevSensors[HUMAN_SENSOR_INDEX] === 0 && 
                sensorNow[HUMAN_SENSOR_INDEX] === 1
            ) {
                // TODO: had app in network
                const conn = getConn("app");
                if (conn != null) this.#state = 1;
                else this.#state = 2;
            }
        } else if (sensorNow[HUMAN_SENSOR_INDEX] === 0 && this.#prev0 < Date.now() - 1000 * 60) {
            this.#state = 0;
        }

        if (this.#prevSensors[HUMAN_SENSOR_INDEX] === 1 && 
            sensorNow[HUMAN_SENSOR_INDEX] === 0
        ) {
            this.#prev0 = Date.now();
        }


        const stuffs = getState("stuffs");
        switch (this.#state) {
            // TODO: pi socket 메시지도 보내도록            
            case 0:
                this.#handle.LEDs[0] = 0;
                this.#handle.LEDs[1] = 0;
                this.#handle.LEDs[2] = 0;
                this.#handle.LEDs[3] = 0;

                break;
            case 1:
                // stuffs.Data.profile
                const cal = await getCalendar();
                console.log(cal?.items?.[0]?.summary);
                const wet = await getWeather();
                console.log(wet?.weather?.[0]?.main);
	        this.#handle.LEDs[0] = 1;
                this.#handle.LEDs[1] = 1;
                this.#handle.LEDs[2] = 1;
                this.#handle.LEDs[3] = 0;

                // 오늘 일정 확인
                // 해당 프로필 없으면 전부
                // 있으면 그 물건들
                // 가져가야하는데 안가져간 거
                break;  
            case 2:
                this.#handle.LEDs[0] = 2;
                this.#handle.LEDs[1] = 2;
                this.#handle.LEDs[2] = 2;
                this.#handle.LEDs[3] = 0;

                break;
        }



        // read sensor
        // calculate, update state
        // set led

        this.#prevSensors = sensorNow;
    }  
}

instance = new Tracker();

// TODO: bring path from config
module.exports = {
    getTracker: () => instance
};
