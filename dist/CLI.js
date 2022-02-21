"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const Command_1 = require("./Command");
const project_type_1 = require("./flags/project-type");
const InputValidator_1 = require("./InputValidator");
const ScriptsBuilder_1 = require("./ScriptsBuilder");
/**
 * The CLI class is the main entry point for the program. It creates a Command object and runs it.
 */
class CLI {
    constructor() {
        this._scriptsBuilder = new ScriptsBuilder_1.ScriptsBuilder(process.cwd());
        const projectFlags = [
            new project_type_1.BasicProjectFlag(),
            new project_type_1.CanvasProjectFlag(),
            new project_type_1.ReactProjectFlag()
        ];
        this._flags = projectFlags;
        this.createCommand = new Command_1.Command('CREATE', projectFlags);
        this.inputValidator = new InputValidator_1.InputValidator(projectFlags);
        const isValid = this.inputValidator.isValid(this.args);
        if (isValid === true) {
            this.createCommand.run(this.args);
            console.log(this._scriptsBuilder.path);
            this._scriptsBuilder.add();
        }
        else {
            const [bool, reason] = isValid;
            console.error({ created: bool, reason });
            process.exit();
        }
    }
    get args() {
        return process.argv.slice(2);
    }
    print() {
        let projectType = 'basic';
        if (this.args.length > 1) {
            const provided = this.args[1];
            const projectTypeFlags = this._flags.filter((f) => {
                return (provided === f.short || provided === f.full);
            });
            if (projectTypeFlags.length)
                projectType = projectTypeFlags[0].value;
        }
        console.log(`Creating ${projectType} project '${this.args[0]}'...`);
    }
}
exports.CLI = CLI;
