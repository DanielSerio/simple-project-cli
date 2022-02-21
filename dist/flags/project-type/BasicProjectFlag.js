"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicProjectFlag = void 0;
const CommandFlag_1 = require("../../CommandFlag");
class BasicProjectFlag extends CommandFlag_1.CommandFlag {
    constructor() {
        super('basic', 'b');
    }
}
exports.BasicProjectFlag = BasicProjectFlag;
