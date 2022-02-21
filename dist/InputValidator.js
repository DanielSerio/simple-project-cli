"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidator = exports.INVALID_REASON = void 0;
var INVALID_REASON;
(function (INVALID_REASON) {
    INVALID_REASON["ARGS_LEN"] = "Invalid input. Too few arguments provided. Expected at least 3";
    INVALID_REASON["URL_SAFE"] = "Invalid input. 'project-name' must be url-safe";
    INVALID_REASON["FLAG_FORMAT"] = "Invalid input. Invalid flag format";
    INVALID_REASON["FLAG_NO_EXISTS"] = "Invalid input. Flag not found";
})(INVALID_REASON = exports.INVALID_REASON || (exports.INVALID_REASON = {}));
/**
 * Represents a CLI input validator.
 */
class InputValidator {
    constructor(projectFlags) {
        /**
         * Check if user input args are valid. Expects nodePath and filepath to be stripped.
         * @returns {true|[false, INVALID_REASON]} true|[false, INVALID_REASON]
         * */
        this.isValid = (inputArgs) => {
            const len = inputArgs.length;
            if (!len)
                return [false, INVALID_REASON.ARGS_LEN];
            // Check if user input project name is valid
            if (!this.isUrlSafe(inputArgs[0]))
                return [false, INVALID_REASON.URL_SAFE];
            // Check if project type flag is valid
            if (len > 1) {
                const projectTypeName = inputArgs[1];
                if (!this.hasValidFlagFormat(projectTypeName))
                    return [false, INVALID_REASON.FLAG_FORMAT];
                if (!this.projectFlagsArray.includes(projectTypeName))
                    return [false, INVALID_REASON.FLAG_NO_EXISTS];
                const projectFlagIndex = this._flags.findIndex((f) => {
                    const { short, full } = f;
                    return [short, full].includes(projectTypeName);
                });
                if (projectFlagIndex < 0)
                    return [false, INVALID_REASON.FLAG_NO_EXISTS];
                const projectFlag = this._flags[projectFlagIndex];
                if ((!projectFlag || !projectFlag.subFlags) && inputArgs[2])
                    return [false, INVALID_REASON.FLAG_NO_EXISTS];
                const rest = inputArgs.slice(2);
                for (let i = 0; i < rest.length; i += 1) {
                    if (!projectFlag.subFlagsArrs.includes(rest[i]))
                        return [false, INVALID_REASON.FLAG_NO_EXISTS];
                }
            }
            return true;
        };
        /**
         * Checks if a string is URL safe.
         * @param {string} value - The string to check.
         * @returns {boolean} - String is url safe.
         */
        this.isUrlSafe = (value) => {
            return /^([a-z]|-|_|\d)+$/.test(value);
        };
        /**
         * Checks if a string has a valid flag format.
         * @param {string} value - The string to check.
         * @returns {boolean} - String has valid flag format.
         */
        this.hasValidFlagFormat = (value) => {
            return /^(--\w+)|(-\w{1,2})$/.test(value);
        };
        this._flags = projectFlags;
    }
    get projectFlagsArray() {
        const values = [];
        for (let i = 0; i < this._flags.length; i += 1) {
            values.push(this._flags[i].full);
            values.push(this._flags[i].short);
        }
        return values;
    }
}
exports.InputValidator = InputValidator;
