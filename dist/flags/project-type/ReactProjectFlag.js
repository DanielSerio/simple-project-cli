"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactProjectFlag = void 0;
const CommandFlag_1 = require("../../CommandFlag");
const FormsFlag_1 = require("../react/FormsFlag");
const RouterFlag_1 = require("../react/RouterFlag");
class ReactProjectFlag extends CommandFlag_1.CommandFlag {
    constructor() {
        super('react', 'r', [
            new RouterFlag_1.RouterFlag(),
            new FormsFlag_1.FormsFlag()
        ]);
    }
}
exports.ReactProjectFlag = ReactProjectFlag;
