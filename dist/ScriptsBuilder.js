"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptsBuilder = void 0;
const fs_1 = require("fs");
class ScriptsBuilder {
    // eslint-disable-next-line no-useless-constructor
    constructor(path) {
        this.path = path;
    }
    get JSONValue() {
        return `\t"scripts": {
      "start": "webpack serve --mode development",
      "test": "jest",
      "build": "webpack --mode production"
\t},`;
    }
    add() {
        return __awaiter(this, void 0, void 0, function* () {
            let fileData = yield fs_1.readFileSync(`${this.path}\\package.json`).toString('ascii');
            const startValue = '"license": "MIT",';
            fileData = fileData.replace(startValue, `${startValue}\n${this.JSONValue}`);
            yield fs_1.writeFileSync(`${this.path}\\package.json`, fileData);
        });
    }
}
exports.ScriptsBuilder = ScriptsBuilder;
