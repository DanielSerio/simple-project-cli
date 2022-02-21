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
exports.Command = void 0;
/**
 * Represents a cli command.
 * @param
 */
class Command {
    constructor(name, flags) {
        this._name = name;
        if (flags)
            this._flags = flags;
    }
    get flags() {
        return this._flags;
    }
    get name() {
        return this._name;
    }
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(args);
        });
    }
}
exports.Command = Command;
