import _ from "lodash";
import JoyStick from "legacy/html5-joystick";
import { writable } from 'svelte/store';

export const controller = writable();

class Controller {
    keysDown = {
        "up": false,
        "left": false,
        "right": false,
        "guard": false,
        "attack1": false
    };
    keysReleased = {
        "up": false,
        "left": false,
        "right": false,
        "guard": false,
        "attack1": false
    }
    keyMap = {
        "w" : "up",
        "a": "left",
        "d": "right",
        ",": "guard",
        " ": "attack1"
    };

    _prevJoystick = {x: 0, y: 0}

    constructor(){}
    initialize(id, keyMap) {
        if (this.joystick) return;

        this.keyMap = _.extend({}, this.keyMap, keyMap);
        this.joystick = new JoyStick(id);

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        setInterval(this.checkJoystick.bind(this), 10);
        controller.set(this);
    }


    checkJoystick() {
        let joystickX = this.joystick.GetX();
        let joystickY = this.joystick.GetY();
        if (joystickX != this._prevJoystick.x || joystickY != this._prevJoystick.y) {
            controller.set(this);
        }
        this._prevJoystick = {x: joystickX, y: joystickY};
    }

    isMovingLeft() {
        let joystickX = this.joystick.GetX();
        let joystickMovingLeft = joystickX < 0;
        let keyMovingLeft = (this.keysDown["left"] != false);
        return (joystickMovingLeft || keyMovingLeft);
    }

    isMovingRight() {
        let joystickX = this.joystick.GetX();
        let joystickMovingRight = joystickX > 0;
        let keyMovingRight = (this.keysDown["right"] != false);
        
        return (joystickMovingRight || keyMovingRight);
    }

    isMovingUp() {
        let joystickY = this.joystick.GetY();
        let joystickMovingUp = joystickY > 0;
        let keyMovingUp = (this.keysDown["up"] != false);
        return (joystickMovingUp || keyMovingUp);
    }

    handleKeyDown(event) {
        if (event.repeat) return;

        const newKey = event.map || this.keyMap[event.key];
        if (newKey == "attack1") console.log("attack key down")
        this.keysDown[newKey] = Date.now();
        controller.set(this);
    }

    handleKeyUp(event) {
        const oldKey = event.map || this.keyMap[event.key];
        this.keysDown[oldKey] = false;
        this.keysReleased[oldKey] = true;
        controller.set(this);

        setTimeout(() => {
            this.keysReleased[oldKey] = false;
            controller.set(this);
        }, 40);
    }

    handleActionButton(event) {
        if (_.includes(["mousedown", "touchstart"],event.type)) return this.handleKeyDown({map: "attack1"});
        if (_.includes(["mouseup", "touchend"],event.type)) return this.handleKeyUp({map: "attack1"});
    }

    handleGuardButton(event) {
        if (_.includes(["mousedown", "touchstart"],event.type)) return this.handleKeyDown({map: "guard"});
        if (_.includes(["mouseup", "touchend"],event.type)) return this.handleKeyUp({map: "guard"});
    }
}

export default new Controller();