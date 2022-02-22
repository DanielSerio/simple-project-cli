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
exports.CreateCommand = void 0;
/* eslint-disable node/no-path-concat */
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const process_1 = require("process");
const ScriptsBuilder_1 = require("./ScriptsBuilder");
const path_1 = require("path");
const Command_1 = require("./Command");
/**
 * Represents a cli command.
 * @param
 */
class CreateCommand extends Command_1.Command {
    constructor(flags) {
        super('CREATE', flags);
        this.dependancies = [];
        this.devDependancies = [
            'typescript',
            'sass',
            'webpack',
            'webpack-cli',
            'webpack-dev-server',
            'ts-loader',
            'css-loader',
            'sass-loader',
            'html-webpack-plugin',
            'mini-css-extract-plugin'
        ];
        this.setDeps = (args) => {
            if (args.includes('-r') || args.includes('--react')) {
                this.dependancies.push('react');
                this.dependancies.push('react-dom');
                this.dependancies.push('react-icons');
                this.devDependancies.push('@types/react');
                this.devDependancies.push('@types/react-dom');
            }
            if (args.includes('-rr') || args.includes('--router')) {
                this.dependancies.push('react-router-dom');
                this.devDependancies.push('@types/react-router-dom');
            }
            if (args.includes('-rf') || args.includes('--forms')) {
                this.dependancies.push('react-hook-form');
            }
        };
    }
    get flags() {
        return this._flags;
    }
    get name() {
        return this._name;
    }
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const copySass = () => __awaiter(this, void 0, void 0, function* () {
                return yield this.copyDirTo(path_1.resolve(__dirname, '..\\templates\\scss'), `${process.cwd()}\\src\\scss`);
            });
            this.setDeps(args);
            this._scriptsBuilder = new ScriptsBuilder_1.ScriptsBuilder(`${process.cwd()}\\${args[0]}`);
            yield this.createDir(args[0]);
            yield this.chDir(args[0]);
            yield this.initNPM();
            yield this._scriptsBuilder.add();
            yield this.installDependancies();
            yield this.createDir('src');
            yield this.copyWebpack(args[1] !== undefined && (args[1] === '-r' || args[1] === '--react'));
            if (args[1] === undefined || (args[1] === '--basic' || args[1] === '-b')) {
                const filePath = path_1.resolve(`${__dirname}`, '..\\templates\\basic\\basic.ts');
                const dest = path_1.resolve(`${process.cwd()}\\src\\index.ts`);
                if (yield fs_1.existsSync(filePath)) {
                    if (!(yield fs_1.existsSync(dest))) {
                        const data = yield fs_1.readFileSync(filePath, { encoding: 'ascii' });
                        yield fs_1.closeSync(fs_1.openSync(dest, 'w'));
                        yield fs_1.writeFileSync(dest, data);
                    }
                }
                yield copySass();
            }
            if (args[1] === '--canvas' || args[1] === '-c') {
                const filePath = path_1.resolve(`${__dirname}`, '..\\templates\\basic\\canvas.ts');
                const dest = path_1.resolve(`${process.cwd()}\\src\\index.ts`);
                if (yield fs_1.existsSync(filePath)) {
                    if (!(yield fs_1.existsSync(dest))) {
                        const data = yield fs_1.readFileSync(filePath, { encoding: 'ascii' });
                        yield fs_1.closeSync(fs_1.openSync(dest, 'w'));
                        yield fs_1.writeFileSync(dest, data);
                    }
                }
                yield copySass();
            }
            if (args[1] === '--react' || args[1] === '-r') {
                const rest = args.slice(2);
                const shortIndex = rest.indexOf('-rr');
                const longIndex = rest.indexOf('--router');
                if (shortIndex + longIndex === -2) {
                    yield this.copyDirTo(path_1.resolve(__dirname, '..\\templates\\react\\react-basic'), `${process.cwd()}\\src`)
                        .then(copySass);
                }
                else {
                    yield this.copyDirTo(path_1.resolve(__dirname, '..\\templates\\react\\react-router'), `${process.cwd()}\\src`)
                        .then(copySass);
                }
            }
            yield this.copyHTML(args[0]);
            yield this.copyTSConfig(args[1] === '-r' || args[1] === '--react');
            yield this._scriptsBuilder.add();
        });
    }
    copyHTML(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.resolve(`${__dirname}`, '..\\templates\\template.html');
            const value = yield fs_1.readFileSync(filePath).toString();
            yield fs_1.writeFileSync(`${process.cwd()}\\src\\index.html`, value.replace(/<title>#####<\/title>/gmi, `<title>${title}</title>`));
        });
    }
    copyWebpack(react) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.resolve(`${__dirname}`, `..\\templates\\${react ? 'react' : 'basic'}`, 'webpack.config.js');
            yield child_process_1.execSync(`copy "${filePath}" "${process.cwd()}\\webpack.config.js"`);
        });
    }
    copyDirTo(path, dest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield child_process_1.execSync(`robocopy ${path} ${dest} /e /njh /njs /ndl /nc /ns`);
            }
            catch (e) {
                console.log(e.output.toString());
                if (e.status !== 1)
                    process.exit();
            }
        });
    }
    installDependancies() {
        return __awaiter(this, void 0, void 0, function* () {
            const deps = this.dependancies;
            const devDeps = this.devDependancies;
            if (deps && deps.length > 0) {
                yield child_process_1.execSync(`yarn add ${deps.join(' ')}`);
            }
            yield child_process_1.execSync(`yarn add --dev ${devDeps.join(' ')}`);
        });
    }
    createDir(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield fs_1.existsSync(path);
            if (!exists)
                yield fs_1.mkdirSync(path);
        });
    }
    chDir(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield process_1.chdir(dir);
        });
    }
    initNPM() {
        return __awaiter(this, void 0, void 0, function* () {
            yield child_process_1.execSync('yarn init -y --silent');
        });
    }
    copyTSConfig(react) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.resolve(`${__dirname}`, `..\\templates\\${react ? 'react' : 'basic'}`, 'tsconfig.json');
            yield child_process_1.execSync(`copy "${filePath}" "${process.cwd()}\\tsconfig.json"`);
        });
    }
}
exports.CreateCommand = CreateCommand;
