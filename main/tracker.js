const { getHandle } = require("./io");
const { getState } = require("./states");

const stuffs_state = getState('stuffs');
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

    onTick() {
        const HUMAN_SENSOR_INDEX = 0;
        
        const sensorNow = this.#handle.Sensors;

        if (this.#state === 0) {
            if (this.#prevSensors[HUMAN_SENSOR_INDEX] === 0 && 
                sensorNow[HUMAN_SENSOR_INDEX] === 1
            ) {
                // TODO: had app in network
                if (true) this.#state = 1;
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

        switch (this.#state) {
            // TODO: pi socket 메시지도 보내도록
            case 0:
                // this.#handle.LEDs = [false, false, false];
                break;
            case 1:
                    // 가져가야하는데 안가져간 거
                break;  
            case 2:
                    // 돌려줘야 하는데 없는 거
                break;
        }



        // read sensor
        // calculate, update state
        // set led

        this.#prevSensors = sensorNow;
    }

    setStuffsFull() {
        // save current sensor val as full
    }

    setStuffsEmpty() {
        // save current sensor val as empty
    }   
}