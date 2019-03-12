"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mendixplatformsdk_1 = require("mendixplatformsdk");
const emoji = require("node-emoji");
const stopwatch = emoji.get(`stopwatch`);
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
var ConsoleColorType;
(function (ConsoleColorType) {
    ConsoleColorType["Red"] = "\u001B[31m";
    ConsoleColorType["White"] = "\u001B[0m";
})(ConsoleColorType = exports.ConsoleColorType || (exports.ConsoleColorType = {}));
class RuntimeError {
    constructor() {
        this.details = [];
    }
}
exports.RuntimeError = RuntimeError;
class RuntimeArguments {
    constructor(props) {
        this.runtimeError = new RuntimeError();
        this.startTime = Date.now();
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
                            props._[0] === `fetch` ? this.fetch = props._[0] && (props._[1] || FetchType.Help) :
                                false;
            if (commandPassed && false) {
                this.log(`commandPassed=${props._[0]}`);
            }
        }
    }
    time(timer) {
        if (!this.json) {
            console.time(`${stopwatch} ${timer}`);
        }
    }
    timeEnd(timer) {
        if (!this.json) {
            console.timeEnd(`${stopwatch} ${timer}`);
        }
    }
    table(obj, color = ConsoleColorType.White) {
        console.log(color);
        if (!this.json) {
            console.table(obj);
        }
        console.log(ConsoleColorType.White);
    }
    timeStamp(label) {
        if (!this.json) {
            console.timeStamp(label);
        }
    }
    dir(obj) {
        if (!this.json) {
            console.dir(obj, {
                colors: true,
                getters: false,
                showHidden: false,
                breakLength: 3
            });
        }
    }
    log(...args) {
        if (!this.json) {
            console.log(args.join(``));
        }
    }
    green(...args) {
        args.unshift("\x1b[32m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    yellow(...args) {
        args.unshift("\x1b[33m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    red(...args) {
        args.unshift("\x1b[31m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    blue(...args) {
        args.unshift("\x1b[34m");
        args.push("\x1b[0m");
        this.log(args.join(""));
    }
    error(message) {
        if (!this.json) {
            this.red(`Error: ${message}`);
        }
        if (this.runtimeError.details) {
            if (message.error || message.message) {
                this.runtimeError.message = message.message || message.error;
                this.runtimeError.name = message.name;
                this.runtimeError.code = message.code;
            }
            else {
                this.runtimeError.details.push(message + "");
            }
        }
    }
    warn(message) {
        if (!this.json) {
            console.warn(`Error: ${message}`);
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
    hasErrors() {
        // @ts-ignore
        return !!this.runtimeError.message || !!this.runtimeError.details.length;
    }
    safeReturnOrError(result) {
        if (!result) {
            throw new Error(`Safe return object cannot be empty`);
        }
        if (this.hasErrors()) {
            if (!this.json) {
                this.red(`An error occurred:`);
                this.table(this.runtimeError, ConsoleColorType.Red);
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
    }
}
exports.RuntimeArguments = RuntimeArguments;
//# sourceMappingURL=runtimearguments.js.map