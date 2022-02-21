"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterFlag = void 0;
const CommandFlag_1 = require("../../CommandFlag");
class RouterFlag extends CommandFlag_1.CommandFlag {
    constructor() {
        super('router', 'rr');
    }
}
exports.RouterFlag = RouterFlag;
