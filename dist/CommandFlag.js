"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandFlag = void 0;
/**
 * The CommandFlag class is used to represent a command line flag.
 **/
class CommandFlag {
    constructor(fullname, abbv, subFlags) {
        this.subFlags = subFlags;
        this._name = fullname;
        this._nameShort = abbv;
    }
    get full() { return `--${this._name}`; }
    get short() {
        return `-${this._nameShort}`;
    }
    get value() {
        return this._name;
    }
    get valueShort() {
        return this._nameShort;
    }
    get subFlagsArrs() {
        if (!this.subFlags)
            return [];
        const values = [];
        for (let i = 0; i < this.subFlags.length; i += 1) {
            values.push(this.subFlags[i].full);
            values.push(this.subFlags[i].short);
        }
        return values;
    }
}
exports.CommandFlag = CommandFlag;
