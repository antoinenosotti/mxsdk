"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mendixplatformsdk_1 = require("mendixplatformsdk");
const runtimebase_1 = require("./runtimebase");
var FetchType;
(function (FetchType) {
    FetchType["Help"] = "help";
    FetchType["Modules"] = "modules";
    FetchType["Entities"] = "entities";
    FetchType["Attributes"] = "attributes";
})(FetchType = exports.FetchType || (exports.FetchType = {}));
var DeleteType;
(function (DeleteType) {
    DeleteType["Help"] = "help";
    DeleteType["WorkingCopy"] = "working_copy";
    DeleteType["Revision"] = "revision";
})(DeleteType = exports.DeleteType || (exports.DeleteType = {}));
class Runtime extends runtimebase_1.RuntimeBase {
    constructor(props) {
        super(props);
        this.branchName = "";
        for (const propName in props) {
            // @ts-ignore
            this[propName] = props[propName];
        }
        if (props._) {
            const commandPassed = props._[0] === `delete` ? this.delete = props._[0] && (props._[1] || DeleteType.Help) :
                props._[0] === `list` ? this.list = true :
                    props._[0] === `load` ? this.load = true :
                        props._[0] === `serve` ? this.serve = true :
                            props._[0] === `shutdown` ? this.shutdown = true :
                                props._[0] === `fetch` ? this.fetch = props._[0] && (props._[1] || FetchType.Help) :
                                    false;
            if (commandPassed && false) {
                this.log(`commandPassed=${props._[0]}`);
            }
        }
    }
    about() {
        this.log(`\x1b[31m ____________  _____           \x1b[34m___  ___     ___________ _   __
\x1b[31m | ___ \\  _  \\/  __ \\          \x1b[34m|  \\/  |    /  ___|  _  \\ | / /     
\x1b[31m | |_/ / | | || /  \\/  \x1b[0m______  \x1b[34m| .  . |_  _\\ \`--.| | | | |/ /    \x1b[0mMendix SDK Helper
\x1b[31m | ___ \\ | | || |     \x1b[0m|______| \x1b[34m| |\\/| \\ \\/ /\`--. \\ | | |    \\    \x1b[0mwritten by Herman Geldenhuys
\x1b[31m | |_/ / |/ / | \\__/\\          \x1b[34m| |  | |>  </\\__/ / |/ /| |\\  \\   \x1b[0mCopyright BDC 2019
\x1b[31m \\____/|___/   \\____/          \x1b[34m\\_|  |_/_/\\_\\____/|___/ \\_| \\_/\x1b[0m   ${(new Date()).toISOString()}`);
        this.table(this);
    }
    getClient() {
        const username = this.username || "unspecified";
        const apiKey = this.apiKey || "unspecified";
        this.client = new mendixplatformsdk_1.MendixSdkClient(username, apiKey);
        return this.client;
    }
    assert(statement, message, logError) {
        if (logError && !statement) {
            this.error(message);
        }
    }
    setServerDefaults(p) {
        /*
        * Set server defaults
        * */
        this.json = true;
        this.serve = false;
        this.shutdownOnValidation = false;
        if (p !== void 0) {
            this.list = p.list;
        }
    }
    safeReturnOrError(result) {
        return __awaiter(this, void 0, void 0, function* () {
            result = yield result;
            if (!result) {
                throw new Error(`Safe return object cannot be empty`);
            }
            if (this.hasErrors()) {
                if (!this.json) {
                    this.red(`An error occurred:`);
                    this.table(this.runtimeError, runtimebase_1.ConsoleColorType.FGRed);
                }
                else {
                    console.log(JSON.stringify({
                        error: this.runtimeError,
                        timeStamp: this.startTime,
                        took: Date.now() - this.startTime
                    }));
                }
                return {
                    error: this.runtimeError,
                    timeStamp: this.startTime,
                    took: Date.now() - this.startTime
                };
            }
            else {
                if (this.json) {
                    console.log(JSON.stringify(result));
                }
                else {
                    this.table(result);
                    this.timeEnd(`\x1b[32mTook\x1b[0m`);
                }
                result.timeStamp = this.startTime;
                result.took = Date.now() - this.startTime;
                return result;
            }
        });
    }
}
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map